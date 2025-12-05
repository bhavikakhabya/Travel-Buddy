
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAHDJhAuck8tb-n74fvrLmEg8N51QZPeoE",
  authDomain: "my-project-ede61.firebaseapp.com",
  projectId: "my-project-ede61",
  storageBucket: "my-project-ede61.firebasestorage.app",
  messagingSenderId: "377724744830",
  appId: "1:377724744830:web:619f4de41d39a2ff31142f"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
