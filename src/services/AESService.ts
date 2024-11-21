export async function generateAESKey() {
    const key = await window.crypto.subtle.generateKey(
        { 
            name: "AES-CBC",
            length: 256
        },
        true,
        ["encrypt", "decrypt"]
    );
    
    const iv = window.crypto.getRandomValues(new Uint8Array(16));
    const rawKey = await window.crypto.subtle.exportKey("raw", key);
    const keyBytes = new Uint8Array(rawKey);
    
    return { keyBytes, iv };
}