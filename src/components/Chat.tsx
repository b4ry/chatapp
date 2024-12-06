import { useEffect, useRef } from "react";
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
    const { addMessage: addMessageToChat } = useChatMessagesContext();
    const aesService = useRef<AESService | null>(null);
    
    useEffect(() => {
        const initConnection = async () => await startConnection();

        initConnection().then(() => {
            onGetAsymmetricPublicKey(async (publicKey: string) => {
                aesService.current = new AESService();

                aesService.current.initialize(password, publicKey).then(async () => {
                    await initDB();
                    const storedMessages = await getMessages();
    
                    storedMessages.forEach(async message => {
                        message.message = await aesService.current!.decryptMessage(message.message)!;
    
                        addMessageToChat(message);
                    });
                });
            });
    
            onReceiveMessage(async (username: string, message: string) => {     
                const id = (await addMessage(username, message, true)) as number;
    
                // TODO: refactor this and maybe move everything to addMessageToChat
                const decryptedMessage = await aesService.current?.decryptMessage(message)!;
    
                const newMessage: Message = {
                    message: decryptedMessage,
                    username,
                    id,
                    external: true
                }

                addMessageToChat(newMessage);
            });
        });

        return () => {
            const cleanup = async () => {
                onGetAsymmetricPublicKeyUnsubscribe();
                onReceiveMessageUnsubscribe();
                closeDB();
                await closeConnection();
            }

            cleanup();
        };
    }, [addMessageToChat, password]);
    
    return (
        <div className={styles.chat}>
            <ChatWindowSection aesService={aesService}/>
            <UsersListSection />
        </div>
    );
}