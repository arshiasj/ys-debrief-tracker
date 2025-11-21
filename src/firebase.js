// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { getDatabase } from "firebase/database"; // <-- if you're using Realtime DB

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC2WxhxnV8mYwwyPQzdlK40KHmNVjvaSWY",
  authDomain: "ys-debrief-tracker.firebaseapp.com",
  databaseURL: "https://ys-debrief-tracker-default-rtdb.firebaseio.com",
  projectId: "ys-debrief-tracker",
  storageBucket: "ys-debrief-tracker.firebasestorage.app",
  messagingSenderId: "871329204574",
  appId: "1:871329204574:web:5560b88021732e4a4227cf",
  measurementId: "G-6B16SCMT5M"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// export
export const db = getDatabase(app);     // if using Realtime DB
export default app;