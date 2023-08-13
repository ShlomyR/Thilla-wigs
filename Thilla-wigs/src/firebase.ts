import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { initializeAppCheck } from "firebase/app-check";
import { getPerformance } from "firebase/performance";

const firebaseConfig = {
    apiKey: "you'r key",
    authDomain: "you'r key",
    projectId: "you'r key",
    storageBucket: "you'r key",
    messagingSenderId: "you'r key",
    appId: "you'r key"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);


import("firebase/app-check")
  .then(({ ReCaptchaV3Provider }) => {
    initializeAppCheck(app, {
      provider: new ReCaptchaV3Provider("you'r key of the reCaptcha here"),
      isTokenAutoRefreshEnabled: true,
    });
  });

export const perf = getPerformance(app);

export const auth = getAuth();

export const db = getFirestore(app);
