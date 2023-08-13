import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { initializeAppCheck } from "firebase/app-check";
import { getPerformance } from "firebase/performance";


// const admin = require('firebase-admin');
// const serviceAccount = require('../thilla-wigs-firebase-adminsdk-i7sve-057422fdfb.json');

// admin.initializeApp({
//   credential: admin.credential.cert(serviceAccount),
//   databaseURL: 'https://thilla-wigs.firebaseapp.com' // Replace with your Firebase project URL
// });

const firebaseConfig = {
    apiKey: "AIzaSyAvTVDmzxT4M-Mc0kSbKpHphVxup5U8c3U",
    authDomain: "thilla-wigs.firebaseapp.com",
    projectId: "thilla-wigs",
    storageBucket: "thilla-wigs.appspot.com",
    messagingSenderId: "421646576130",
    appId: "1:421646576130:web:4dc4b76b3b6c72d24f151b"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);


if (import.meta.env.DEV) {
    self.FIREBASE_APPCHECK_DEBUG_TOKEN = true;
}

import("firebase/app-check")
  .then(({ ReCaptchaV3Provider }) => {
    initializeAppCheck(app, {
      provider: new ReCaptchaV3Provider('6LeJF2EnAAAAAFKF4ifZWj6314bFt-AhKwqvv9bg'),
      isTokenAutoRefreshEnabled: true,
    });
  });

export const perf = getPerformance(app);

export const auth = getAuth();

export const db = getFirestore(app);

// const admin = require("firebase-admin");

// const serviceAccount = require("../thilla-wigs-firebase-adminsdk-i7sve-057422fdfb.json");

// admin.initializeApp({
//   credential: admin.credential.cert(serviceAccount)
// });