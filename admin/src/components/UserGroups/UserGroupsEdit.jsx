import React, { useState, useMemo } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Fade, Container, Row, Col, Button } from 'react-bootstrap'


import { SuperForm, useForm, useCrud } from '../../shared'


function UserGroupsEdit() {
	const { id } = useParams()


	const [data, setData] = useState(UserGroupsEdit.createUser())
	const { updateForm } = useForm({ setData })


	const useCrudOptions = useMemo(() => ({
		id,
		data,
		endpoint: '/api/user-groups',
		setData,
		createModel: UserGroupsEdit.createUser,
		makeDTO: UserGroupsEdit.makeDTO,
		path: '/user-groups',
		successMessage: 'user saved',
	}), [data, id])


	const { save } = useCrud(useCrudOptions)


	return <Fade in>
		<Container>
			<Row>
				<Col md={{ offset: 10, span: 2 }}>
					<Button as={Link} variant="info" to={'/user-group'}>Cancel</Button>
				</Col>
			</Row>
			<Row>
				<Col>
					<SuperForm size="sm" onSubmit={save} data={data} updateForm={updateForm}>
						<SuperForm.Control label="Title" type="text" name="title" />
						<Col>
							<Button variant="primary" type="submit">Save</Button>
						</Col>
					</SuperForm>
				</Col>
			</Row>
		</Container>
	</Fade>
}


UserGroupsEdit.createUser = function () {
	return {
		_id: null,
		title: '',
	}
}


UserGroupsEdit.makeDTO = function (data) {
	return {
		...data,
	}
}


export default UserGroupsEdit
