const DIGITS = "0123456789";
const HEX = "0123456789abcdef";

function randomChars(charset: string, length: number): string {
  return Array.from(
    { length },
    () => charset[Math.floor(Math.random() * charset.length)] ?? "0",
  ).join("");
}

export const randomDigits = (n: number): string => randomChars(DIGITS, n);
export const randomHex = (n: number): string => randomChars(HEX, n);

export const generateDeviceId = (): string => "7" + randomDigits(18);
export const generateIid = (): string => "7" + randomDigits(18);
export const generateOpenUdid = (): string => randomHex(16);
export const generateUuid = (): string => randomDigits(16);
