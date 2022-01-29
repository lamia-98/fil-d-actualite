
import { initializeApp, getApp, getApps } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDu7xR-yP-O4TRrGwwKQnNVGTFSRTuJSH8",
  authDomain: "noct-web.firebaseapp.com",
  projectId: "noct-web",
  storageBucket: "noct-web.appspot.com",
  messagingSenderId: "257317021102",
  appId: "1:257317021102:web:a866b8197e6d820b91d43f"
};



// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);
const auth = getAuth(app);

export { db, storage, auth };