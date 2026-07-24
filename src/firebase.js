import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyAysgoV98buDn8GiI0LA8_MAIZ-3mChwNM",
  authDomain: "mf-alfaiataria.firebaseapp.com",
  projectId: "mf-alfaiataria",
  storageBucket: "mf-alfaiataria.firebasestorage.app",
  messagingSenderId: "853613465642",
  appId: "1:853613465642:web:701ed331ef77c1b05db353",
  measurementId: "G-DB5KCGE43B"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;
