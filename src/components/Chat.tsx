import { useEffect, useRef, useState } from "react";
import styles from "./Chat.module.css";
import ChatWindowSection from "./ChatWindow/ChatWindowSection";
import UsersListSection from "./UsersList/UsersListSection";
import {
    closeConnection,
    onGetAsymmetricPublicKey,
    onGetAsymmetricPublicKeyUnsubscribe,
    onReceiveMessage,
    onReceiveMessageUnsubscribe,
    startConnection
} from "../services/ChatHubService";
import AESService from "../services/AESService";
import { useChatMessagesContext } from "../stores/ChatMessagesContext";
import { addMessage, closeDB, getMessages, initDB } from "../services/IndexedDbService";
import { Message } from "../dtos/Message";
import { useAuthContext } from "../stores/AuthContext";

export default function Chat() {
    console.log("Chat");

    const { password } = useAuthContext();
    const { addMessage: addMessageToChat, setChatMessages } = useChatMessagesContext();
    const aesService = useRef<AESService | null>(null);
    const [connected, setConnected] = useState(false);
    
    useEffect(() => {
        const initConnection = async () => await startConnection();

        initConnection().then(() => {
            onGetAsymmetricPublicKey(async (publicKey: string) => {
                aesService.current = new AESService();
                aesService.current.initialize(password, publicKey).then(async () => {
                    await initDB();
                    setConnected(true);
                });
            });
        });

        return () => {
            const cleanup = async () => {
                onGetAsymmetricPublicKeyUnsubscribe();
                closeDB();
                await closeConnection();
                setConnected(false);
            }

            cleanup();
        };
    }, [password]);

    useEffect(() => {   
        const loadInitialMessages = async() => {
            const storedMessages = await getMessages();
    
            storedMessages.forEach(async message => {
                message.message = await aesService.current!.decryptMessage(message.message)!;
    
                setChatMessages(prev => {
                    const newMap = new Map(prev);
                    const userMessages = newMap.get(message.username) || [];
        
                    userMessages.push(message);
                    newMap.set(message.username, userMessages);
                    
                    return newMap;
                });
            });
        }

        loadInitialMessages();
    }, [setChatMessages, connected])

    useEffect(() => {
        onReceiveMessage(async (username: string, message: string) => {     
            const id = (await addMessage(username, message, true)) as number;

            // TODO: refactor this and maybe move everything to addMessageToChat
            const decryptedMessage = await aesService.current?.decryptMessage(message)!;
            const newMessage: Message = {
                message: decryptedMessage,
                username,
                id,
                external: true
            };

            addMessageToChat(newMessage);
        });

        return () => {
            const cleanup = async () => {
                onReceiveMessageUnsubscribe();
            }

            cleanup();
        };
    }, [addMessageToChat, connected])
    
    return (
        <div className={styles.chat}>
            <ChatWindowSection aesService={aesService}/>
            <UsersListSection />
        </div>
    );
}