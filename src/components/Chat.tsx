import { useEffect } from "react";
import styles from "./Chat.module.css";
import ChatWindowSection from "./ChatWindow/ChatWindowSection";
import UsersListSection from "./UsersList/UsersListSection";
import { closeConnection, invokeStoreSymmetricKey, onGetAsymmetricPublicKey, onGetAsymmetricPublicKeyUnsubscribe, startConnection } from "../services/ChatHubService";
import { parseRSAKey } from "../services/RSAService";
import { generateAESKey } from "../services/AESService";
import forge from "node-forge";

function storeAesKey(encryptedAesKey: string, encryptedAesIV: string) {
    const encryptedAesKeyBase64 = forge.util.encode64(encryptedAesKey);
    const encryptedAesIVBase64 = forge.util.encode64(encryptedAesIV);

    const username = localStorage.getItem("username");

    localStorage.setItem(`${username}_AesKey`, encryptedAesKeyBase64);
    localStorage.setItem(`${username}_AesIV`, encryptedAesIVBase64);
}

export default function Chat() {
    useEffect(() => {
        const initConnection = async () => await startConnection();

        initConnection();

        onGetAsymmetricPublicKey(async (publicKey: string) => {
            const rsa = parseRSAKey(publicKey);

            var { aesKeyBinary, aesIVBinary } = await generateAESKey();

            const encryptedAesKey = rsa.encrypt(aesKeyBinary);
            const encryptedAesIV = rsa.encrypt(aesIVBinary);
            
            storeAesKey(encryptedAesKey, encryptedAesIV);

            const encryptedAesKeyBytes = Uint8Array.from(encryptedAesKey, c => c.charCodeAt(0));
            const encryptedAesIVBytes = Uint8Array.from(encryptedAesIV, c => c.charCodeAt(0));

            await invokeStoreSymmetricKey([encryptedAesKeyBytes, encryptedAesIVBytes]);
        });

        return () => {
            const cleanup = async () => {
                onGetAsymmetricPublicKeyUnsubscribe();
                await closeConnection();
            }

            cleanup();
        };
    }, []);
    
    return (
        <div className={styles.chat}>
            <ChatWindowSection />
            <UsersListSection />
        </div>
    );
}