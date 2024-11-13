import { createContext, ReactNode, useCallback, useContext, useEffect, useRef, useState } from "react";
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
    const timer = useRef<NodeJS.Timeout | null>(null);

    const clearTimer = useCallback(() => {
        clearTimeout(timer.current!);
        timer.current = null
    }, []);

    const logout = useCallback(() => {
        if (timer.current) {
            clearTimer();
        }

        removeToken();
        setIsAuthenticated(false);
    }, [clearTimer]);

    const startLogoutTimer = useCallback((expirationTime: number) => {
        const timeUntilExpiration = expirationTime - Date.now();
        
        if (timer.current) {
            clearTimeout(timer.current);
        }

        timer.current = setTimeout(() => {
            logout();
        }, timeUntilExpiration);
    }, [logout]);

    useEffect(() => {
        const token = getToken();
        const expirationTime = token && getTokenExpiration(token);

        if (token && expirationTime && Date.now() < expirationTime) {
            setIsAuthenticated(true);
            startLogoutTimer(expirationTime);
        } else {
            removeToken();
        }

        return () => {
            if (timer.current) {
                clearTimer();
            }
        };
    }, [startLogoutTimer, clearTimer]);

    const login = useCallback((token: string) => {
        saveToken(token);
        setIsAuthenticated(true);

        const expirationTime = getTokenExpiration(token);

        if (expirationTime) {
            startLogoutTimer(expirationTime);
        }
    }, [startLogoutTimer]);

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