import React, { useEffect } from 'react'
import { Row, Col, Alert } from 'react-bootstrap'
import { Route, Switch } from 'react-router-dom'


import { useAlerts } from '../contexts/Alerts'
import { useAuth } from '../contexts/Auth'


import Login from './Login'
import Layout from './Layout'


function App() {
	const { alerts, removeAlert } = useAlerts()
	const { setUser, isAuthenticated } = useAuth()

	useEffect(() => {
		setUser()
	}, []) //eslint-disable-line react-hooks/exhaustive-deps

	return <>
		<Switch>
			{!isAuthenticated
				? <Route component={Login} />
				: <Route component={Layout} />
			}
		</Switch>
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
	</>
}


export default App
