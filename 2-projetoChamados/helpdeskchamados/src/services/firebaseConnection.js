import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import 'firebase/storage';


let firebaseConfig = {
    apiKey: "AIzaSyDo6XH_xwY0FGQEwQ0mGlUDIB8vWjaQMeo",
    authDomain: "help-desk-chamados-react.firebaseapp.com",
    projectId: "help-desk-chamados-react",
    storageBucket: "help-desk-chamados-react.appspot.com",
    messagingSenderId: "550119069622",
    appId: "1:550119069622:web:4c1902e20e592d5edbd317",
    measurementId: "G-GD11SHB0J7"
    
};

  
if(!firebase.apps.length){
  firebase.initializeApp(firebaseConfig);
}


export default firebase;