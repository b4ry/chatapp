import { createContext, ReactNode, useState } from "react";

interface ILoginContext {
    isUserLoggedIn: boolean;
    setIsUserLoggedIn: React.Dispatch<React.SetStateAction<boolean>>
}

export const LoginContext = createContext<ILoginContext>(
    {
        isUserLoggedIn: false,
        setIsUserLoggedIn: () => {}
    }
);

interface LoginContextProviderProps {
    children?: ReactNode;
}

const LoginContextProvider: React.FC<LoginContextProviderProps> = ( { children } ) => {
    const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);

    return (
        <LoginContext.Provider value={{ isUserLoggedIn, setIsUserLoggedIn }}>
            {children}
        </LoginContext.Provider>
    );
}

export default LoginContextProvider;