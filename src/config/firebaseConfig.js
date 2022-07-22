// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";

//Reference https://amanhimself.dev/blog/remove-asyncstorage-has-been-extracted-warning-using-firebase/
import AsyncStorage from "@react-native-async-storage/async-storage"

import { initializeAuth, getReactNativePersistence } from 'firebase/auth/react-native'

import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyApbMtW41BMuQKvt5Y5yyu6_cvZXm_1Kec",
    authDomain: "rockethelp-26fd8.firebaseapp.com",
    projectId: "rockethelp-26fd8",
    storageBucket: "rockethelp-26fd8.appspot.com",
    messagingSenderId: "1002603489690",
    appId: "1:1002603489690:web:0c6af203be383737e43223"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage)
});

const database = getFirestore(app)

export {
    auth,
    database
}

