import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBNXOnm742UexPN-sjtNei1NEAWEBz8bI4",
  authDomain: "sportzen-56617.firebaseapp.com",
  projectId: "sportzen-56617",
  storageBucket: "sportzen-56617.appspot.com",
  messagingSenderId: "401915413332",
  appId: "1:401915413332:web:9ab0ef308f30a43f2efec1",
  measurementId: "G-ZRWR6567BR"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);