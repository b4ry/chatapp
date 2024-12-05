import { useChatMessagesContext } from "../../stores/ChatMessagesContext";
import styles from "./CurrentChatWindow.module.css";

export default function CurrentChatWindow() {
    console.log("CurrentChatWindow");
    const { chatMessages, currentChatUser } = useChatMessagesContext();
    const loggedInAsUsername = localStorage.getItem("username");

    return (
        <div className={styles.currentChatWindow}>
            {chatMessages.get(currentChatUser)?.map(message => 
                <div
                    key={message.order}
                    className={`${styles.message} ${message.username === loggedInAsUsername ? styles.userMessage : styles.externalMessage }`}
                >
                    {message.message}
                </div>
            )}
        </div>
    );
}