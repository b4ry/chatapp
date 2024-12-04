import { createContext, ReactNode, useCallback, useContext, useRef, useState } from "react";
import { Message } from "../dtos/Message";

interface IChatMessagesContext {
    chatMessagesRef: React.MutableRefObject<Map<string, Message[]>>;
    currentChatUser: string;
    setCurrentChatUser: (currentChatUser: string) => void;
    addMessage: (key: string, message: Message) => void;
}

export const ChatMessagesContext = createContext<IChatMessagesContext | undefined>(undefined);

interface ChatMessagesContextProviderProps {
    children?: ReactNode;
}

const ChatMessagesContextProvider: React.FC<ChatMessagesContextProviderProps> = ( { children } ) => {
    const [currentChatUser, setCurrentChatUser] = useState("Server");
    const chatMessagesRef = useRef(new Map<string, Message[]>([ ["Server", [] as Message[]] ]));

    const addMessage = useCallback((key: string, message: Message) => {
        const messages = chatMessagesRef.current.get(key) || [];
        
        messages.push(message);
        chatMessagesRef.current.set(key, messages);
    }, []);

    return (
        <ChatMessagesContext.Provider value={{ chatMessagesRef, currentChatUser, setCurrentChatUser, addMessage }}>
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