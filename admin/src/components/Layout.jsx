import React from 'react'
import { Route } from 'react-router-dom'
import { Fade, Container } from 'react-bootstrap'


import { UsersList, UsersEdit } from './Users'
import { UserGroupsList, UserGroupsEdit } from './UserGroups'


function Layout() {
	return <Fade in>
		<Container>
			<Route path="/users" exact component={UsersList} />
			<Route path="/users/:id" component={UsersEdit} />
			<Route path="/user-groups" exact component={UserGroupsList} />
			<Route path="/user-groups/:id" component={UserGroupsEdit} />
		</Container>
	</Fade>
}


export default Layout
