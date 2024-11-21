import forge from "node-forge";

export function parseRSAKey(xml: string) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(xml, 'application/xml');
    const modulus = doc.getElementsByTagName('Modulus')[0].textContent;
    const exponent = doc.getElementsByTagName('Exponent')[0].textContent;
    
    if (!modulus || !exponent) {
        throw new Error('Invalid RSA key XML');
    }
    
    const modulusBytes = forge.util.decode64(modulus);
    const exponentBytes = forge.util.decode64(exponent);
    
    const rsa = forge.pki.rsa.setPublicKey(
        new forge.jsbn.BigInteger(forge.util.bytesToHex(modulusBytes), 16),
        new forge.jsbn.BigInteger(forge.util.bytesToHex(exponentBytes), 16)
    );
    
    return rsa;
}