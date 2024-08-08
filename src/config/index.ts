//các hàm dùng chung ở mọi component
//phân trang, format ngày tháng, tiền tệ, ...
//firebase
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDBnFMaaq7SF2us_CrCjg9UlHEL3k-Srdw",
  authDomain: "react-upload-c82de.firebaseapp.com",
  projectId: "react-upload-c82de",
  storageBucket: "react-upload-c82de.appspot.com",
  messagingSenderId: "379323945622",
  appId: "1:379323945622:web:2197be7f7ba890075528b7",
  measurementId: "G-KJYZ68DDSG",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);
const analytics = getAnalytics(app);
