
import firebase from "firebase";

const firebaseApp = firebase.initializeApp({
    apiKey: "AIzaSyAYceN6euNAyI-xkg-Sf0INvMEpCO49VeA",
    authDomain: "instagram-clone-react-c63cb.firebaseapp.com",
    databaseURL: "https://instagram-clone-react-c63cb.firebaseio.com",
    projectId: "instagram-clone-react-c63cb",
    storageBucket: "instagram-clone-react-c63cb.appspot.com",
    messagingSenderId: "487926713151",
    appId: "1:487926713151:web:2dc501a6ca893cde38e18a",
    measurementId: "G-772XCE0L6F"
});

const db = firebaseApp.firestore();
const auth = firebase.auth();
const storage = firebase.storage();

export { db, auth, storage };