/**
 * Reference data for VPN tunnelling protocols. The cryptography each protocol
 * uses is largely fixed by the protocol itself, so this is accurate regardless
 * of provider; per-provider specifics live on the VPN record (encryption.*).
 * Used by the detail-page "Protocols & encryption" section only.
 */

export type ProtocolRating = "modern" | "trusted" | "legacy";

export interface ProtocolInfo {
  name: string;
  summary: string;
  dataCipher: string;
  keyExchange: string;
  integrity: string;
  rating: ProtocolRating;
}

export const PROTOCOLS: Record<"wireguard" | "openvpn" | "ikev2", ProtocolInfo> = {
  wireguard: {
    name: "WireGuard",
    summary:
      "A modern, lean protocol (~4,000 lines of code) that is fast and easy to audit. Its cryptography is fixed and state-of-the-art, with no weak options to misconfigure.",
    dataCipher: "ChaCha20-Poly1305",
    keyExchange: "Curve25519 (ECDH)",
    integrity: "BLAKE2s",
    rating: "modern",
  },
  openvpn: {
    name: "OpenVPN",
    summary:
      "The mature, widely-trusted open-source standard. Flexible and heavily audited over two decades, though slower than WireGuard.",
    dataCipher: "AES-256-GCM",
    keyExchange: "RSA-4096 / ECDH",
    integrity: "SHA-256 / SHA-512 HMAC",
    rating: "trusted",
  },
  ikev2: {
    name: "IKEv2 / IPsec",
    summary:
      "A fast, stable protocol that reconnects quickly when you change networks, so it is popular on mobile. Built natively into most operating systems.",
    dataCipher: "AES-256-GCM",
    keyExchange: "Diffie-Hellman (ECP)",
    integrity: "SHA-256 / SHA-384",
    rating: "trusted",
  },
};
