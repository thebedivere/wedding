
import { withState, compose, withHandlers } from 'recompose'
import { format } from 'date-fns'

const getFeedback = (oldFeedback, feedback) => {
  if (oldFeedback && feedback) {
    return `${oldFeedback}|${feedback}`
  }
  if (oldFeedback && !feedback) {
    return oldFeedback
  }
  if (!oldFeedback && feedback) {
    return feedback
  }
  return ''
}
const formatLastName = lastName => {
  const lower = lastName.toLowerCase()
  return lower.charAt(0).toUpperCase() + lower.substr(1)
}
const enhance = compose(
  withState('submitted', 'updateSubmitted', false),
  withState('feedback', 'updateFeedback', ''),
  withState('oldFeedback', 'updateOldFeedback', ''),
  withState('lastName', 'updateLastName', ''),
  withState('members', 'updateMembers', []),
  withState('response', 'updateResponse', {}),
  withState('message', 'updateMessage', undefined),
  withHandlers({
    handleClose: props => event => {
      props.toggleRsvp()
      props.updateSubmitted(false)
      props.updateMessage('')
      props.updateMembers([])
      props.updateLastName('')
    },
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
      console.log(props.lastName)
      props.db.collection('guests')
        .doc(formatLastName(props.lastName))
        .onSnapshot(
          doc => {
            if (doc.data()) {
              console.log(doc)
              props.updateMessage('')
              const members = doc.data().members
              props.updateMembers(members)
              const newResponse = Object.assign({}, ...members.map(m => ({[m.name]: m.attending})))
              props.updateResponse(newResponse)
              props.updateOldFeedback(doc.data().feedback)
            } else {
              props.updateMessage('No match found')
            }
          }
        )
    },
    onSubmitResponse: props => event => {
      event.preventDefault()
      const newMembers = Object.keys(props.response).map(key => ({ name: key, attending: props.response[key] }))
      const feedback = getFeedback(props.oldFeedback, props.feedback)
      props.db.collection('guests')
        .doc(formatLastName(props.lastName))
        .update({members: newMembers, feedback})
      props.db.collection('responses').add({members: newMembers, feedback, time: format(new Date(), 'M/D/YY h:mm A')})
      props.updateSubmitted(true)
      props.updateMessage('Thanks for your response!')
    }
  })
)

const Rsvp = enhance(({lastName, message, members, feedback, submitted, handleFeedbackChange, handleLastNameChange, handleSelection, onSubmitSearch, onSubmitResponse, response, showRsvp, handleClose}) => (
  <div className='rsvp-shadow' hidden={!showRsvp}>
    <div className='rsvp' >
      <button onClick={handleClose} className='close'>X</button>
      <h3>RSVP</h3>
      <form onSubmit={onSubmitSearch} hidden={submitted}>
        <div className='form-group'>
          <label htmlFor='lastName'>Enter your last name</label>
          <input className='form-control' value={lastName} id='lastName' onChange={handleLastNameChange} />
        </div>
        <button type='submit' className='btn btn-primary'>Search</button>
      </form>
      <br />
      {(members.length > 0 && !submitted) &&
      <div>
        <p className='card-text'>Please let us know who will be able to attend</p>
        <form onSubmit={onSubmitResponse}>
          <table className='table'>
            <tbody>
              {members.map(m =>
                <tr key={m.name}>
                  <td>{m.name}</td>
                  <td>
                    <div className='form-check form-check-inline'>
                      <input className='form-check-input' type='radio' id={m.name} value='No' checked={response[m.name] === 'No'} onChange={handleSelection} />
                      <label className='form-check-label' htmlFor={m.name}>No</label>
                    </div>
                  </td>
                  <td>
                    <div className='form-check form-check-inline'>
                      <input className='form-check-input' type='radio' id={m.name} value='Yes' checked={response[m.name] === 'Yes'} onChange={handleSelection} />
                      <label className='form-check-label' htmlFor={m.name}>Yes</label>
                    </div>
                  </td>
                </tr>)
              }
            </tbody>
          </table>
          <div className='form-group'>
            <label>Message (optional)</label>
            <textarea className='form-control' value={feedback} onChange={handleFeedbackChange} rows='3' />
          </div>
          <button type='submit' className='btn btn-primary'>Submit Response</button>
        </form>
      </div>
      }
      <div className='alert alert-success' role='alert' hidden={!message}>
        {message}
      </div>
    </div>
  </div>))

export default Rsvp
