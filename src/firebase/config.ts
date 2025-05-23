import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getDatabase } from 'firebase/database';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyDtg0_cjf-ZXgmgjIOA8VTHULuRDorcUlE",
  authDomain: "mrbd-88689.firebaseapp.com",
  databaseURL: "https://mrbd-88689-default-rtdb.firebaseio.com",
  projectId: "mrbd-88689",
  storageBucket: "mrbd-88689.firebasestorage.app",
  messagingSenderId: "471198609260",
  appId: "1:471198609260:web:38e006fbbc7886c9c7cd49"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize services
const auth = getAuth(app);
const database = getDatabase(app);
const storage = getStorage(app);

export { auth, database, storage };
export default app;