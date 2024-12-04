import { Message } from "../../dtos/Message";
import { useChatMessagesContext } from "../../stores/ChatMessagesContext";
import styles from "./CurrentChatWindow.module.css";

export default function CurrentChatWindow() {
    console.log("CurrentChatWindow");
    const { chatMessagesRef, currentChatUser } = useChatMessagesContext();
    const loggedInAsUsername = localStorage.getItem("username");

    if(!chatMessagesRef.current.has(currentChatUser)) {
        chatMessagesRef.current.set(currentChatUser, [] as Message[]);
    }
    
    return (
        <div className={styles.currentChatWindow}>
            {chatMessagesRef.current.get(currentChatUser)!.map(message => 
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