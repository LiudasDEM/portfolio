import express from 'express'
const router = express.Router()
import wrap from 'express-async-wrap'


import UserGroup from '../models/UserGroup'
import userGroupService from '../services/userGroupService'


router.get('/', wrap(async function (req, res) {
	const userGroups = await userGroupService.get({
		query: { ...req.query as { [key: string]: any } }, req, res, lean: true,
	})

	res.json(userGroups)
}))


router.get('/rights', wrap(async function (req, res) {
	res.json(UserGroup.schema.statics.sharedRights)
}))


router.get('/:id', wrap(async function (req, res) {
	const userGroup = await userGroupService.getOne({
		id: req.params.id, lean: true, restApi: true,
	})

	res.json(userGroup)
}))


router.post('/', wrap(async function (req, res) {
	await userGroupService.post({ req, res, dto: req.body })
	res.sendStatus(201)
}))


router.put('/:id', wrap(async function (req, res) {
	await userGroupService.put({ dto: req.body, id: req.params.id })
	res.sendStatus(204)
}))


router.delete('/:id', wrap(async function (req, res) {
	await userGroupService.delete({ id: req.params.id })
	res.sendStatus(204)
}))


export default router
