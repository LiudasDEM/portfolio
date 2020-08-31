import React, { useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Fade, Container, Row, Col, Button } from 'react-bootstrap'


import { SuperForm, useForm, useCrud } from '../../shared'


function ExpensesEdit() {
	const { id } = useParams()

	const formRules = useMemo(() => ({
		amount: { type: 'number', required: true },
		year: { type: 'number', required: true },
		month: { type: 'number', required: true },
		day: { type: 'number', required: true },
		type: { type: 'string', minLength: 3, maxLength: 16, required: true },
	}), [])

	const [data, setData] = useState(ExpensesEdit.createExpense())

	const { updateForm, validateForm } = useForm({ setData, rules: formRules, data })

	const useCrudOptions = useMemo(() => ({
		id,
		data,
		endpoint: '/api/expenses',
		setData,
		createModel: ExpensesEdit.createExpense,
		makeDTO: ExpensesEdit.makeDTO,
		path: '/expenses',
		successMessage: 'expense saved',
		validateForm,
	}), [data, id, validateForm])

	const { save, errors } = useCrud(useCrudOptions)

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
						<SuperForm.Control label="Amount" type="number" name="amount" />
						<SuperForm.Control label="Year" type="number" name="year" />
						<SuperForm.Control label="Month" type="number" name="month" />
						<SuperForm.Control label="Day" type="number" name="day" />
						<SuperForm.Control label="Type" type="string" name="type" />
						<Col>
							<Button variant="primary" type="submit">Save</Button>
						</Col>
					</SuperForm>
				</Col>
			</Row>
		</Container>
	</Fade>
}


ExpensesEdit.createExpense = function () {
	const now = new Date()
	return {
		amount: 0,
		year: now.getFullYear(),
		month: now.getMonth() + 1,
		day: now.getDay(),
		type: '',
	}
}


ExpensesEdit.makeDTO = function (data) {
	return {
		amount: Number(data.amount),
		year: Number(data.year),
		month: Number(data.month),
		day: Number(data.day),
		type: data.type,
	}
}



export default ExpensesEdit
