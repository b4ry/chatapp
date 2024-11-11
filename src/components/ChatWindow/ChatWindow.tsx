import styles from "./ChatWindow.module.css";
import CurrentChatSendMessage from "./CurrentChatSendMessage";
import CurrentChatUser from "./CurrentChatUser";
import CurrentChatWindow from "./CurrentChatWindow";

export default function ChatWindow() {
    return (
        <div className={styles.chatWindow}>
            <CurrentChatUser />
            <CurrentChatWindow />
            <CurrentChatSendMessage />
        </div>
    );
}