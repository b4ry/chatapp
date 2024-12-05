import { createContext, ReactNode, useCallback, useContext, useState } from "react";
import { Message } from "../dtos/Message";

interface IChatMessagesContext {
    chatMessages: Map<string, Message[]>;
    currentChatUser: string;
    setCurrentChatUser: (currentChatUser: string) => void;
    addMessage: (message: Message) => void;
    setChatMessages: React.Dispatch<React.SetStateAction<Map<string, Message[]>>>;
}

export const ChatMessagesContext = createContext<IChatMessagesContext | undefined>(undefined);

interface ChatMessagesContextProviderProps {
    children?: ReactNode;
}

const ChatMessagesContextProvider: React.FC<ChatMessagesContextProviderProps> = ( { children } ) => {
    const [currentChatUser, setCurrentChatUser] = useState("Server");
    const [chatMessages, setChatMessages] = useState(new Map<string, Message[]>([ ["Server", []] ]));

    const addMessage = useCallback((message: Message) => {
        setChatMessages(prev => {
            const newMap = new Map(prev);
            const userMessages = newMap.get(message.username) || [];
            
            if (!userMessages.some(msg => msg.id === message.id)) {
                userMessages.push(message);
                newMap.set(message.username, userMessages);
            }
            
            return newMap;
        });
    }, []);

    return (
        <ChatMessagesContext.Provider value={{ chatMessages, currentChatUser, setCurrentChatUser, addMessage, setChatMessages }}>
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