// src/utils/jwt.js
export const decodeJwt = (token) => {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    // relleno por si falta '='
    const padded = base64 + "=".repeat((4 - (base64.length % 4)) % 4);
    const jsonPayload = decodeURIComponent(
      atob(padded).split("").map(c => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2)).join("")
    );
    return JSON.parse(jsonPayload); // { sub, role, exp, ... }
  } catch { return null; }
};
