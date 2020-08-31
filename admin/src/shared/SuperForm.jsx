import React from 'react'
import PropTypes from 'prop-types'

import { Form } from 'react-bootstrap'
import AsyncSelect from 'react-select/async'


export function SuperForm(props) {
	const children = React.Children.map(props.children, child => {
		if (child.type === SuperFormControl) {
			return React.cloneElement(child, {
				updateForm: props.updateForm,
				data: props.data,
				errors: props.errors,
			})
		}

		return child
	})

	return <Form size={props.size || 'sm'} onSubmit={props.onSubmit}>
		{children}
	</Form>
}


function SuperFormControlComponent({ errors, label, name, type, data, updateForm, readOnly, ...props }) {
	const error = errors && errors.get(name)

	return <Form.Group>
		<Form.Label>{label}</Form.Label>
		{type !== 'async-select' && <Form.Control
			type={type}
			value={data[name]}
			name={name}
			onChange={updateForm}
			readOnly={readOnly || false}
			isInvalid={error}
		/>}
		{type === 'async-select' && <AsyncSelect
			loadOptions={props.loadOptions}
			onChange={(value) => updateForm({ target: { name, value: props.getOptionValue(value) } })}
			getOptionValue={props.getOptionValue}
			getOptionLabel={props.getOptionLabel}
			defaultOptions
			defaultValue={props.defaultValue}
		/>}
		{error ? error.map(e => <Form.Control.Feedback key={e} type="invalid">
			{e}
		</Form.Control.Feedback>) : null}
	</Form.Group>
}


SuperFormControlComponent.propTypes = {
	label: PropTypes.string.isRequired,
	name: PropTypes.string.isRequired,
	type: PropTypes.string.isRequired,
	data: PropTypes.any,
	readOnly: PropTypes.bool,
	updateForm: PropTypes.func,
	errors: PropTypes.any,
	loadOptions: PropTypes.func,
	getOptionValue: PropTypes.func,
	getOptionLabel: PropTypes.func,
	defaultValue: PropTypes.any,
}


export const SuperFormControl = React.memo(SuperFormControlComponent)


SuperForm.Control = SuperFormControl


SuperForm.propTypes = {
	children: PropTypes.node.isRequired,
	onSubmit: PropTypes.func.isRequired,
	updateForm: PropTypes.func.isRequired,
	data: PropTypes.any.isRequired,
	size: PropTypes.any,
	errors: PropTypes.any,
}


export default SuperForm
