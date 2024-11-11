import styles from "./ChatWindowSection.module.css";
import CurrentChatSendMessage from "./CurrentChatSendMessage";
import CurrentChatUser from "./CurrentChatUser";
import CurrentChatWindow from "./CurrentChatWindow";

export default function ChatWindowSection() {
    return (
        <section className={styles.chatWindow}>
            <CurrentChatUser />
            <CurrentChatWindow />
            <CurrentChatSendMessage />
        </section>
    );
}