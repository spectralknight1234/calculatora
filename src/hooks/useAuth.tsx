import React, { useState, useEffect } from "react";

const PASSWORD_SECRET = "senha-super-secreta"; // Troque por algo mais seguro
const SALT = "salt-unica";

async function getKey() {
  const enc = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey(
    "raw",
    enc.encode(PASSWORD_SECRET),
    "PBKDF2",
    false,
    ["deriveKey"]
  );

  return crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt: enc.encode(SALT),
      iterations: 100000,
      hash: "SHA-256",
    },
    keyMaterial,
    { name: "AES-GCM", length: 256 },
    false,
    ["encrypt", "decrypt"]
  );
}

async function encrypt(text: string) {
  const key = await getKey();
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const enc = new TextEncoder();
  const encrypted = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv },
    key,
    enc.encode(text)
  );

  const buffer = new Uint8Array(iv.byteLength + encrypted.byteLength);
  buffer.set(iv, 0);
  buffer.set(new Uint8Array(encrypted), iv.byteLength);

  return btoa(String.fromCharCode(...buffer));
}

async function decrypt(data: string) {
  const key = await getKey();
  const buffer = Uint8Array.from(atob(data), (c) => c.charCodeAt(0));
  const iv = buffer.slice(0, 12);
  const encrypted = buffer.slice(12);

  const decrypted = await crypto.subtle.decrypt(
    { name: "AES-GCM", iv },
    key,
    encrypted
  );

  const dec = new TextDecoder();
  return dec.decode(decrypted);
}

export function EncryptedCredentials() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [saved, setSaved] = useState(false);
  const [loadedEmail, setLoadedEmail] = useState<string | null>(null);
  const [loadedPassword, setLoadedPassword] = useState<string | null>(null);

  const saveCredentials = async () => {
    const encryptedEmail = await encrypt(email);
    const encryptedPass = await encrypt(password);

    localStorage.setItem("encrypted_email", encryptedEmail);
    localStorage.setItem("encrypted_password", encryptedPass);

    setSaved(true);
  };

  const loadCredentials = async () => {
    const encryptedEmail = localStorage.getItem("encrypted_email");
    const encryptedPass = localStorage.getItem("encrypted_password");

    if (!encryptedEmail || !encryptedPass) {
      setLoadedEmail(null);
      setLoadedPassword(null);
      return;
    }

    try {
      const decEmail = await decrypt(encryptedEmail);
      const decPass = await decrypt(encryptedPass);

      setLoadedEmail(decEmail);
      setLoadedPassword(decPass);
    } catch {
      setLoadedEmail(null);
      setLoadedPassword(null);
    }
  };

  useEffect(() => {
    loadCredentials();
  }, []);

  return (
    <div style={{ padding: 20, fontFamily: "Arial" }}>
      <h2>Salvar Credenciais Criptografadas</h2>

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        style={{ marginBottom: 10, width: "100%", padding: 8 }}
      />
      <input
        type="password"
        placeholder="Senha"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        style={{ marginBottom: 10, width: "100%", padding: 8 }}
      />

      <button onClick={saveCredentials} style={{ padding: 10 }}>
        Salvar no localStorage
      </button>

      {saved && <p style={{ color: "green" }}>Credenciais salvas com sucesso!</p>}

      <h3>Credenciais carregadas do localStorage:</h3>
      <p>Email: {loadedEmail ?? "Nenhum dado"}</p>
      <p>Senha: {loadedPassword ?? "Nenhum dado"}</p>
    </div>
  );
}