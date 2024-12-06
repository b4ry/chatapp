import * as signalR from "@microsoft/signalr";
import * as signalRMsgPack from "@microsoft/signalr-protocol-msgpack";

enum ListenerMethodNames {
    UserJoinsChat = "UserJoinsChat",
    UserLogsOut = "UserLogsOut",
    GetUsers = "GetUsers",
    GetAsymmetricPublicKey = "GetAsymmetricPublicKey",
    ReceiveMessage = "ReceiveMessage"
}

enum ChatHubEndpointNames {
    StoreSymmetricKey = "StoreSymmetricKey",
    SendMessage = "SendMessage"
}

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
    connection.on(ListenerMethodNames.UserJoinsChat, callback);
};

export const onUserJoinsChatUnsubscribe = () => {
    connection.off(ListenerMethodNames.UserJoinsChat);
}

export const onUserLogsOut = (callback: (disconnectingUsername: string) => void): void => {
    connection.on(ListenerMethodNames.UserLogsOut, callback);
}

export const onUserLogsOutUnsubscribe = () => {
    connection.off(ListenerMethodNames.UserLogsOut);
}

export const onGetUsers = (callback: (users: string[]) => void): void => {
    connection.on(ListenerMethodNames.GetUsers, callback);
}

export const onGetUsersUnsubscribe = () => {
    connection.off(ListenerMethodNames.GetUsers);
}

export const onGetAsymmetricPublicKey = (callback: (publicKey: string) => void): void => {
    connection.on(ListenerMethodNames.GetAsymmetricPublicKey, callback);
};

export const onGetAsymmetricPublicKeyUnsubscribe = () => {
    connection.off(ListenerMethodNames.GetAsymmetricPublicKey);
}

export const onReceiveMessage = (callback: (username: string, message: string) => void): void => {
    connection.on(ListenerMethodNames.ReceiveMessage, callback);
}

export const onReceiveMessageUnsubscribe = () => {
    connection.off(ListenerMethodNames.ReceiveMessage);
}

export const storeSymmetricKey = async (encryptedAes: [string, string]) => {
    await connection.invoke(ChatHubEndpointNames.StoreSymmetricKey, encryptedAes);
}

export const sendMessage = async (user: string, message: string) => {
    await connection.invoke(ChatHubEndpointNames.SendMessage, user, message);
}