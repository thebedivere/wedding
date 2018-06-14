import { withState, compose, withHandlers } from 'recompose'
import store from 'store'

const enhance = compose(
  withState('code', 'updateCode', store.get('code')),
  withState('showContent', 'updateShowContent', store.get('access')),
  withHandlers({
    handleCodeChange: props => event => {
      props.updateCode(event.target.value)
    },
    onSubmit: props => event => {
      event.preventDefault()
      store.set('code', props.code)
      props.db.collection('code').where('secret', '==', props.code).get().then(
        querySnapshot => {
          if (querySnapshot) {
            store.set('access', true)
            props.updateShowContent('true')
          } else {
            store.set('access', false)
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
