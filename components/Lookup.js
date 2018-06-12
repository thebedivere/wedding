
import { withState, compose, withHandlers } from 'recompose'

const enhance = compose(
  withState('submitted', 'updateSubmitted', false),
  withState('feedback', 'updateFeedback', ''),
  withState('lastName', 'updateLastName', ''),
  withState('members', 'updateMembers', []),
  withState('response', 'updateResponse', {}),
  withState('message', 'updateMessage', undefined),
  withHandlers({
    handleFeedbackChange: props => event => {
      props.updateFeedback(event.target.value)
    },
    handleLastNameChange: props => event => {
      props.updateLastName(event.target.value)
    },
    handleSelection: props => event => {
      const newResponse = Object.assign({}, props.response, {[event.target.id]: event.target.value})
      props.updateResponse(newResponse)
    },
    onSubmitSearch: props => event => {
      event.preventDefault()
      props.db.collection('guests').where('LastName', '==', props.lastName).get().then(
        querySnapshot => {
          if (querySnapshot.docs) {
            const doc = querySnapshot.docs[0].data()
            props.updateMembers(doc.members)
          }
        }
      )
    },
    onSubmitResponse: props => event => {
      event.preventDefault()
      props.db.collection('responses')
        .add({response: props.response, LastName: props.lastName, feedback: props.feedback})
        .then(docRef => console.log('Document written with ID ' + docRef.id))
        .then(() => props.updateSubmitted(true))
        .then(() => props.updateMessage('Thanks for responding!'))
        .catch(err => props.updateMessage('there was a problem. Call Josh and tell him he broke things.', err))
    }
  })
)

const Lookup = enhance(({lastName, message, members, feedback, submitted, handleFeedbackChange, handleLastNameChange, handleSelection, onSubmitSearch, onSubmitResponse}) => (<div>
  <form onSubmit={onSubmitSearch}>
    <input placeholder='Enter your last name' value={lastName} onChange={handleLastNameChange} />
    <button type='submit'>Search</button>
  </form>
  {(members.length > 0 && !submitted) &&
    <form onSubmit={onSubmitResponse}>
      <p>Please let us know who will be able to attend</p>
      <ul>
        {members.map(m =>
          <li>{m}
            <label>No</label>
            <input type='radio' id={m} value='no' name={m} onChange={handleSelection} />
            <label>Yes</label>
            <input type='radio' id={m} value='yes' name={m} onChange={handleSelection} />
          </li>)
        }
      </ul>
      <br />
      <label>Message (optional)</label>
      <br />
      <textarea value={feedback} onChange={handleFeedbackChange} />
      <br />
      <button type='submit'>Submit Response</button>
    </form>
  }
  {message && <p>{message}</p>}
</div>))

export default Lookup
