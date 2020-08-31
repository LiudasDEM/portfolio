import express from 'express'
const router = express.Router()
import wrap from 'express-async-wrap'


import expenseService from '../services/expenseService'


router.get('/', wrap(async function (req, res) {
	const expenses = await expenseService.get({
		query: { ...req.query as { [key: string]: any } },
		req, res, lean: true,
		predicate: { user: req.user._id },
	})

	res.json(expenses)
}))


router.get('/:id', wrap(async function (req, res) {
	const expense = await expenseService.getOne({
		id: req.params.id, lean: true, restApi: true,
		predicate: { user: req.user._id },
	})

	res.json(expense)
}))


router.post('/', wrap(async function (req, res) {
	await expenseService.post({ req, res, dto: { ...req.body, user: req.user } })
	res.sendStatus(201)
}))


router.put('/:id', wrap(async function (req, res) {
	await expenseService.put({ dto: { ...req.body, user: req.user }, id: req.params.id })
	res.sendStatus(204)
}))


router.delete('/:id', wrap(async function (req, res) {
	await expenseService.delete({ id: req.params.id })
	res.sendStatus(204)
}))


export default router
