import express from 'express'

import session, { authenticate, refreshSession, validateRights } from './session'
import users from './users'
import userGroups from './userGroups'
import seed from './seed'


const router = express.Router()


router.use(authenticate())
router.use(refreshSession())


router.use('/session', session)


router.use('/seed', seed)


router.use('/users',
	validateRights('UsersRead', 'GET'),
	validateRights('UsersWrite', 'POST PUT'),
	validateRights('UsersDelete', 'DELETE'), users)


router.use('/user-groups',
	validateRights('UserGroupsRead', 'GET'),
	validateRights('UserGroupsWrite', 'POST PUT'),
	validateRights('UserGroupsDelete', 'DELETE'), userGroups)


export default router
