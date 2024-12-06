import { useState } from "react";
import styles from "./CurrentChatSendMessage.module.css";
import AESService from "../../services/AESService";
import { sendMessage } from "../../services/ChatHubService";
import { useChatMessagesContext } from "../../stores/ChatMessagesContext";
import { addMessage } from "../../services/IndexedDbService";
import { Message } from "../../dtos/Message";

const ENTER_KEY: string = "Enter";

export default function CurrentChatSendMessage({ aesService }: { aesService: React.MutableRefObject<AESService | null>}) {
    console.log("CurrentChatSendMessage");

    const { currentChatUser, addMessage: addMessageToChat } = useChatMessagesContext();
    const [inputValue, setInputValue] = useState('');

    const handleKeyDown = async (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (event.key === ENTER_KEY) {
            event.preventDefault();
            
            const encryptedMessage = await aesService.current?.encryptMessage(inputValue);

            const id = (await addMessage(currentChatUser, encryptedMessage!, false)) as number;
            const newMessage: Message = {
                message: inputValue,
                username: currentChatUser,
                id,
                external: false
            }

            addMessageToChat(newMessage);
  
            await sendMessage(currentChatUser, encryptedMessage!);
        }
    };

    return (
        <div className={styles.currentChatSendMessage}>
            <textarea className={styles.messageArea} rows={1} onChange={(e) => setInputValue(e.target.value)} onKeyDown={handleKeyDown}></textarea>
        </div>
    );
}