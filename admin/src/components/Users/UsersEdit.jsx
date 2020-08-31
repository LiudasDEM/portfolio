import React, { useState, useMemo, useCallback } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Fade, Container, Row, Col, Button } from 'react-bootstrap'

import http from 'z-fetch'
import { useAlerts } from '../../contexts/Alerts'
import { SuperForm, useForm, useCrud, buildSearch } from '../../shared'


function UsersEdit() {
	const { id } = useParams()
	const { showAlert } = useAlerts()

	const formRules = useMemo(() => ({
		email: { type: 'string', required: true },
		firstName: { type: 'string', minLength: 6, maxLength: 64, required: true },
		lastName: { type: 'string', minLength: 6, maxLength: 64, required: true },
		password: {
			type: 'string', minLength: 6, maxLength: 64, required: false,
			pattern: /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!"#$%&'()*+,-./:;<=>?@])[A-Za-z\d!"#$%&'()*+,-./:;<=>?@]{8,}$/,
		},
		userGroup: { type: 'string', minLength: 24, maxLength: 24, required: true },
	}), [])

	const [data, setData] = useState(UsersEdit.createUser())

	const { updateForm, validateForm } = useForm({ setData, rules: formRules, data })

	const useCrudOptions = useMemo(() => ({
		id,
		data,
		endpoint: '/api/users',
		setData,
		createModel: UsersEdit.createUser,
		makeDTO: UsersEdit.makeDTO,
		path: '/users',
		successMessage: 'user saved',
		validateForm,
	}), [data, id, validateForm])


	const { save, errors } = useCrud(useCrudOptions)

	const loadUserGroups = useCallback(function loadUserGroups(input) {
		return http.get(`/api/user-groups${buildSearch({ search: input, select: '_id title' })}`).then(res => {
			return res.data
		}, showAlert)
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	return <Fade in>
		<Container>
			<Row>
				<Col md={{ offset: 10, span: 2 }}>
					<Button as={Link} variant="info" to={'/users'}>Cancel</Button>
				</Col>
			</Row>
			<Row>
				<Col>
					<SuperForm size="sm" onSubmit={save} data={data} updateForm={updateForm} errors={errors}>
						<SuperForm.Control label="Email" type="text" name="email" readOnly={!!data._id} />
						<SuperForm.Control label="First name" type="text" name="firstName" />
						<SuperForm.Control label="Last name" type="text" name="lastName" />
						<SuperForm.Control label="Password" type="password" name="password" />
						<SuperForm.Control
							label="User group"
							type="async-select"
							name="userGroup"
							loadOptions={loadUserGroups}
							getOptionValue={o => o._id}
							getOptionLabel={o => o.title}
							defaultValue={data.userGroup}
						/>
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
		userGroup: '',
	}
}


UsersEdit.makeDTO = function (data) {
	return {
		...data,
		password: data.password ? data.password : null,
		userGroup: (data.userGroup && data.userGroup._id) ? data.userGroup._id : data.userGroup,
	}
}


export default UsersEdit
