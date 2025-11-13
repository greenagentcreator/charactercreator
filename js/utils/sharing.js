// Character sharing utilities for URL-based sharing

/**
 * Encode character data to compressed Base64 for URL sharing
 * Uses LZ-String compression to reduce URL length
 * @param {Object} characterData - The character data object
 * @returns {string} Compressed Base64 encoded string
 */
export function encodeCharacterForUrl(characterData) {
    try {
        const jsonString = JSON.stringify(characterData);
        
        // Use LZ-String compression if available (loaded from CDN)
        if (typeof LZString !== 'undefined') {
            const compressed = LZString.compressToBase64(jsonString);
            return compressed;
        } else {
            // Fallback to regular Base64 if LZ-String is not available
            const base64 = btoa(unescape(encodeURIComponent(jsonString)));
            return base64;
        }
    } catch (error) {
        console.error('Error encoding character for URL:', error);
        throw new Error('Failed to encode character data');
    }
}

/**
 * Decode character data from compressed Base64 URL parameter
 * @param {string} compressedBase64 - Compressed Base64 encoded character data
 * @returns {Object|null} Decoded character data or null if invalid
 */
export function decodeCharacterFromUrl(compressedBase64) {
    try {
        let jsonString;
        
        // Try LZ-String decompression first (if available)
        if (typeof LZString !== 'undefined') {
            jsonString = LZString.decompressFromBase64(compressedBase64);
            if (!jsonString) {
                // If decompression fails, try regular Base64 (backward compatibility)
                jsonString = decodeURIComponent(escape(atob(compressedBase64)));
            }
        } else {
            // Fallback to regular Base64
            jsonString = decodeURIComponent(escape(atob(compressedBase64)));
        }
        
        const characterData = JSON.parse(jsonString);
        return characterData;
    } catch (error) {
        console.error('Error decoding character from URL:', error);
        return null;
    }
}

/**
 * Get character data from URL hash
 * @returns {Object|null} Character data if found in URL, null otherwise
 */
export function getCharacterFromUrl() {
    const hash = window.location.hash;
    if (!hash || !hash.startsWith('#character=')) {
        return null;
    }
    
    const base64Data = hash.substring('#character='.length);
    if (!base64Data) {
        return null;
    }
    
    return decodeCharacterFromUrl(base64Data);
}

/**
 * Create a shareable URL with character data
 * Uses compression to reduce URL length
 * @param {Object} characterData - The character data object
 * @returns {string} Shareable URL
 */
export function createShareableUrl(characterData) {
    try {
        const compressed = encodeCharacterForUrl(characterData);
        const currentUrl = window.location.origin + window.location.pathname;
        const shareableUrl = `${currentUrl}#character=${compressed}`;
        
        // Check URL length (browsers typically have ~2000 character limit, but some support more)
        // With compression, we can handle larger characters, but still check for safety
        if (shareableUrl.length > 8000) {
            throw new Error('Character data too large for URL sharing even with compression');
        }
        
        return shareableUrl;
    } catch (error) {
        console.error('Error creating shareable URL:', error);
        throw error;
    }
}

/**
 * Copy text to clipboard
 * @param {string} text - Text to copy
 * @returns {Promise<boolean>} True if successful, false otherwise
 */
export async function copyToClipboard(text) {
    try {
        if (navigator.clipboard && navigator.clipboard.writeText) {
            await navigator.clipboard.writeText(text);
            return true;
        } else {
            // Fallback for older browsers
            const textArea = document.createElement('textarea');
            textArea.value = text;
            textArea.style.position = 'fixed';
            textArea.style.left = '-999999px';
            document.body.appendChild(textArea);
            textArea.select();
            const success = document.execCommand('copy');
            document.body.removeChild(textArea);
            return success;
        }
    } catch (error) {
        console.error('Error copying to clipboard:', error);
        return false;
    }
}

