import React from 'react'
import { Fade, Container } from 'react-bootstrap'

import { useAlerts } from '../../contexts/Alerts'

import { SuperTable } from '../../shared'


function UserGroupsList() {
	const { showAlert } = useAlerts()

	return <Fade in>
		<Container>
			<SuperTable
				columns={[
					{ title: 'Title' },
				]}
				endpoint={'/api/user-groups'}
				onError={showAlert}
				bindFiltersToSearch
			>
				{user => <tr key={user._id}>
					<td>{user.title}</td>
				</tr>}
			</SuperTable>
		</Container>
	</Fade>
}


export default UserGroupsList
