import ReactTable from 'react-table'
import { withState, compose, lifecycle } from 'recompose'
import Maybe from 'folktale/maybe'
import * as R from 'ramda'
import 'react-table/react-table.css'

const columns = [
  {
    Header: 'Family',
    accessor: 'lastName'
  },
  {
    Header: 'Name',
    accessor: 'name'
  },
  {
    Header: 'Attending',
    accessor: 'attending'
  }, {
    Header: 'Message',
    accessor: 'message'
  }]

const get = (object, key) => {
  return key in object ? Maybe.Just(object[key]) : Maybe.Nothing()
}

const formatData = data => [].concat(...data.map(family =>
  family.members.map(member =>
    ({
      lastName: family.lastName,
      message: family.feedback,
      name: member.name,
      attending: member.attending
    })
  )
))

const enhance = compose(
  withState('data', 'setData', []),
  withState('total', 'setTotal', {}),
  lifecycle({
    state: {},
    componentDidMount () {
      this.props.db.collection('guests').get().then(
        querySnapshot => {
          const data = querySnapshot.docs.map(doc => doc.data())
          const total = R.countBy(R.toLower)(formatData(data).map(d => d.attending))
          this.setState({
            data: formatData(data),
            total
          })
        }
      )
    }
  })
)

const Responses = enhance(({data, total}) => {
  const yes = get(total, 'yes').getOrElse(0)
  const no = get(total, 'no').getOrElse(0)
  return (
    <div>
      <ul>
        <li>Total: {yes + no}</li>
        <li>Yes: {yes}</li>
        <li>No: {no}</li>
      </ul>
      <ReactTable data={data} columns={columns} className='-striped -highlight' defaultPageSize={70} />
    </div>
  )
})

export default Responses
