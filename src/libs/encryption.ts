/* eslint-disable @typescript-eslint/no-explicit-any */
import CryptoJS from "crypto-js";

const SECRET_KEY = "ss7IC2FbQhDUXpWUX1Ex2ZV02PaDcpOz4UVZ3JQ5QKQ=";

export const decryptionKey =
  "alskjfalsjdkflasdjkfoiweroi34rjk34r90349i3409309fi";

// Function to encrypt data
export const encryptData = (data: any) => {
  return CryptoJS.AES.encrypt(JSON.stringify(data), SECRET_KEY).toString();
};

// Function to decrypt data
export const decryptData = (ciphertext: string) => {
  try {
    const bytes = CryptoJS.AES.decrypt(ciphertext, SECRET_KEY);
    return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
  } catch (error) {
    console.error("Decryption failed:", error);
    return null;
  }
};
