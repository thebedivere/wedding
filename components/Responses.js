import ReactTable from 'react-table'
import { withState, compose, lifecycle } from 'recompose'
import 'react-table/react-table.css'

const columns = [{
  Header: 'Name',
  accessor: 'name'
},
{
  Header: 'Email',
  accessor: 'email'
}, {
  Header: 'Attending',
  accessor: 'attending'
}, {
  Header: 'Message',
  accessor: 'message'
}]

// props.db.collection('rsvp').get().then(
//     querySnapshot => querySnapshot.docs

const withData = lifecycle({
  state: {},
  componentDidMount () {
    this.props.db.collection('rsvp').get().then(
      querySnapshot => {
        const data = querySnapshot.docs.map(doc => doc.data())
        this.setState({
          data
        })
      }
    )
  }
})

const enhance = compose(
  withState('data', 'setData', []),
  withData
)

const Responses = enhance(({data}) => (
  <div>
    <ReactTable data={data} columns={columns} className='-striped -highlight' />
  </div>
))

export default Responses
