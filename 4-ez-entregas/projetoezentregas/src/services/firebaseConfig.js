import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import 'firebase/storage';

// Your web app's Firebase configuration
  // For Firebase JS SDK v7.20.0 and later, measurementId is optional
  var firebaseConfig = {
    apiKey: "AIzaSyAKvxOJ9Y4ioxHqHiqDphMNtQvyAuhNc_g",
    authDomain: "ez-entregas.firebaseapp.com",
    projectId: "ez-entregas",
    storageBucket: "ez-entregas.appspot.com",
    messagingSenderId: "614966249363",
    appId: "1:614966249363:web:c9ae152e2a39459977ca66",
    measurementId: "G-XVQS5HDE17"
  };
  // Initialize Firebase

  
  if(!firebase.apps.length){
    firebase.initializeApp(firebaseConfig);
  }
  
  
  export default firebase;