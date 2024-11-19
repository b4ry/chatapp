import * as signalR from "@microsoft/signalr";
import * as signalRMsgPack from "@microsoft/signalr-protocol-msgpack";

const onUserJoinsChatEndpointName: string = "UserJoinsChat";
const onUserLogsOutEndpointName: string = "UserLogsOut";
const onGetUsersEndpointName: string = "GetUsers";

const connection = new signalR.HubConnectionBuilder()
    .withUrl(process.env.REACT_APP_SOCRATES_API_URL, {
        accessTokenFactory: () => {
            const token = localStorage.getItem("accessToken");

            return token || "";
        },
        transport: signalR.HttpTransportType.WebSockets
    })
    .withAutomaticReconnect()
    .configureLogging(signalR.LogLevel.Debug)
    .withHubProtocol(new signalRMsgPack.MessagePackHubProtocol())
    .build();

export const startConnection = async (): Promise<void> => {
    try {
        if (connection.state === signalR.HubConnectionState.Disconnected) {
            await connection.start();

            console.log("Connected to SignalR");
        }
    } catch (err) {
        console.error("SignalR Connection Error: ", err);
    }
};

export const closeConnection = async (): Promise<void> => {
    try {
        if(connection.state === signalR.HubConnectionState.Connected) {
            await connection.stop();

            console.log("SignalR connection closed");
        }
    } catch (err) {
        console.error("SignalR connection close Error: ", err);
    }
}

export const getConnection = () => connection;

export const onUserJoinsChat = (callback: (joiningUsername: string) => void): void => {
    connection.on(onUserJoinsChatEndpointName, callback);
};

export const onUserJoinsChatUnsubscribe = () => {
    connection.off(onUserJoinsChatEndpointName);
}

export const onUserLogsOut = (callback: (disconnectingUsername: string) => void): void => {
    connection.on(onUserLogsOutEndpointName, callback);
}

export const onUserLogsOutUnsubscribe = () => {
    connection.off(onUserLogsOutEndpointName);
}

export const onGetUsers = (callback: (users: string[]) => void): void => {
    connection.on(onGetUsersEndpointName, callback);
}

export const onGetUsersUnsubscribe = () => {
    connection.off(onGetUsersEndpointName);
}

export const onGetAsymmetricPublicKey = (callback: (publicKey: string) => void): void => {
    connection.on("GetAsymmetricPublicKey", callback);
};