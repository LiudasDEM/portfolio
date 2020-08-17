import React from 'react'
import { Route, Link } from 'react-router-dom'
import { Fade, Container, Row, Col, ListGroup } from 'react-bootstrap'


import { useAuth } from '../contexts/Auth'


import { UsersList, UsersEdit } from './Users'
import { UserGroupsList, UserGroupsEdit } from './UserGroups'


function Layout() {
	const { user } = useAuth()

	return <Fade in>
		<Container fluid="xl">
			<Row style={{ marginTop: '20px' }}>
				<Col><Link to={'/'}>Home</Link></Col>
				<Col md={{ span: 4, offset: 4 }}>{user.email}</Col>
			</Row>
			<Row style={{ marginTop: '30px' }}>
				<Col md={3}>
					<ListGroup>
						<ListGroup.Item action variant="light">
							<Link to={'/users'}>Users</Link>
						</ListGroup.Item>
						<ListGroup.Item action variant="light">
							<Link to={'/user-groups'}>User groups</Link>
						</ListGroup.Item>
					</ListGroup>
				</Col>
				<Col md={8} variant="light">
					<Container fluid>
						<Route path="/users" exact component={UsersList} />
						<Route path="/users/:id" component={UsersEdit} />
						<Route path="/user-groups" exact component={UserGroupsList} />
						<Route path="/user-groups/:id" component={UserGroupsEdit} />
					</Container>
				</Col>
			</Row>
		</Container>
	</Fade>
}


export default Layout
