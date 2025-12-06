import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyANCTr9cr432gffdWZdQJ5-bjHHhxZ95hU',
  authDomain: 'chatapp-d6b3a.firebaseapp.com',
  projectId: 'chatapp-d6b3a',
  storageBucket: 'chatapp-d6b3a.firebasestorage.app',
  messagingSenderId: '966037807856',
  appId: '1:966037807856:web:6c5ed40604af7773de9835',
  measurementId: 'G-9XKPWDTYJJ',
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;
