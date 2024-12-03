import { useEffect, useRef } from "react";
import styles from "./Chat.module.css";
import ChatWindowSection from "./ChatWindow/ChatWindowSection";
import UsersListSection from "./UsersList/UsersListSection";
import { closeConnection, onGetAsymmetricPublicKey, onGetAsymmetricPublicKeyUnsubscribe, onReceiveMessage, onReceiveMessageUnsubscribe, startConnection } from "../services/ChatHubService";
import AESService from "../services/AESService";
import ChatMessagesContextProvider from "../stores/ChatMessagesContext";

export default function Chat() {
    const aesService = useRef<AESService | null>(null);
    
    useEffect(() => {
        const initConnection = async () => await startConnection();

        initConnection();

        onGetAsymmetricPublicKey(async (publicKey: string) => {
            aesService.current = new AESService("Test123!", publicKey);
        });

        onReceiveMessage(async (username: string, message: string) => {
            console.log("user " + username);
            console.log("message " + message);
            console.log("decryptedMessage " + await aesService.current?.decryptMessage(message));
        });

        return () => {
            const cleanup = async () => {
                onGetAsymmetricPublicKeyUnsubscribe();
                onReceiveMessageUnsubscribe();
                await closeConnection();
            }

            cleanup();
        };
    }, []);
    
    return (
        <ChatMessagesContextProvider>
            <div className={styles.chat}>
                <ChatWindowSection />
                <UsersListSection />
            </div>
        </ChatMessagesContextProvider>
    );
}