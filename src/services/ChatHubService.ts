import * as signalR from "@microsoft/signalr";
import * as signalRMsgPack from "@microsoft/signalr-protocol-msgpack";

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

export const onUserJoinsChat = (callback: (user: string) => void): void => {
    connection.on("UserJoinsChat", callback);
};

export const onGetAsymmetricPublicKey = (callback: (publicKey: string) => void): void => {
    connection.on("GetAsymmetricPublicKey", callback);
};

export const onUserLogsOut = (callback: (user: string) => void): void => {
    connection.on("UserLogsOut", callback);
};