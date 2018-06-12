import { compose, withState, withHandlers } from 'recompose'
import ReactTable from 'react-table'
import 'react-table/react-table.css'

const enhance = compose(
  withState('member', 'updateMember', ''),
  withHandlers({
    handleMemberChange: props => event => props.updateMember(event.target.value),
    handleCreateMember: props => event => {
      event.preventDefault()
      const oldMembers = props.guest.members || []
      const newMembers = [...oldMembers, {name: props.member, attending: 'No'}]
      props.db.collection('guests').doc(props.guest.lastName).update({members: newMembers})
    }
  })
)

const Guest = enhance(({guest, handleCreateMember, member, handleMemberChange}) =>
  <div>
    <hr />
    <strong>{guest.lastName}</strong>
    {guest.feedback && <p>{guest.feedback}</p>}
    <ReactTable
      data={guest.members}
      columns={[{Header: 'Name', accessor: 'name'}, {Header: 'Attending', accessor: 'attending'}]}
      minRows={0}
      showPagination={false} />
    <form onSubmit={handleCreateMember}>
      <input value={member} onChange={handleMemberChange} />
      <button type='submit'>Add family member</button>
    </form>
    <br />
  </div>)

export default Guest
