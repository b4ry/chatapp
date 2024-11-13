import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { getToken, getTokenExpiration, removeToken, saveToken } from "../services/AuthService";

interface IAuthContext {
    isAuthenticated: boolean;
    login: (token: string) => void;
    logout: () => void;
}

export const AuthContext = createContext<IAuthContext | undefined>(undefined);

interface AuthContextProviderProps {
    children?: ReactNode;
}

const AuthContextProvider: React.FC<AuthContextProviderProps> = ( { children } ) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        const token = getToken();

        if (token) {
            const expirationTime = getTokenExpiration(token);

            if (expirationTime && Date.now() < expirationTime) {
                setIsAuthenticated(true);

                const timeUntilExpiration = expirationTime - Date.now();
                const expirationTimeout = setTimeout(() => {
                    logout();
                }, timeUntilExpiration);

                return () => clearTimeout(expirationTimeout);
            } else {
                removeToken();
            }
        }
    }, []);

    const login = (token: string) => {
        saveToken(token);
        setIsAuthenticated(true);

        const expirationTime = getTokenExpiration(token);

        if (expirationTime) {
            const timeUntilExpiration = expirationTime - Date.now();
            
            setTimeout(() => {
                logout();
            }, timeUntilExpiration);
        }
    };

    const logout = () => {
        removeToken();
        setIsAuthenticated(false);
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export default AuthContextProvider;

export const useAuth = () => {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }

    return context;
};