import { useChatMessagesContext } from "../../stores/ChatMessagesContext";
import styles from "./CurrentChatWindow.module.css";

export default function CurrentChatWindow() {
    console.log("CurrentChatWindow");
    const { getUserMessages } = useChatMessagesContext();

    return (
        <div className={styles.currentChatWindow}>
            {getUserMessages()?.map(message => 
                <div
                    key={message.timestamp}
                    className={`${styles.message} ${message.external ? styles.externalMessage : styles.userMessage}`}
                >
                    {message.message}
                </div>
            )}
        </div>
    );
}