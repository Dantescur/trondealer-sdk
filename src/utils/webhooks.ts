export async function verifyWebhookSignature(
  rawBody: string,
  signatureHex: string,
  secret: string,
): Promise<boolean> {
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
  const sigArray = Uint8Array.from(
    signatureHex.match(/.{1,2}/g)!.map((byte) => parseInt(byte, 16)),
  );

  // Timing-safe comparison
  if (macArray.length !== sigArray.length) return false;
  let match = true;
  for (let i = 0; i < macArray.length; i++) {
    if (macArray[i] !== sigArray[i]) match = false;
  }
  return match;
}
