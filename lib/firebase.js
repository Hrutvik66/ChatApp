import { initializeApp } from 'firebase/app';
import {
  getFirestore,
  doc,
  docs,
  setDoc,
  Timestamp,
  getDocs,
  getDoc,
  query,
  collection,
  where,
  addDoc,
  orderBy,
  serverTimestamp,
  updateDoc,
  deleteDoc,
} from 'firebase/firestore';
import { GoogleAuthProvider, getAuth, signInWithPopup } from 'firebase/auth';

const firebaseConfig = {
  apiKey: 'AIzaSyAjMIa_riN7orQ4aR673UnvbgqFhkkpnZA',
  authDomain: 'chat-app-9f7c2.firebaseapp.com',
  projectId: 'chat-app-9f7c2',
  storageBucket: 'chat-app-9f7c2.appspot.com',
  messagingSenderId: '230871345037',
  appId: '1:230871345037:web:c7d2c960a131da9b3b7fc4',
};

const app = initializeApp(firebaseConfig);

const db = getFirestore(app);
const auth = getAuth();
const provider = new GoogleAuthProvider();

export {
  db,
  auth,
  provider,
  docs,
  doc,
  setDoc,
  getDocs,
  getDoc,
  Timestamp,
  signInWithPopup,
  query,
  collection,
  where,
  addDoc,
  orderBy,
  serverTimestamp,
  updateDoc,
  deleteDoc,
};
