import React from 'react'
import { Link } from 'react-router-dom'
import { Fade, Container, Row, Col, Button } from 'react-bootstrap'

import { useAlerts } from '../../contexts/Alerts'

import { SuperTable } from '../../shared'


function UserGroupsList() {
	const { showAlert } = useAlerts()

	return <Fade in>
		<Container>
			<Row>
				<Col md={{ offset: 8, span: 4 }}>
					<Button as={Link} variant="info" to={'/user-groups/new'}>Add new user</Button>
				</Col>
			</Row>
			<Row style={{ marginTop: '20px' }}>
				<Col>
					<SuperTable
						columns={[
							{ title: 'Title' },
						]}
						endpoint={'/api/user-groups'}
						onError={showAlert}
						bindFiltersToSearch
					>
						{userGroup => <tr key={userGroup._id}>
							<td><Link to={`/user-groups/${userGroup._id}`}>{userGroup.title}</Link></td>
						</tr>}
					</SuperTable>
				</Col>
			</Row>
		</Container>
	</Fade>
}


export default UserGroupsList
