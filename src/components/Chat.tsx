import { useEffect } from "react";
import styles from "./Chat.module.css";
import ChatWindowSection from "./ChatWindow/ChatWindowSection";
import UsersListSection from "./UsersList/UsersListSection";
import { closeConnection, invokeStoreSymmetricKey, onGetAsymmetricPublicKey, onGetAsymmetricPublicKeyUnsubscribe, startConnection } from "../services/ChatHubService";
import { parseRSAKey } from "../services/RSAService";
import { generateAESKey, storeAesKey } from "../services/AESService";
import { useAuth } from "../stores/AuthContext";

async function sendSymmetricKey(key: string, ivBytes: Uint8Array, rsaPublicKey: string) {
    const rsa = parseRSAKey(rsaPublicKey);

    const aesIVBinary = String.fromCharCode.apply(null, ivBytes as unknown as number[]);

    const encryptedAesKey = rsa.encrypt(key);
    const encryptedAesIV = rsa.encrypt(aesIVBinary);
    const encryptedAesKeyBytes = Uint8Array.from(encryptedAesKey, c => c.charCodeAt(0));
    const encryptedAesIVBytes = Uint8Array.from(encryptedAesIV, c => c.charCodeAt(0));

    await invokeStoreSymmetricKey([encryptedAesKeyBytes, encryptedAesIVBytes]);
}

export default function Chat() {
    const { logout } = useAuth();

    useEffect(() => {
        const initConnection = async () => await startConnection();

        initConnection();

        const username = localStorage.getItem("username");

        if(username) {
            const aesKey = localStorage.getItem(`${username}_AesKey`);

            if(!aesKey) {
                onGetAsymmetricPublicKey(async (publicKey: string) => {
                    const { keyBytes, ivBytes } = await generateAESKey();

                    const aesKeyBinary = String.fromCharCode.apply(null, keyBytes as unknown as number[]);

                    storeAesKey(username, aesKeyBinary, ivBytes);
                    await sendSymmetricKey(aesKeyBinary, ivBytes, publicKey);
                });
            }
        } else {
            logout();
        }

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