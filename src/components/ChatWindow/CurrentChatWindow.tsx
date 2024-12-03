import { useChatMessagesContext } from "../../stores/ChatMessagesContext";
import styles from "./CurrentChatWindow.module.css";

export default function CurrentChatWindow() {
    const { chatMessages, currentChatUser } = useChatMessagesContext();
    
    return (
        <div className={styles.currentChatWindow}>
            {chatMessages.get(currentChatUser)!.map(message => 
                <div className={`${styles.message} ${message.sender === "me" ? styles.userMessage : styles.externalMessage }`}>{message.message}</div>
            )}
        </div>
    );
}