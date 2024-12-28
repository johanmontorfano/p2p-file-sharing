export function supportIntegrity() {
    return window.crypto !== undefined && window.crypto !== null;
}

/** Generates the SHA-256 hash of an array buffer */
export async function getHash(text: ArrayBuffer) {
    const hash = await crypto.subtle.digest("SHA-256", text);
    
    return Array.from(new Uint8Array(hash))
        .map(b => String.fromCharCode(b)).join("");
}
