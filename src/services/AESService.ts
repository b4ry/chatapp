import { storeSymmetricKey } from "./ChatHubService";
import { parseRSAKey } from "./RSAService";

export default class AESService {
    private aesKey: CryptoKey | null = null;
    private aesIV: Uint8Array = new Uint8Array();
    private passwordKey: CryptoKey | null = null;
    private salt: Uint8Array = new Uint8Array([19,88,163,26,214,181,196,117,74,199,4,172,99,180,206,135]);

    async initialize(password: string, publicKey: string) {
        this.passwordKey = await this.deriveKey(password);
        const username = localStorage.getItem("username");

        if(username) {
            const aesKey = localStorage.getItem(`${username}_AesKey`);

            if(!aesKey) {
                await this.generateAESKey();
                this.storeAesKey(username);
            } else {
                await this.getAesKey(username);
            }
        }

        this.sendSymmetricKey(publicKey);
    }

    async generateAESKey() {
        this.aesKey = await window.crypto.subtle.generateKey(
            { 
                name: "AES-CBC",
                length: 256
            },
            true,
            ["encrypt", "decrypt"]
        );

        this.aesIV = window.crypto.getRandomValues(new Uint8Array(16));
    }

    async deriveKey(password: string): Promise<CryptoKey> {
        const enc = new TextEncoder();
        const keyMaterial = await crypto.subtle.importKey(
            'raw',
            enc.encode(password),
            'PBKDF2',
            false,
            ['deriveKey']
        );

        return crypto.subtle.deriveKey(
            { 
                name: 'PBKDF2',
                salt: this.salt,
                iterations: 100000,
                hash: 'SHA-256'
            },
            keyMaterial,
            {
                name: 'AES-GCM',
                length: 256
            },
            true,
            ['encrypt', 'decrypt']
        );
    }

    async encryptWithPasswordKey(plainText: string): Promise<string> {
        const enc = new TextEncoder();
        const encryptedText = await crypto.subtle.encrypt(
            {
                name: 'AES-GCM',
                iv: this.aesIV
            },
            this.passwordKey!,
            enc.encode(plainText)
        );

        const encryptedTextBytes = new Uint8Array(encryptedText);

        return String.fromCharCode.apply(null, encryptedTextBytes as unknown as number[]);
    };

    async decryptWithPasswordKey(encryptedString: string): Promise<string> {
        const encryptedTextBytes = new Uint8Array(encryptedString.split('').map(char => char.charCodeAt(0)));
        const decryptedText = await crypto.subtle.decrypt(
            {
                name: 'AES-GCM',
                iv: this.aesIV
            },
            this.passwordKey!,
            encryptedTextBytes
        );
        
        const dec = new TextDecoder();

        return dec.decode(decryptedText);
    }

    async encryptMessage(message: string): Promise<string> {
        const enc = new TextEncoder();
        const encryptedText = await crypto.subtle.encrypt(
            {
                name: 'AES-CBC',
                iv: this.aesIV
            },
            this.aesKey!,
            enc.encode(message)
        );

        const encryptedTextBytes = new Uint8Array(encryptedText);
        const binaryString = String.fromCharCode.apply(null, encryptedTextBytes as unknown as number[]);

        return btoa(binaryString);
    }

    async decryptMessage(message: string): Promise<string> {
        const encryptedTextBytes = this.base64ToUint8Array(message);
        const decryptedText = await crypto.subtle.decrypt(
            {
                name: 'AES-CBC',
                iv: this.aesIV
            },
            this.aesKey!,
            encryptedTextBytes
        );
        
        const dec = new TextDecoder();

        return dec.decode(decryptedText);
    }

    private base64ToUint8Array(base64String: string): Uint8Array {
        const binaryString = atob(base64String);
        const length = binaryString.length;
        const bytes = new Uint8Array(length);
        
        for (let i = 0; i < length; i++) {
            bytes[i] = binaryString.charCodeAt(i);
        }
        
        return bytes;
    }

    async storeAesKey(username: string) {
        const rawKey = await window.crypto.subtle.exportKey("raw", this.aesKey!);
        const keyBytes = new Uint8Array(rawKey);

        const aesKeyBinary = String.fromCharCode.apply(null, keyBytes as unknown as number[]);
        const aesIVBinary = String.fromCharCode.apply(null, this.aesIV as unknown as number[]);

        const encryptedKey = await this.encryptWithPasswordKey(aesKeyBinary);

        localStorage.setItem(`${username}_AesKey`, btoa(encryptedKey));
        localStorage.setItem(`${username}_AesIV`, btoa(aesIVBinary));
    }

    async getAesKey(username: string) {
        const iv = atob(localStorage.getItem(`${username}_AesIV`)!);
        this.aesIV = new Uint8Array(iv.split('').map(char => char.charCodeAt(0)));

        const aesKey = atob(localStorage.getItem(`${username}_AesKey`)!);
        const decryptedAesKey = await this.decryptWithPasswordKey(aesKey!);
        const decryptedAesKeyBytes = new Uint8Array(decryptedAesKey.split('').map(char => char.charCodeAt(0)));
        this.aesKey = await window.crypto.subtle.importKey("raw", decryptedAesKeyBytes, { name: "AES-CBC", length: 256 }, true, ["encrypt", "decrypt"]);
    }

    async sendSymmetricKey(rsaPublicKey: string) {
        const rsa = parseRSAKey(rsaPublicKey);
    
        const rawKey = await window.crypto.subtle.exportKey("raw", this.aesKey!);
        const keyBytes = new Uint8Array(rawKey);

        // to binary string
        const aesIVBinary = String.fromCharCode.apply(null, this.aesIV as unknown as number[]);
        const aesKeyBinary = String.fromCharCode.apply(null, keyBytes as unknown as number[]);
    
        const encryptedAesKey = rsa.encrypt(aesKeyBinary);
        const encryptedAesIV = rsa.encrypt(aesIVBinary);

        // to base64
        const encryptedAesKeyBase64 = btoa(encryptedAesKey);
        const encryptedAesIVBase64 = btoa(encryptedAesIV);
    
        await storeSymmetricKey([encryptedAesKeyBase64, encryptedAesIVBase64]);
    }
}