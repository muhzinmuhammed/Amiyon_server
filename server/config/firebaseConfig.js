// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDNQagigf3IWwPTM8709Ppw95hPu0jCJwM",
  authDomain: "olx-clone-3db8a.firebaseapp.com",
  projectId: "olx-clone-3db8a",
  storageBucket: "olx-clone-3db8a.appspot.com",
  messagingSenderId: "254966506912",
  appId: "1:254966506912:web:334bf3c6621ee0d5c2b0c5",
  measurementId: "G-1G798J6RW2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

export { storage };