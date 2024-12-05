import { useEffect, useRef } from "react";
import styles from "./Chat.module.css";
import ChatWindowSection from "./ChatWindow/ChatWindowSection";
import UsersListSection from "./UsersList/UsersListSection";
import { closeConnection, onGetAsymmetricPublicKey, onGetAsymmetricPublicKeyUnsubscribe, onReceiveMessage, onReceiveMessageUnsubscribe, startConnection } from "../services/ChatHubService";
import AESService from "../services/AESService";
import { useChatMessagesContext } from "../stores/ChatMessagesContext";
import { addMessage, closeDB, getMessages, getMessagesByUsername, initDB } from "../services/IndexedDbService";
import { Message } from "../dtos/Message";
import { useAuth } from "../stores/AuthContext";

export default function Chat() {
    console.log("Chat");
    const { password } = useAuth();
    const aesService = useRef<AESService | null>(null);
    const { addMessage: addMessageToChat, setChatMessages } = useChatMessagesContext();
    
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
                const newMessage: Message = {
                    username,
                    message,
                    order:  (await getMessagesByUsername(username)).length
                };
    
                await addMessage(newMessage);
    
                newMessage.message = await aesService.current?.decryptMessage(message)!;
    
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
    }, [addMessageToChat, setChatMessages, password]);
    
    return (
        <div className={styles.chat}>
            <ChatWindowSection />
            <UsersListSection />
        </div>
    );
}