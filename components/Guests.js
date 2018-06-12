import { compose, lifecycle, withState } from 'recompose'
import Guest from './Guest'

const withData = lifecycle({
  state: {},
  componentDidMount () {
    this.props.db.collection('guests').get().then(
      querySnapshot => {
        const guests = querySnapshot.docs.map(doc => doc.data())
        console.log(guests)
        this.setState({
          guests
        })
      }
    )
  }
})

const enhance = compose(
  withState('guests', 'updateGuests', []),
  withData
)

const createGuest = (event, updateGuests, db) => {
  db.collection('guests').add([]).then(object => console.log(object))
}

const Guests = enhance(({guests, updateGuests, db}) => (
  <div>
    <button onClick={event => createGuest(event, updateGuests, db)}>Add guest</button>
    {guests.map(g => <Guest guest={g} />)}
  </div>
))

export default Guests
