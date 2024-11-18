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
        await connection.start();
        console.log("Connected to SignalR");
    } catch (err) {
        console.error("SignalR Connection Error: ", err);
    }
};

export const onUserJoinsChat = (callback: (user: string) => void): void => {
    connection.on("UserJoinsChat", callback);
};
