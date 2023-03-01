import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/storage';
import 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyCEv6necm4Fubi7ymbijkJbvuWgurXCs_4',
  authDomain: 'alumni-pf.firebaseapp.com',
  projectId: 'alumni-pf',
  storageBucket: 'alumni-pf.appspot.com',
  messagingSenderId: '1032722078704',
  appId: '1:1032722078704:web:9e189f8e52d39f7ebe9b35',
  measurementId: 'G-B29N66D9QM',
};

// init firebase
firebase.initializeApp(firebaseConfig);

// init services
const projectFirestore = firebase.firestore();
const projectAuth = firebase.auth();
const projectStorage = firebase.storage();

// timestamp
const timestamp = firebase.firestore.FieldValue.serverTimestamp;

export { projectFirestore, projectAuth, projectStorage, timestamp };
