import React from 'react'
import { Link } from 'react-router-dom'
import { Fade, Container, Row, Col, Button } from 'react-bootstrap'
import moment from 'moment'

import { useAlerts } from '../../contexts/Alerts'

import { SuperTable } from '../../shared'


function ExpensesList() {
	const { showAlert } = useAlerts()

	return <Fade in>
		<Container>
			<Row>
				<Col md={{ offset: 8, span: 4 }}>
					<Button as={Link} variant="info" to={'/expenses/new'}>Add new expense</Button>
				</Col>
			</Row>
			<Row style={{ marginTop: '20px' }}>
				<Col>
					<SuperTable
						columns={[
							{ title: 'Type' },
							{ title: 'Amount' },
							{ title: 'Year' },
							{ title: 'Month' },
							{ title: 'Day' },
							{ title: 'CreatedAt' },
						]}
						endpoint={'/api/expenses'}
						onError={showAlert}
						bindFiltersToSearch
					>
						{expense => <tr key={expense._id}>
							<td><Link to={`/expenses/${expense._id}`}>{expense.type}</Link></td>
							<td>{expense.amount}</td>
							<td>{expense.year}</td>
							<td>{expense.month}</td>
							<td>{expense.day}</td>
							<td>{moment(expense.createdAt).format('YYYY-MM-DD')}</td>
						</tr>}
					</SuperTable>
				</Col>
			</Row>
		</Container>
	</Fade>
}


export default ExpensesList
