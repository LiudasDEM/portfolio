import React from 'react'
import { Fade, Container } from 'react-bootstrap'

import { useAlerts } from '../../contexts/Alerts'

import { SuperTable } from '../../shared'


function UsersList() {
	const { showAlert } = useAlerts()

	return <Fade in>
		<Container>
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
					<td>{user.email}</td>
					<td>{user.userGroup.title}</td>
				</tr>}
			</SuperTable>
		</Container>
	</Fade >
}


export default UsersList
