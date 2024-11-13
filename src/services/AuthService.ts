import { AuthToken } from "../dtos/AuthToken";

const jwtToken: string = "jwtToken";
const refreshToken: string = "refreshToken";

export function saveToken(authToken: AuthToken) {
    localStorage.setItem(jwtToken, authToken.jwt);
    localStorage.setItem(refreshToken, authToken.refreshToken);
}

export function getToken() {
    return [localStorage.getItem(jwtToken), localStorage.getItem(refreshToken)];
}

export function removeToken() {
    localStorage.removeItem(jwtToken);
    localStorage.removeItem(refreshToken);
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

