export function base64ToBlob(base64: string, contentType = ''): Blob | null {
    try {
      // Validate input type
      if (typeof base64 !== 'string') {
        throw new Error('Invalid base64 input: Input must be a string');
      }
  
      // Remove any whitespace or newlines in the Base64 string
      base64 = base64.replace(/\s/g, '');
  
      // Decode Base64 to raw binary data (Uint8Array)
      const binaryString = atob(base64);
      const buffer = Uint8Array.from(binaryString, (char) => char.charCodeAt(0));
  
      // Create a Blob from the buffer
      return new Blob([buffer], { type: contentType });
    } catch (error) {
      console.error('Failed to convert base64 to Blob:', error);
      return null; // Return null on failure
    }
  }
  