import React, { useEffect } from 'react'
import { Fade, Container, Alert, Row, Col } from 'react-bootstrap'


import { useAlerts } from '../contexts/Alerts'
import { useAuth } from '../contexts/Auth'


import Login from './Login'


function Layout() {
	const { alerts, removeAlert } = useAlerts()
	const { logout, setUser, isAuthenticated } = useAuth()

	useEffect(() => {
		setUser()
	}, []) //eslint-disable-line react-hooks/exhaustive-deps

	return <Fade in>
		<Container>
			{!isAuthenticated
				? <Login />
				: <div><button onClick={() => logout()}>logout</button></div>
			}

			<Row style={{ marginTop: '20px' }}>
				<Col md={{ span: 3, offset: 9 }} lg={3}>
					<div className="alert-box">
						{alerts.map((alert, i) => (
							<Alert
								className="alert__content" key={i} dismissible
								variant={alert.variant} onClose={() => removeAlert(alert)}>
								{alert.text}
							</Alert>
						))}
					</div>
				</Col>
			</Row>
		</Container>
	</Fade>
}


export default Layout
