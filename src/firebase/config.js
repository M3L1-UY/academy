
import { initializeApp } from "firebase/app";
import {
    getStorage,
  } from "firebase/storage";

  
const firebaseConfig = {
  apiKey: "AIzaSyCrcUVBQfhNjw3XkE_-jyj2xLRxaIcBVuM",
  authDomain: "academia-2c2ae.firebaseapp.com",
  projectId: "academia-2c2ae",
  storageBucket: "academia-2c2ae.appspot.com",
  messagingSenderId: "619943201861",
  appId: "1:619943201861:web:6ad120b052c6f7e949272c"
};

const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

export { storage };
