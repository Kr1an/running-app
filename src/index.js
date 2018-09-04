import 'typeface-roboto'
import firebase from 'firebase';
import App from './components/App';
import React from 'react';
import ReactDOM from 'react-dom';
import './global.css';
import registerServiceWorker from './registerServiceWorker';

var config = {
  apiKey: "AIzaSyABeIyTjm8oH7-6zx5XzE_5MILB2aPPpjs",
  authDomain: "running-app-9d21a.firebaseapp.com",
  databaseURL: "https://running-app-9d21a.firebaseio.com",
  projectId: "running-app-9d21a",
  storageBucket: "running-app-9d21a.appspot.com",
  messagingSenderId: "550504945139",
};

firebase.initializeApp(config);

ReactDOM.render(<App />, document.getElementById('root'));
registerServiceWorker();
