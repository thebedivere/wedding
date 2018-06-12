
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
      props.updateSubmitted(false)
      props.db.collection('guests')
        .doc(props.lastName)
        .onSnapshot(
          doc => {
            const members = doc.data().members
            props.updateMembers(members)
            const newResponse = Object.assign({}, ...members.map(m => ({[m.name]: m.attending})))
            props.updateResponse(newResponse)
            props.updateFeedback(doc.data().feedback)
          }
        )
    },
    onSubmitResponse: props => event => {
      event.preventDefault()
      const newMembers = Object.keys(props.response).map(key => ({ name: key, attending: props.response[key] }))
      props.db.collection('guests')
        .doc(props.lastName)
        .update({members: newMembers, feedback: props.feedback})
      props.updateSubmitted(true)
      props.updateMessage('Thanks for your response!')
    }
  })
)

const Lookup = enhance(({lastName, message, members, feedback, submitted, handleFeedbackChange, handleLastNameChange, handleSelection, onSubmitSearch, onSubmitResponse, response}) => (<div>
  <form onSubmit={onSubmitSearch}>
    <input placeholder='Enter your last name' value={lastName} onChange={handleLastNameChange} />
    <button type='submit'>Search</button>
  </form>
  {(members.length > 0 && !submitted) &&
    <form onSubmit={onSubmitResponse}>
      <p>Please let us know who will be able to attend</p>
      <ul>
        {members.map(m =>
          <li><label>{m.name} </label>
            <label>No</label>
            <input type='radio' id={m.name} value='No' checked={response[m.name] !== 'Yes'} onChange={handleSelection} />
            <label>Yes</label>
            <input type='radio' id={m.name} value='Yes' checked={response[m.name] === 'Yes'} onChange={handleSelection} />
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
