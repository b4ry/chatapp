import { useEffect } from "react";
import styles from "./Chat.module.css";
import ChatWindowSection from "./ChatWindow/ChatWindowSection";
import UsersListSection from "./UsersList/UsersListSection";
import { closeConnection, startConnection } from "../services/ChatHubService";

export default function Chat() {
    useEffect(() => {
        const initConnection = async () => await startConnection();

        initConnection();

        return () => {
            const cleanup = async () => await closeConnection();
            
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