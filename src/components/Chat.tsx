import { useEffect, useRef } from "react";
import styles from "./Chat.module.css";
import ChatWindowSection from "./ChatWindow/ChatWindowSection";
import UsersListSection from "./UsersList/UsersListSection";
import { closeConnection, onGetAsymmetricPublicKey, onGetAsymmetricPublicKeyUnsubscribe, onReceiveMessage, onReceiveMessageUnsubscribe, startConnection } from "../services/ChatHubService";
import AESService from "../services/AESService";
import { useChatMessagesContext } from "../stores/ChatMessagesContext";
import { addMessage, closeDB, getMessages, initDB } from "../services/IndexedDbService";
import { Message } from "../dtos/Message";

export default function Chat() {
    const aesService = useRef<AESService | null>(null);
    const { chatMessages } = useChatMessagesContext();
    
    useEffect(() => {
        const initConnection = async () => await startConnection();

        initConnection();

        onGetAsymmetricPublicKey(async (publicKey: string) => {
            aesService.current = new AESService("Test123!", publicKey);
        });

        onReceiveMessage(async (username: string, message: string) => {
            if(!chatMessages.has(username)) {
                chatMessages.set(username, [] as Message[]);
            }

            const newMessage: Message = {
                username,
                message,
                order: chatMessages.get(username)?.length! + 1
            };

            await addMessage(newMessage);
        });

        const fetchMessages = async () => {
            await initDB();
            const storedMessages = await getMessages();

            console.log(storedMessages);
        };
        
        fetchMessages();

        return () => {
            const cleanup = async () => {
                onGetAsymmetricPublicKeyUnsubscribe();
                onReceiveMessageUnsubscribe();
                closeDB();
                await closeConnection();
            }

            cleanup();
        };
    }, []);
    
    return (
        <div className={styles.chat}>
            <ChatWindowSection />
            <UsersListSection />
        </div>
    );
}