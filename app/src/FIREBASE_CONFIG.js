// Import the functions you need from the SDKs you need
import { getApp, initializeApp } from "firebase/app";
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
  projectId: "firebase-emulator",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// export const analytics = getAnalytics(app);
const allFunctions = getFunctions(getApp());
connectFunctionsEmulator(allFunctions, "localhost", 5001);

export const functions = (function_name) =>
  httpsCallable(allFunctions, function_name);
