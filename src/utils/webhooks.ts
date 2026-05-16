export async function verifyWebhookSignature(
  rawBody: string,
  signature: string,
  secret: string,
): Promise<boolean> {
  const signatureHex = signature.replace(/^sha256=/, "");

  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );

  const mac = await crypto.subtle.sign("HMAC", key, encoder.encode(rawBody));
  const macArray = new Uint8Array(mac);
  const hexPairs = signatureHex.match(/.{1,2}/g);
  if (!hexPairs) return false;
  const sigArray = Uint8Array.from(hexPairs.map((byte) => parseInt(byte, 16)));

  if (macArray.length !== sigArray.length) return false;
  let match = true;
  for (let i = 0; i < macArray.length; i++) {
    if (macArray[i] !== sigArray[i]) match = false;
  }
  return match;
}
