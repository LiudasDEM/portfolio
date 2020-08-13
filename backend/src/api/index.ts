import express from 'express'

import session, { authenticate, refreshSession } from './session'


const router = express.Router()


router.use(authenticate())
router.use(refreshSession())


router.use('/session', session)


export default router
