import React from 'react'
import { Link } from 'react-router-dom'
import { Fade, Container, Row, Col, Button } from 'react-bootstrap'

import { useAlerts } from '../../contexts/Alerts'

import { SuperTable } from '../../shared'


function UsersList() {
	const { showAlert } = useAlerts()

	return <Fade in>
		<Container>
			<Row>
				<Col md={{ offset: 8, span: 4 }}>
					<Button as={Link} variant="info" to={'/users/new'}>Add new user</Button>
				</Col>
			</Row>
			<Row style={{ marginTop: '20px' }}>
				<Col>
					<SuperTable
						columns={[
							{ title: 'Email' },
							{ title: 'User group' },
						]}
						endpoint={'/api/users'}
						onError={showAlert}
						bindFiltersToSearch
					>
						{user => <tr key={user._id}>
							<td><Link to={`/users/${user._id}`}>{user.email}</Link></td>
							<td>{user.userGroup ? user.userGroup.title : '-'}</td>
						</tr>}
					</SuperTable>
				</Col>
			</Row>
		</Container>
	</Fade >
}


export default UsersList
