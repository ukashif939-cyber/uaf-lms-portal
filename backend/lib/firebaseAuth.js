const { createRemoteJWKSet, jwtVerify } = require("jose");

const FIREBASE_PROJECT_ID = process.env.FIREBASE_PROJECT_ID || "uaf-lms-main";
const JWKS = createRemoteJWKSet(
  new URL("https://www.googleapis.com/service_accounts/v1/jwk/securetoken@system.gserviceaccount.com")
);

async function verifyFirebaseIdToken(idToken) {
  if (!idToken) throw new Error("Missing ID token");

  const { payload } = await jwtVerify(idToken, JWKS, {
    issuer: `https://securetoken.google.com/${FIREBASE_PROJECT_ID}`,
    audience: FIREBASE_PROJECT_ID,
  });

  const email = payload.email;
  if (!email || typeof email !== "string") {
    throw new Error("Token does not contain a valid email");
  }

  return {
    uid: payload.sub,
    email: email.toLowerCase(),
    emailVerified: Boolean(payload.email_verified),
  };
}

module.exports = { verifyFirebaseIdToken };
