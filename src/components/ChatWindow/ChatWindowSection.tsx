import styles from "./ChatWindowSection.module.css";
import CurrentChatSendMessage from "./CurrentChatSendMessage";
import CurrentChatHeader from "./CurrentChatHeader";
import CurrentChatWindow from "./CurrentChatWindow";
import AESService from "../../services/AESService";

export default function ChatWindowSection({ aesService }: { aesService: React.MutableRefObject<AESService | null>}) {
    console.log("ChatWindowSection");

    return (
        <section className={styles.chatWindow}>
            <CurrentChatHeader />
            <CurrentChatWindow />
            <CurrentChatSendMessage aesService={aesService}/>
        </section>
    );
}