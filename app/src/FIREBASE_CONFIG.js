// Import the functions you need from the SDKs you need
import { getApp, initializeApp } from "firebase/app";
import { getAuth, connectAuthEmulator } from "firebase/auth";
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore";
// import { getAnalytics } from "firebase/analytics";
import {
  getFunctions,
  connectFunctionsEmulator,
  httpsCallable,
} from "firebase/functions";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  projectId: "jimatest-cc6cb",
  apiKey: "AIzaSyCMG36CeCo0mgm8L3mwMlFXPhJ4fLoHtAk",
};

// Initialize Firebase
initializeApp(firebaseConfig);
// export const analytics = getAnalytics(app);
const allFunctions = getFunctions(getApp());
connectFunctionsEmulator(allFunctions, "localhost", 5001);

const auth = getAuth();
connectAuthEmulator(auth, "http://localhost:9099");

const db = getFirestore();
connectFirestoreEmulator(db, "localhost", 8080);

const functions = (function_name) => httpsCallable(allFunctions, function_name);

export { auth, db, functions };
