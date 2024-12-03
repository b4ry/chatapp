import styles from "./CurrentChatWindow.module.css";

type Message = {
    sender: string;
    message: string;
}

export default function CurrentChatWindow() {
    const messages: Message[] = [ 
        { sender: "me", message: "Hello there!" },
        { sender: "you", message: "How are you today?" },
        { sender: "me", message: "This is a collection of messages." },
        { sender: "me", message: "Hello there!" },
        { sender: "me", message: "How are you today?" },
        { sender: "me", message: "This is a collection of messages." },
        { sender: "me", message: "Hello there!" },
        { sender: "you", message: "How are you today?" },
        { sender: "me", message: "This is a collection of messages." },
        { sender: "me", message: "Hello there!" },
        { sender: "you", message: "How are you today?" },
        { sender: "me", message: "This is a collection of messages." },
        { sender: "me", message: "Hello there!" },
        { sender: "me", message: "How are you today?" },
        { sender: "me", message: "This is a collection of messages." },
        { sender: "me", message: "Hello there!" },
        { sender: "you", message: "How are you today?" },
        { sender: "me", message: "This is a collection of messages." }, ];

    return (
        <div className={styles.currentChatWindow}>
            {messages.map(message => 
                <div className={`${styles.message} ${message.sender === "me" ? styles.userMessage : styles.externalMessage }`}>{message.message}</div>
            )}
        </div>
    );
}