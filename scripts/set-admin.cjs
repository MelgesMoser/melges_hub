/*
 * Admin utility for the Melges Firebase project.
 *
 * Usage (PowerShell):
 *   $env:FIREBASE_SERVICE_ACCOUNT_PATH='C:\path\to\service-account.json'
 *   node scripts/set-admin.cjs person@example.com
 *
 * Add --revoke to remove the administrative role.
 * The service-account file is intentionally never stored in this repository.
 */
const fs = require("node:fs");
const path = require("node:path");
const { initializeApp, cert } = require("firebase-admin/app");
const { getAuth } = require("firebase-admin/auth");
const { FieldValue, getFirestore } = require("firebase-admin/firestore");

const email = process.argv[2]?.trim().toLowerCase();
const revoke = process.argv.includes("--revoke");
const credentialPath = process.env.FIREBASE_SERVICE_ACCOUNT_PATH;

if (!email || !/^\S+@\S+\.\S+$/.test(email)) throw new Error("Informe um e-mail válido. Ex.: node scripts/set-admin.cjs pessoa@exemplo.com");
if (!credentialPath || !fs.existsSync(credentialPath)) throw new Error("Defina FIREBASE_SERVICE_ACCOUNT_PATH com o caminho do JSON da conta de serviço.");

const serviceAccount = JSON.parse(fs.readFileSync(path.resolve(credentialPath), "utf8"));
if (serviceAccount.project_id !== "melgesdatabase") throw new Error("A credencial não pertence ao projeto melgesdatabase.");

initializeApp({ credential: cert(serviceAccount), projectId: "melgesdatabase" });

(async () => {
  const auth = getAuth();
  const firestore = getFirestore();
  const user = await auth.getUserByEmail(email);
  const profile = firestore.collection("users").doc(user.uid);
  const profileSnapshot = await profile.get();
  if (!profileSnapshot.exists) throw new Error("A conta existe, mas o perfil ainda não foi criado. Entre no site uma vez e tente novamente.");

  await auth.setCustomUserClaims(user.uid, { ...user.customClaims, admin: !revoke });
  await profile.update({ isAdmin: !revoke, updatedAt: FieldValue.serverTimestamp() });
  console.log(revoke ? "ADMIN_REVOKED=true" : "ADMIN_GRANTED=true");
})().catch((error) => { console.error(`ADMIN_ROLE_FAILED=${error.message}`); process.exitCode = 1; });
