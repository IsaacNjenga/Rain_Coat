// firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDfZBWcCyZlMw7TaVNRcmi9fePwRqnH3cA",
  authDomain: "raincoat-3148f.firebaseapp.com",
  projectId: "raincoat-3148f",
  storageBucket: "raincoat-3148f.appspot.com",
  messagingSenderId: "820795094485",
  appId: "1:820795094485:web:f81e68ec61890e7fb3f95c"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth };
