import React, { useState, useMemo } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Fade, Container, Row, Col, Button } from 'react-bootstrap'


import { SuperForm, useForm, useCrud } from '../../shared'


function UsersEdit() {
	const { id } = useParams()


	const [data, setData] = useState(UsersEdit.createUser())
	const { updateForm } = useForm({ setData })


	const useCrudOptions = useMemo(() => ({
		id,
		data,
		endpoint: '/api/users',
		setData,
		createModel: UsersEdit.createUser,
		makeDTO: UsersEdit.makeDTO,
		path: '/users',
		successMessage: 'user saved',
	}), [data, id])


	const { save } = useCrud(useCrudOptions)


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


UsersEdit.makeDTO = function (data) {
	return {
		...data,
		password: data.password ? data.password : null,
	}
}


export default UsersEdit
