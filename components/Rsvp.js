import { withState, compose, withHandlers } from 'recompose'

const submitRsvp = ({email, name, message, attending, db}) => {
  console.log({
    name,
    email,
    attending,
    message
  })
  db.collection('rsvp')
    .add({
      name,
      email,
      attending,
      message
    })
    .then(docRef => console.log('Document written with ID ' + docRef.id))
    .catch(err => console.error(err))
}

const attendingOptions = [
  { label: 'Yes', value: 'Yes' },
  { label: 'No', value: 'No' }
]

const enhance = compose(
  withState('email', 'setEmail', ''),
  withState('name', 'setName', ''),
  withState('message', 'setMessage', ''),
  withState('attending', 'setAttending', 'No'),
  withHandlers({
    onEmailChange: props => event => {
      props.setEmail(event.target.value)
    },
    onNameChange: props => event => {
      props.setName(event.target.value)
    },
    onAttendingChange: props => event => {
      props.setAttending(event.target.value)
    },
    onMessageChange: props => event => {
      props.setMessage(event.target.value)
    },
    onSubmit: props => event => {
      event.preventDefault()
      submitRsvp({
        name: props.name,
        email: props.email,
        attending: props.attending,
        message: props.message,
        db: props.db
      })
    }
  })
)

const Rsvp = enhance(({ email, name, attending, message, onEmailChange, onAttendingChange, onNameChange, onMessageChange, onSubmit }) => (
  <form onSubmit={onSubmit}>
    <label>Name</label>
    <input value={name} onChange={onNameChange} required />
    <br />
    <label>Email</label>
    <input value={email} onChange={onEmailChange} required />
    <br />
    <label>Attending</label>
    <select onChange={onAttendingChange}>
      {attendingOptions.map(o => <option value={o.value} key={o.label}>{o.label}</option>)}
    </select>
    <br />
    <textarea value={message} onChange={onMessageChange} />
    <br />
    <button type='submit' disabled={!email && attending}>
      Click me
    </button>
  </form>
))

export default Rsvp
