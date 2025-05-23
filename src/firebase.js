import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAPuoQNxlnrr6cLcP-lWwBS92EbAFo0OZM",
  authDomain: "job-tracker-55829.firebaseapp.com",
  projectId: "job-tracker-55829",
  storageBucket: "job-tracker-55829.appspot.com",
  messagingSenderId: "826750269131",
  appId: "1:826750269131:web:680bc68e1ac5c775cccd4e"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);
