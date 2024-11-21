import { useEffect } from "react";
import styles from "./Chat.module.css";
import ChatWindowSection from "./ChatWindow/ChatWindowSection";
import UsersListSection from "./UsersList/UsersListSection";
import { closeConnection, onGetAsymmetricPublicKey, onGetAsymmetricPublicKeyUnsubscribe, startConnection } from "../services/ChatHubService";

export default function Chat() {
    useEffect(() => {
        const initConnection = async () => await startConnection();

        initConnection();

        onGetAsymmetricPublicKey((publicKey: string) => {
            console.log(publicKey);
        });

        return () => {
            const cleanup = async () => {
                onGetAsymmetricPublicKeyUnsubscribe();
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