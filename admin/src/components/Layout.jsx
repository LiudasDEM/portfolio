import React from 'react'
import { Route, Link } from 'react-router-dom'
import { Fade, Container, Row, Col, ListGroup, SplitButton, Dropdown } from 'react-bootstrap'


import { useAuth } from '../contexts/Auth'


import { UsersList, UsersEdit } from './Users'
import { UserGroupsList, UserGroupsEdit } from './UserGroups'
import { ExpensesList, ExpensesEdit } from './Expenses'


function Layout() {
	const { user, logout } = useAuth()

	return <Fade in>
		<Container fluid="xl">
			<Row style={{ marginTop: '20px' }}>
				<Col><Link to={'/'}>Home</Link></Col>
				<Col md={{ span: 4, offset: 4 }}>
					<SplitButton size={'sm'} variant={'info'} title={user.email}>
						<Dropdown.Item onClick={logout}>Logout</Dropdown.Item>
					</SplitButton>
				</Col>
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
						<ListGroup.Item action variant="light">
							<Link to={'/expenses'}>Expenses</Link>
						</ListGroup.Item>
					</ListGroup>
				</Col>
				<Col md={8} variant="light">
					<Container fluid>
						<Route path="/users" exact component={UsersList} />
						<Route path="/users/:id" component={UsersEdit} />
						<Route path="/user-groups" exact component={UserGroupsList} />
						<Route path="/user-groups/:id" component={UserGroupsEdit} />
						<Route path="/expenses" exact component={ExpensesList} />
						<Route path="/expenses/:id" component={ExpensesEdit} />
					</Container>
				</Col>
			</Row>
		</Container>
	</Fade>
}


export default Layout
