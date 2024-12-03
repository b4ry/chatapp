import { useChatMessagesContext } from "../../stores/ChatMessagesContext";
import styles from "./CurrentChatHeader.module.css";

export default function CurrentChatHeader() {
    const { currentChatUser } = useChatMessagesContext();

    return <div className={styles.currentChatHeader}><p>{currentChatUser}</p></div>;
}