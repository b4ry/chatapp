import { useEffect } from "react";
import styles from "./Chat.module.css";
import ChatWindowSection from "./ChatWindow/ChatWindowSection";
import UsersListSection from "./UsersList/UsersListSection";
import { startConnection } from "../services/ChatHubService";

export default function Chat() {
    useEffect(() => {
        const initConnection = async () => await startConnection();
        initConnection();
    }, []);
    
    return (
        <div className={styles.chat}>
            <ChatWindowSection />
            <UsersListSection />
        </div>
    );
}