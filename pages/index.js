
import Rsvp from '../components/Rsvp'
import Header from '../components/Header'
import Body from '../components/Body'
import Registry from '../components/Registry'
import { withState, compose, withHandlers } from 'recompose'
import '../style/main.css'

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

const enhance = compose(
  withState('showRsvp', 'updateShowRsvp', false),
  withHandlers({
    toggleRsvp: props => event => {
      props.updateShowRsvp(!props.showRsvp)
    }
  })
)

export default enhance(({toggleRsvp, showRsvp}) => <div>
  <Header toggleRsvp={toggleRsvp} />
  <Body />
  <Registry />
  <Rsvp db={db} showRsvp={showRsvp} toggleRsvp={toggleRsvp} />
</div>
)
