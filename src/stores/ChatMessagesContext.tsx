import { createContext, ReactNode, useContext, useState } from "react";
import { Message } from "../dtos/Message";

interface IChatMessagesContext {
    chatMessages: Map<string, Message[]>;
    currentChatUser: string;
    setCurrentChatUser: (currentChatUser: string) => void;
}

export const ChatMessagesContext = createContext<IChatMessagesContext | undefined>(undefined);

interface ChatMessagesContextProviderProps {
    children?: ReactNode;
}

const ChatMessagesContextProvider: React.FC<ChatMessagesContextProviderProps> = ( { children } ) => {
    const [currentChatUser, setCurrentChatUser] = useState("Server");

    const chatMessages = new Map();
    chatMessages.set("Server", [] as Message[]);

    return (
        <ChatMessagesContext.Provider value={{ chatMessages, currentChatUser, setCurrentChatUser }}>
            {children}
        </ChatMessagesContext.Provider>
    );
}

export default ChatMessagesContextProvider;

export const useChatMessagesContext = () => {
    const context = useContext(ChatMessagesContext);

    if (!context) {
        throw new Error('useChatMessagesContext must be used within a ChatMessagesContextProvider');
    }

    return context;
};