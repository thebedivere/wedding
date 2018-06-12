import { withState, compose, withHandlers } from 'recompose'

const enhance = compose(
  withState('code', 'updateCode', ''),
  withState('showContent', 'updateShowContent', false),
  withHandlers({
    handleCodeChange: props => event => {
      props.updateCode(event.target.value)
    },
    onSubmit: props => event => {
      event.preventDefault()
      console.log(props)
      props.db.collection('code').where('secret', '==', props.code).get().then(
        querySnapshot => {
          if (querySnapshot) {
            props.updateShowContent('true')
          }
        }
      )
    }
  })

)

const Protected = enhance(({children, code, handleCodeChange, onSubmit, showContent}) => (
  <div>
    {!showContent &&
      <form onSubmit={onSubmit}>
        <label>Enter password</label>
        <br />
        <input value={code} onChange={handleCodeChange} />
      </form>
    }
    {showContent && children}
  </div>
))

export default Protected
