import express, { Request, Response, NextFunction } from 'express'


import compression from 'compression'
import cookieParser from 'cookie-parser'


const app = express()


app.use(compression())
app.use(express.json())
app.use(cookieParser())


import api from './api'
app.use('/api', api)


app.use(function (
	err: any,
	req: Request,
	res: Response,
	next: NextFunction // eslint-disable-line @typescript-eslint/no-unused-vars
) {
	if (err.message === 'ValidationError') {
		console.warn(err.message, { error: err, req, status: 400 })
		res.status(400).json({
			message: 'ValidationError',
			extra: err.extra,
		})
		return
	}

	if (err.message === 'Unauthorized') {
		res.status(401).json({ message: err.message })
		return
	}

	if (err.message === 'Forbidden') {
		res.status(403).json({ message: err.message })
		return
	}

	if (err.message === 'NotFound') {
		res.status(404).json({ message: err.message })
		return
	}

	console.error(err.message)
	res.sendStatus(500)
})


export default app
