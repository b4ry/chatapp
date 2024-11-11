import styles from "./Chat.module.css";
import ChatWindow from "./ChatWindow/ChatWindow";
import UsersList from "./UsersList";

export default function Chat() {
    return (
        <div className={styles.chat}>
            <ChatWindow />
            <UsersList />
        </div>
    );
}