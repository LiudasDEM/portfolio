import express from 'express'

import session, { authenticate, refreshSession, validateRights } from './session'
import users from './users'


const router = express.Router()


router.use(authenticate())
router.use(refreshSession())


router.use('/session', session)

router.use('/users',
	validateRights('UsersRead', 'GET'),
	validateRights('UsersWrite', 'POST PUT'),
	validateRights('UsersDelete', 'DELETE'), users)


export default router
