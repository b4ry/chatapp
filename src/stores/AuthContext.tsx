import { createContext, ReactNode, useCallback, useContext, useEffect, useRef, useState } from "react";
import { getToken, getTokenExpiration, removeToken, saveToken } from "../services/AuthService";
import { AuthToken } from "../dtos/AuthToken";
import { RefreshTokenRequest } from "../dtos/RefreshTokenRequest";

interface IAuthContext {
    isAuthenticated: boolean;
    login: (authToken: AuthToken) => void;
    logout: () => void;
}

export const AuthContext = createContext<IAuthContext | undefined>(undefined);

interface AuthContextProviderProps {
    children?: ReactNode;
}

const usernameStorageItemKey: string = "username";
const accessTokenStorageItemKey: string = "accessToken";

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
        localStorage.removeItem(usernameStorageItemKey);
    }, [clearTimer]);

    const startLogoutTimer = useCallback((expirationTime: number) => {
        const timeUntilExpiration = expirationTime - Date.now();
        
        if (timer.current) {
            clearTimer();
        }

        timer.current = setTimeout(async () => {
            const { refreshToken } = getToken();
            const username = localStorage.getItem(usernameStorageItemKey);

            if(refreshToken && username) {
                const refreshTokenRequest: RefreshTokenRequest = { refreshTokenId: refreshToken, username };

                const response = await fetch(process.env.REACT_APP_CERBERUS_API_AUTH_REFRESH_TOKEN_URL!, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(refreshTokenRequest),
                })

                if (response.ok) {
                    const authToken: AuthToken = await response.json();
                    const expirationTime = getTokenExpiration(authToken.accessToken);

                    if (expirationTime) {
                        localStorage.setItem(accessTokenStorageItemKey, authToken.accessToken);
                        startLogoutTimer(expirationTime);
                    } else {
                        logout();
                    }
                } else {
                    logout();
                }
            } else {
                logout();
            }
        }, timeUntilExpiration);
    }, [logout, clearTimer]);

    useEffect(() => {
        const { accessToken } = getToken();
        const expirationTime = accessToken && getTokenExpiration(accessToken);

        if (accessToken && expirationTime && Date.now() < expirationTime) {
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

        const expirationTime = getTokenExpiration(authToken.accessToken);

        if (expirationTime) {
            startLogoutTimer(expirationTime);
        } else {
            logout();
        }
    }, [startLogoutTimer, logout]);

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