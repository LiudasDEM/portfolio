import React, { useState, useMemo, useEffect, useCallback } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Fade, Container, Row, Col, Button } from 'react-bootstrap'

import http from 'z-fetch'
import { useAlerts } from '../../contexts/Alerts'
import { SuperForm, useForm, useCrud } from '../../shared'


function UserGroupsEdit() {
	const { id } = useParams()
	const { showAlert } = useAlerts()


	const [data, setData] = useState(UserGroupsEdit.createUserGroup())
	const [rights, setRights] = useState([])
	const { updateForm } = useForm({ setData })


	const useCrudOptions = useMemo(() => ({
		id,
		data,
		endpoint: '/api/user-groups',
		setData,
		createModel: UserGroupsEdit.createUserGroup,
		makeDTO: UserGroupsEdit.makeDTO,
		path: '/user-groups',
		successMessage: 'user group saved',
	}), [data, id])


	const { save } = useCrud(useCrudOptions)

	useEffect(() => {
		http.get('/api/user-groups/rights').then(res => {
			setRights(res.data)
		}, showAlert)
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	const toggleRights = useCallback(function toggleRights() {
		if (data.rights.length === rights.length) {
			setData(d => ({ ...d, rights: [] }))
		} else {
			setData(d => ({ ...d, rights }))
		}
	}, [data.rights, rights])

	const toggleRight = useCallback(function (r) {
		if (data.rights.includes(r)) {
			setData(d => ({ ...d, rights: d.rights.filter(x => x !== r) }))
		} else {
			setData(d => ({ ...d, rights: [...d.rights, r] }))
		}
	}, [data.rights])

	return <Fade in>
		<Container>
			<Row>
				<Col md={{ offset: 10, span: 2 }}>
					<Button as={Link} variant="info" to={'/user-groups'}>Cancel</Button>
				</Col>
			</Row>
			<Row>
				<Col>
					<SuperForm size="sm" onSubmit={save} data={data} updateForm={updateForm}>
						<SuperForm.Control label="Title" type="text" name="title" />
						<table>
							<thead>
								<tr>
									<th>
										<label>All rights</label>
										<input
											type="checkbox"
											onChange={toggleRights}
											checked={rights.length === data.rights.length} />
									</th>
									<th>Right</th>
								</tr>
							</thead>
							<tbody>
								{rights.map(x => <tr key={x}>
									<td>{x}</td>
									<td><input
										type="checkbox"
										checked={data.rights.includes(x)}
										onChange={() => toggleRight(x)}
									/></td>
								</tr>)}
							</tbody>
						</table>
						<Col>
							<Button variant="primary" type="submit">Save</Button>
						</Col>
					</SuperForm>
				</Col>
			</Row>
		</Container>
	</Fade>
}


UserGroupsEdit.createUserGroup = function () {
	return {
		_id: null,
		title: '',
		rights: [],
	}
}


UserGroupsEdit.makeDTO = function (data) {
	return {
		...data,
	}
}


export default UserGroupsEdit
