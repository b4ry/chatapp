import styles from "./ChatWindowSection.module.css";
import CurrentChatSendMessage from "./CurrentChatSendMessage";
import CurrentChatHeader from "./CurrentChatHeader";
import CurrentChatWindow from "./CurrentChatWindow";

export default function ChatWindowSection() {
    return (
        <section className={styles.chatWindow}>
            <CurrentChatHeader />
            <CurrentChatWindow />
            <CurrentChatSendMessage />
        </section>
    );
}