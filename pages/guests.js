import Guests from '../components/Guests'
import Protected from '../components/Protected'
const firebase = require('firebase')
// Required for side-effects
require('firebase/firestore')

if (!firebase.apps.length) {
  firebase.initializeApp({
    apiKey: 'AIzaSyCuIciCvjDW0Ya2x6drSGexVC9Jf41KldA',
    authDomain: 'wedding-8c66f.firebaseapp.com',
    databaseURL: 'https://wedding-8c66f.firebaseio.com',
    projectId: 'wedding-8c66f',
    storageBucket: 'wedding-8c66f.appspot.com',
    messagingSenderId: '890119917230'
  })
}

const db = firebase.firestore()

export default () =>
  <Protected db={db} >
    <Guests db={db} />
  </Protected>
