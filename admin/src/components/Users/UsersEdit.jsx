import React from 'react'
import { Link } from 'react-router-dom'
import { Fade, Container, Row, Col, Button } from 'react-bootstrap'


function UsersEdit() {
	return <Fade in>
		<Container>
			<Row>
				<Col md={{ offset: 8, span: 4 }}><Button as={Link} variant="info" to={'/users'}>Cancel</Button></Col>
			</Row>
			<Row>
				<Col>
					main content
				</Col>
			</Row>
		</Container>
	</Fade>
}


export default UsersEdit
