import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyAbIlapa_urPPgi06vgZV2wMYvaX2dV71o",
  authDomain: "mern-blog-b327f-b617d.firebaseapp.com",
  projectId: "mern-blog-b327f-b617d",
  storageBucket: "mern-blog-b327f-b617d.appspot.com",
  messagingSenderId: "486714038948",
  appId: "1:486714038948:web:2dcf5a49e6a863b4796431",
  measurementId: "G-X8XWXNJ63Z"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// ✅ named export
export { app, analytics };
