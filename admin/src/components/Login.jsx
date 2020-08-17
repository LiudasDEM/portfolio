import React, { useState, useCallback } from 'react'


import { Container, Row, Col, Card } from 'react-bootstrap'
import { Button } from 'react-bootstrap'


import { useAlerts } from '../contexts/Alerts'
import { useAuth } from '../contexts/Auth'


import { http, useForm, SuperForm } from '../shared'


function Login() {
	const { showAlert } = useAlerts()
	const { setUser } = useAuth()

	const [credentials, setCredentials] = useState({
		email: '',
		password: '',
	})

	const { updateForm } = useForm({
		setData: setCredentials,
	})

	const authenticate = useCallback(function authenticate(event) {
		event.preventDefault()

		http.post('/api/session', credentials).then(() => {
			setUser()
		}, showAlert)
	}, [credentials]) //eslint-disable-line react-hooks/exhaustive-deps


	return <Container>
		<Row style={{ marginTop: '20%' }} className="justify-content-md-center">
			<Col md={4} lg={4}>
				<Card bg="light">
					<Card.Header as="h5">Login</Card.Header>
					<Card.Body>
						<SuperForm onSubmit={authenticate} data={credentials} updateForm={updateForm}>
							<SuperForm.Control type="text" name="email" label="Email" />
							<SuperForm.Control type="password" name="password" label="Password" />
							<Col className="text-center">
								<Button variant="primary" type="submit">Login</Button>
							</Col>
						</SuperForm>
					</Card.Body>
				</Card>
			</Col>
		</Row>
	</Container>
}


export default Login
