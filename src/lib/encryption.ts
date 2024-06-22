export function encrypt(key: string, password: string) {
  const encoder = new TextEncoder();
  const [encodedKey, encodedPassword] = [encoder.encode(key), encoder.encode(password)];
}
