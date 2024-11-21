import { useEffect } from "react";
import styles from "./Chat.module.css";
import ChatWindowSection from "./ChatWindow/ChatWindowSection";
import UsersListSection from "./UsersList/UsersListSection";
import { closeConnection, invokeStoreSymmetricKey, onGetAsymmetricPublicKey, onGetAsymmetricPublicKeyUnsubscribe, startConnection } from "../services/ChatHubService";
import { parseRSAKey } from "../services/RSAService";
import { generateAESKey } from "../services/AESService";
import forge from "node-forge";

export default function Chat() {
    useEffect(() => {
        const initConnection = async () => await startConnection();

        initConnection();

        onGetAsymmetricPublicKey(async (publicKey: string) => {
            const rsa = parseRSAKey(publicKey);

            var { keyBytes: aesKey, iv: aesIV } = await generateAESKey();

            const aesKeyBinary = String.fromCharCode.apply(null, aesKey as unknown as number[]);
            const aesIVBinary = String.fromCharCode.apply(null, aesIV as unknown as number[]);
            
            const encryptedAesKey = rsa.encrypt(aesKeyBinary);
            const encryptedAesIV = rsa.encrypt(aesIVBinary);
            
            // Encode the encrypted data as Base64
            const encryptedAesKeyBase64 = forge.util.encode64(encryptedAesKey);
            const encryptedAesIVBase64 = forge.util.encode64(encryptedAesIV);
            
            // Store encrypted AES key and IV in localStorage
            localStorage.setItem("encryptedAesKey", encryptedAesKeyBase64);
            localStorage.setItem("encryptedAesIV", encryptedAesIVBase64);

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