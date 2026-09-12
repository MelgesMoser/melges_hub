import { getApp, getApps, initializeApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Esta configuração identifica o projeto Firebase no navegador. As regras do
// Firebase continuam sendo a camada que protege os dados.
const firebaseConfig = {
  apiKey: "AIzaSyACJDC4agwYYpU7LaZpllvRF_UNzrfwA8U",
  authDomain: "melgesdatabase.firebaseapp.com",
  projectId: "melgesdatabase",
  storageBucket: "melgesdatabase.firebasestorage.app",
  messagingSenderId: "840493266128",
  appId: "1:840493266128:web:c17cc954e0cdc9dec25ad5",
  measurementId: "G-T1QXPCN2MN",
};

export const firebaseApp = getApps().length ? getApp() : initializeApp(firebaseConfig);
export const firebaseAuth = getAuth(firebaseApp);
export const firestore = getFirestore(firebaseApp);

// Analytics só é inicializado em navegadores compatíveis; assim não quebra
// desenvolvimento local ou navegadores que bloqueiam esse recurso.
export const analytics = typeof window === "undefined"
  ? null
  : isSupported().then((supported) => (supported ? getAnalytics(firebaseApp) : null));
