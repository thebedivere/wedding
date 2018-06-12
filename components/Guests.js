import { compose, lifecycle, withState, withHandlers } from 'recompose'
import Guest from './Guest'
import '../style/main.css'

const withData = lifecycle({
  componentDidMount () {
    this.props.db.collection('guests').onSnapshot(
      querySnapshot => {
        const guests = querySnapshot.docs.map(doc => doc.data())
        this.setState({
          guests
        })
      }
    )
  }
})

const enhance = compose(
  withState('guests', 'updateGuests', []),
  withState('lastName', 'updateLastName', ''),
  withHandlers({
    handleLastName: props => event => {
      props.updateLastName(event.target.value)
    },
    handleCreateGuest: props => event => {
      event.preventDefault()
      props.db.collection('guests').doc(props.lastName).set({lastName: props.lastName, members: []}).then(object => console.log(object))
      props.updateLastName('')
    }
  }),
  withData
)

const Guests = enhance(({guests, lastName, handleLastName, handleCreateGuest, db}) => (
  <div style={{ paddingTop: '50px' }}>
    <form onSubmit={handleCreateGuest} style={{ position: 'fixed', width: '100%', top: 0, background: 'white', padding: '5px', zIndex: 100 }}>
      <label>Last Name</label>
      <br />
      <input value={lastName} onChange={handleLastName} />
      <button type='submit'>Add new family</button>
    </form>
    {guests.map(g => <Guest guest={g} key={g.lastname + Math.random().toString()} db={db} />)}
  </div>
))

export default Guests
