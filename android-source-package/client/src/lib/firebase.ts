
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getMessaging, isSupported } from "firebase/messaging";

const firebaseConfig = {
  apiKey: "AIzaSyD4e3lcVrI5mjlIp-PYbMjD_LjXesDgUVA",
  authDomain: "zivora-aa27e.firebaseapp.com",
  projectId: "zivora-aa27e",
  storageBucket: "zivora-aa27e.firebasestorage.app",
  messagingSenderId: "675749854614",
  appId: "1:675749854614:web:b68a68b3eabb4cf16171b7"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Auth and get a reference to the service
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

// Initialize Cloud Storage and get a reference to the service
export const storage = getStorage(app);

// Initialize Firebase Cloud Messaging and get a reference to the service
export const getMessagingInstance = async () => {
  const supported = await isSupported();
  return supported ? getMessaging(app) : null;
};

export default app;