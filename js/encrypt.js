const CIPHER_KEY = 'XYZABCDEFGHIJKLMNOPQRSTUVW';

function encryptAnswer(answer) {
    // Step 1: Convert to base 36 and pad to ensure it's always 2 characters
    let encoded = (answer + 1).toString(36).padStart(2, '0');
    
    // Step 2: Apply substitution cipher
    let substituted = '';
    for (let i = 0; i < encoded.length; i++) {
        let charCode = encoded.charCodeAt(i);
        if (charCode >= 65 && charCode <= 90) {
            substituted += CIPHER_KEY[charCode - 65];
        } else if (charCode >= 97 && charCode <= 122) {
            substituted += CIPHER_KEY[charCode - 97].toLowerCase();
        } else {
            substituted += encoded[i];
        }
    }
    
    // Step 3: Add random padding (3 random characters)
    let padding = Math.random().toString(36).substring(2, 5);
    substituted += padding;
    
    // Step 4: Encode to Base64
    return btoa(substituted);
}

// Example usage
for (let i = 0; i < 4; i++) {
    console.log(`Answer ${i}: ${encryptAnswer(i)}`);
}
