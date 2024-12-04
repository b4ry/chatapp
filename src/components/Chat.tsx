import { useEffect, useRef } from "react";
import styles from "./Chat.module.css";
import ChatWindowSection from "./ChatWindow/ChatWindowSection";
import UsersListSection from "./UsersList/UsersListSection";
import { closeConnection, onGetAsymmetricPublicKey, onGetAsymmetricPublicKeyUnsubscribe, onReceiveMessage, onReceiveMessageUnsubscribe, startConnection } from "../services/ChatHubService";
import AESService from "../services/AESService";
import { useChatMessagesContext } from "../stores/ChatMessagesContext";
import { addMessage, closeDB, getMessagesByUsername, initDB } from "../services/IndexedDbService";
import { Message } from "../dtos/Message";

const SERVER_USERNAME = "Server";

export default function Chat() {
    console.log("Chat");
    const aesService = useRef<AESService | null>(null);
    const { chatMessagesRef, addMessage: addMessageToChat } = useChatMessagesContext();
    
    useEffect(() => {
        const initConnection = async () => await startConnection();

        initConnection().then(() => {
            onGetAsymmetricPublicKey(async (publicKey: string) => {
                aesService.current = new AESService();
    
                // TODO: use real password
                aesService.current.initialize("Test123!", publicKey).then(async () => {
                    await initDB();
                    const storedMessages = await getMessagesByUsername(SERVER_USERNAME);
    
                    storedMessages.forEach(async message => {
                        message.message = await aesService.current!.decryptMessage(message.message)!;
    
                        addMessageToChat(SERVER_USERNAME, message);
                    });
                });
            });
    
            onReceiveMessage(async (username: string, message: string) => {
                if(!chatMessagesRef.current.has(username)) {
                    chatMessagesRef.current.set(username, [] as Message[]);
                }
    
                const newMessage: Message = {
                    username,
                    message,
                    order: chatMessagesRef.current.get(username)?.length!
                };
    
                await addMessage(newMessage);
    
                newMessage.message = await aesService.current?.decryptMessage(message)!;
    
                chatMessagesRef.current.get(username)?.push(newMessage);
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
    }, [chatMessagesRef, addMessageToChat]);
    
    return (
        <div className={styles.chat}>
            <ChatWindowSection />
            <UsersListSection />
        </div>
    );
}