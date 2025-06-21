// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-firestore.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCp6e8w5VnKTzVxi3dvvOSahDaF6AfkxrA",
  authDomain: "hostelmanagementsystem-3c991.firebaseapp.com",
  projectId: "hostelmanagementsystem-3c991",
  storageBucket: "hostelmanagementsystem-3c991.appspot.com",
  messagingSenderId: "1005295925988",
  appId: "1:1005295925988:web:aeb1f8beb7522726050af1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// You can export the app and db instances if you need them in other files
export { app, db }; 