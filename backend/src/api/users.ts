import express from 'express'
const router = express.Router()
import wrap from 'express-async-wrap'


import userService from '../services/userService'


router.get('/', wrap(async (req, res) => {
	const users = await userService.get({
		query: {
			...req.query,
			select: 'email firstName lastName userGroup',
		}, req, res,
		populate: [
			{ model: 'UserGroup', path: 'userGroup', select: 'rights title' },
		],
	})

	res.json(users)
}))


router.get('/:id', wrap(async (req, res) => {
	const [user] = await userService.get({
		query: { size: 1, page: 0, select: 'email firstName lastName userGroup secret' },
		lean: true, id: req.params.id,
		populate: [
			{ model: 'UserGroup', path: 'userGroup', select: 'rights title' },
		], restApi: true,
	})

	res.json({ ...user, secret: undefined, isActive: !!user.secret })
}))


router.post('/', wrap(async (req, res) => {
	await userService.post({
		dto: req.body, req, res, extraValidatorsArgs: { email: req.body.email },
	})

	res.sendStatus(201)
}))


router.put('/:id', wrap(async (req, res) => {
	await userService.put({
		extraValidatorsArgs: { email: req.body.email },
		dto: req.body, id: req.params.id,
	})

	res.sendStatus(204)
}))


export default router
