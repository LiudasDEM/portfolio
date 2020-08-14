import express from 'express'
import wrap from 'express-async-wrap'

import { seed } from '../services/userService'


const router = express.Router()


router.get('/', wrap(async function (req, res) {
	await seed()
	res.sendStatus(200)
}))


export default router
