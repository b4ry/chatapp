const jwtToken: string = "jwtToken";

export function saveToken(token: string) {
    localStorage.setItem(jwtToken, token);
}

export function getToken() {
    return localStorage.getItem(jwtToken);
}

export function removeToken() {
    localStorage.removeItem(jwtToken);
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

