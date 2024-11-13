import { createContext, ReactNode, useCallback, useContext, useEffect, useRef, useState } from "react";
import { getToken, getTokenExpiration, removeToken, saveToken } from "../services/AuthService";
import { AuthToken } from "../dtos/AuthToken";

interface IAuthContext {
    isAuthenticated: boolean;
    login: (authToken: AuthToken) => void;
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
        const [jwtToken, refreshToken] = getToken();
        const expirationTime = jwtToken && getTokenExpiration(jwtToken);

        if (jwtToken && expirationTime && Date.now() < expirationTime) {
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

    const login = useCallback((authToken: AuthToken) => {
        saveToken(authToken);
        setIsAuthenticated(true);

        const expirationTime = getTokenExpiration(authToken.jwt);

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