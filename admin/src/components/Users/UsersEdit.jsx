import React, { useEffect, useState, useCallback } from 'react'
import { Link, useParams, useHistory } from 'react-router-dom'
import { Fade, Container, Row, Col, Button } from 'react-bootstrap'

import { useAlerts } from '../../contexts/Alerts'

import { http, SuperForm, useForm } from '../../shared'


function UsersEdit() {
	const { id } = useParams()
	const history = useHistory()

	const { showAlert } = useAlerts()

	const [data, setData] = useState(UsersEdit.createUser())

	const { updateForm } = useForm({ setData })

	const load = useCallback(() => {
		http.get(`/api/users/${id}`).then((res) => {
			setData({ ...UsersEdit.createUser(), ...res.data })
		}, showAlert)
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [id])

	useEffect(() => {
		if (id === 'new') {
			return
		}
		load()
	}, [id, load])

	const save = useCallback((event) => {
		event.preventDefault()

		const dto = UsersEdit.formDTO(data)

		const promise = !dto._id
			? http.post('/api/users', dto).then(res => {
				const id = res.headers.get('location').split('/').pop()
				history.replace(`/users/${id}`)
			})
			: http.put(`/api/users/${dto._id}`, dto).then(() => {
				load()
			})

		promise.then(() => {
			showAlert('user saved')
		}, showAlert)
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [data])

	return <Fade in>
		<Container>
			<Row>
				<Col md={{ offset: 10, span: 2 }}>
					<Button as={Link} variant="info" to={'/users'}>Cancel</Button>
				</Col>
			</Row>
			<Row>
				<Col>
					<SuperForm size="sm" onSubmit={save} data={data} updateForm={updateForm}>
						<SuperForm.Control label="Email" type="text" name="email" readOnly={!!data._id} />
						<SuperForm.Control label="First name" type="text" name="firstName" />
						<SuperForm.Control label="Last name" type="text" name="lastName" />
						<SuperForm.Control label="Password" type="password" name="password" />
						<Col>
							<Button variant="primary" type="submit">Save</Button>
						</Col>
					</SuperForm>
				</Col>
			</Row>
		</Container>
	</Fade>
}


UsersEdit.createUser = function () {
	return {
		_id: null,
		email: '',
		firstName: '',
		lastName: '',
		password: '',
	}
}


UsersEdit.formDTO = function (data) {
	return {
		...data,
		password: data.password ? data.password : null,
	}
}


export default UsersEdit
