import React from 'react'
import PropTypes from 'prop-types'

import { Form } from 'react-bootstrap'


export function SuperForm(props) {
	const children = React.Children.map(props.children, child => {
		if (child.type === SuperFormControl) {
			return React.cloneElement(child, {
				updateForm: props.updateForm,
				data: props.data,
			})
		}

		return child
	})

	return <Form size={props.size || 'sm'} onSubmit={props.onSubmit}>
		{children}
	</Form>
}


export function SuperFormControl({ label, name, type, data, updateForm, readOnly }) {
	return <Form.Group>
		<Form.Label>{label}</Form.Label>
		<Form.Control
			type={type}
			value={data[name]}
			name={name}
			onChange={updateForm}
			readOnly={readOnly || false}
		/>
	</Form.Group>
}


SuperFormControl.propTypes = {
	label: PropTypes.string.isRequired,
	name: PropTypes.string.isRequired,
	type: PropTypes.string.isRequired,
	data: PropTypes.any,
	readOnly: PropTypes.bool,
	updateForm: PropTypes.func,
}


SuperForm.Control = SuperFormControl


SuperForm.propTypes = {
	children: PropTypes.node.isRequired,
	onSubmit: PropTypes.func.isRequired,
	updateForm: PropTypes.func.isRequired,
	data: PropTypes.any.isRequired,
	size: PropTypes.any,
}


export default SuperForm
