import { useChatMessagesContext } from "../../stores/ChatMessagesContext";
import styles from "./CurrentChatWindow.module.css";

export default function CurrentChatWindow() {
    console.log("CurrentChatWindow");
    const { chatMessages, currentChatUser } = useChatMessagesContext();

    return (
        <div className={styles.currentChatWindow}>
            {chatMessages.get(currentChatUser)?.map(message => 
                <div
                    key={message.id}
                    className={`${styles.message} ${message.external ? styles.externalMessage : styles.userMessage}`}
                >
                    {message.message}
                </div>
            )}
        </div>
    );
}