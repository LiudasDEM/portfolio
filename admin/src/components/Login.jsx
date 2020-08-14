import React, { useState, useCallback } from 'react'


import { Container, Row, Col, Card } from 'react-bootstrap'
import { Form, Button } from 'react-bootstrap'


import { useAuth, setUser } from '../contexts/Auth'


import http from '../http'


function Login() {
	const [, dispatch] = useAuth()

	const [credentials, setCredentials] = useState({
		email: '',
		password: '',
	})


	const updateForm = useCallback(function updateForm(event) {
		event.persist()
		setCredentials(creds => ({
			...creds,
			[event.target.name]: event.target.value,
		}))
	}, [])


	const authenticate = useCallback(function authenticate(event) {
		event.preventDefault()

		http.post('/api/session', credentials).then(() => {
			setUser(dispatch)
		}, console.error)
	}, [credentials, dispatch])


	return <Container>
		<Row style={{ marginTop: '20%' }} className="justify-content-md-center">
			<Col md={4} lg={4}>
				<Card bg="light">
					<Card.Header as="h5">Login</Card.Header>
					<Card.Body>
						<Form onSubmit={authenticate}>
							<Form.Group>
								<Form.Label>email</Form.Label>
								<Form.Control type="text" size="sm" value={credentials.email} name="email" onChange={updateForm} />
							</Form.Group>
							<Form.Group>
								<Form.Label>Password</Form.Label>
								<Form.Control type="password" size="sm" value={credentials.password} name="password" onChange={updateForm} />
							</Form.Group>
							<Col className="text-center">
								<Button variant="primary" type="submit">Login</Button>
							</Col>
						</Form>
					</Card.Body>
				</Card>
			</Col>
		</Row>
	</Container>
}


export default Login
