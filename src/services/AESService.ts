export async function generateAESKey() {
    const key = await window.crypto.subtle.generateKey(
        { 
            name: "AES-CBC",
            length: 256
        },
        true,
        ["encrypt", "decrypt"]
    );
    
    const ivBytes = window.crypto.getRandomValues(new Uint8Array(16));
    const rawKey = await window.crypto.subtle.exportKey("raw", key);
    const keyBytes = new Uint8Array(rawKey);
    
    return { keyBytes, ivBytes };
}

export async function deriveKey(password: string, salt: Uint8Array): Promise<CryptoKey> {
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
            salt: salt,
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

export async function encryptString(password: string, ivBytes: Uint8Array, plainText: string): Promise<string> {
    const enc = new TextEncoder();
    const salt = crypto.getRandomValues(new Uint8Array(16));
    const key = await deriveKey(password, salt);
    const encryptedText = await crypto.subtle.encrypt(
        {
            name: 'AES-GCM',
            iv: ivBytes
        },
        key,
        enc.encode(plainText)
    );

    // const decryptedText = await crypto.subtle.decrypt(
    //     {
    //         name: 'AES-GCM',
    //         iv: ivBytes
    //     },
    //     key,
    //     encryptedText
    // );

    // const dec = new TextDecoder();
    // const a = dec.decode(decryptedText);

    const encryptedTextBytes = new Uint8Array(encryptedText);
    
    return String.fromCharCode.apply(null, encryptedTextBytes as unknown as number[]);
};

export async function storeAesKey(username: string, key: string, ivBytes: Uint8Array) {
    const encryptedKey = await encryptString("Test123!", ivBytes, key);
    const aesIVBinary = String.fromCharCode.apply(null, ivBytes as unknown as number[]);

    localStorage.setItem(`${username}_AesKey`, encryptedKey);
    localStorage.setItem(`${username}_AesIV`, aesIVBinary);
}