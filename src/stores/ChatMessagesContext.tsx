import { createContext, ReactNode, useCallback, useContext, useState } from "react";
import { Message } from "../dtos/Message";

interface IChatMessagesContext {
    chatMessages: Map<string, Message[]>;
    unreadMessages: Set<string>;
    currentChatUser: string;
    setChatUser: (newChatUser: string) => void;
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
    const [unreadMessages, setUnreadMessages] = useState(new Set<string>());

    const addMessage = useCallback((message: Message) => {
        setChatMessages(prev => {
            const newMap = new Map(prev);
            const userMessages = newMap.get(message.username) || [];

            userMessages.push(message);
            newMap.set(message.username, userMessages);

            if(message.username !== currentChatUser) {
                setUnreadMessages(prev => new Set<string>(prev).add(message.username));
            }
            
            return newMap;
        });
    }, [currentChatUser]);

    const setChatUser = useCallback((newChatUser: string) => {
        setCurrentChatUser(newChatUser);
        setUnreadMessages(prev => {
            const newUnreadMessages = new Set<string>(prev);
            newUnreadMessages.delete(newChatUser);

            return newUnreadMessages;
        });
    }, []);

    return (
        <ChatMessagesContext.Provider value={{ chatMessages, unreadMessages, currentChatUser, setChatUser, addMessage, setChatMessages }}>
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