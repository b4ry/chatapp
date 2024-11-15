import { AuthToken } from "../dtos/AuthToken";

const accessTokenStorageItemKey: string = "accessToken";
const refreshTokenStorageItemKey: string = "refreshToken";

export function saveToken(authToken: AuthToken) {
    localStorage.setItem(accessTokenStorageItemKey, authToken.accessToken);
    localStorage.setItem(refreshTokenStorageItemKey, authToken.refreshToken);
}

export function getToken() {
    return { "accessToken": localStorage.getItem(accessTokenStorageItemKey), refreshToken: localStorage.getItem(refreshTokenStorageItemKey) };
}

export function removeToken() {
    localStorage.removeItem(accessTokenStorageItemKey);
    localStorage.removeItem(refreshTokenStorageItemKey);
}

export function getTokenExpiration(token: string) {
    try {
        const payloadBase64 = token.split('.')[1];
        const decodedPayload = JSON.parse(atob(payloadBase64));
        const exp = decodedPayload.exp;

        return exp * 1000;
    } catch (error) {
        return null;
    }
}

