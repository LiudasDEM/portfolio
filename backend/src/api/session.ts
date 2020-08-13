import express from 'express'
const router = express.Router()
import wrap from 'express-async-wrap'

import crypto from 'crypto'

import jwt from 'jsonwebtoken'
import cookie from 'cookie'
import { validateJSON } from 'apiService'

import config from '../../config'
import redis from '../redis'

import { IUserModel } from '../models/User'
import userService from '../services/userService'

const jwtSessionLength = 60 * 60

const userLoginSchema = {
	type: 'object',
	properties: {
		email: { type: 'email', required: true },
		password: { type: 'string', required: true, minLength: 6 },
	},
}


router.get('/', wrap(async function (req, res) {
	if (!req.user) {
		res.json(null)
		return
	}

	const [user] = await userService.get({
		id: req.user._id,
		query: {
			page: 0,
			size: 1,
			select: 'email firstName lastName userGroup language',
		},
		populate: [
			{ model: 'UserGroup', path: 'userGroup', select: 'rights' },
			{ model: 'Company', path: 'company', select: 'isAdministrators' },
		],
		lean: true,
	})

	if (!user) {
		res.json(null)
		return
	}

	res.json({
		email: user.email,
		firstName: user.firstName,
		lastName: user.lastName,
		rights: (user.userGroup || { rights: [] }).rights,
	})
}))


router.post('/', wrap(async function (req, res) {
	validateJSON(req.body, userLoginSchema)
	req.body.email = req.body.email.toLowerCase()

	const [user] = await userService.get({
		predicate: { email: req.body.email },
		query: {
			page: 0,
			size: 1,
			select: 'email firstName lastName userGroup secret card company car',
		},
		populate: [
			{ model: 'UserGroup', path: 'userGroup', select: 'rights' },
			{ model: 'Company', path: 'company', select: 'isAdministrators' },
		],
	})

	if (!user) {
		throw new Error('Unauthorized')
	}

	if (!(await user.isPassword(req.body.password))) {
		throw new Error('Unauthorized')
	}

	await createSession(user, res)

	res.sendStatus(201)
}))


router.delete('/', wrap(removeSession))


async function createSession(user: IUserModel, res: express.Response) {
	const jwtPayload = {
		_id: user._id,
		email: user.email,
		rights: (user.userGroup || { rights: [] }).rights,
		userGroupId: (user.userGroup || {})._id,
		firstName: user.firstName,
		lastName: user.lastName,
	}

	const token = crypto.randomBytes(16).toString('hex')

	const jwtToken = jwt.sign(jwtPayload, config.privateKey, { algorithm: 'RS256' })
	await redis.set(config.cookieName + token, jwtToken, 'EX', jwtSessionLength)

	res.set('Set-Cookie', cookie.serialize(config.cookieName, token, {
		path: '/',
		maxAge: jwtSessionLength,
		httpOnly: true,
	}))
}


async function removeSession(req: express.Request, res: express.Response) {
	await redis.del(config.cookieName + req.cookieToken)
	res.set('Set-Cookie', cookie.serialize(config.cookieName, '', { path: '/', httpOnly: true }))
	res.sendStatus(204)
}


export function refreshSession() {
	return wrap(async function (req, res, next) {
		if (!req.user) {
			return next()
		}

		const [user] = await userService.get({
			id: req.user._id,
			query: {
				page: 0,
				size: 1,
				select: 'email firstName lastName userGroup card car',
			},
			populate: [
				{ model: 'UserGroup', path: 'userGroup', select: 'rights' },
				{ model: 'Company', path: 'company', select: 'isAdministrators' },
			],
		})

		if (!user) {
			return next()
		}

		if (Date.now() / 1000 > req.user.iat + jwtSessionLength) {
			return next()
		}

		await createSession(user, res)

		next()
	})
}


export function validateRights(rights: string, methods?: string) {
	return wrap(async function (req, res, next) {
		if (methods) {
			if (!methods.split(' ').includes(req.method)) {
				return next()
			}
		}

		if (!req.user) {
			throw new Error('Unauthorized')
		}

		if (rights.split(' ').some(x => !(req.user.rights || []).includes(x))) {
			throw new Error('Forbidden')
		}

		next()
	})
}


export function authenticate() {
	return wrap(async function (req, res, next) {
		if (!req.headers.cookie) { return next() }

		const token = cookie.parse(req.headers.cookie)[config.cookieName]
		if (!token) { return next() }

		const jwtToken = await redis.get(config.cookieName + token)
		if (!jwtToken) { return next() }

		let jwtPayload

		try {
			// @ts-ignore
			jwtPayload = jwt.verify(jwtToken, config.publicKey, { algorithm: 'RSA256' })
		} catch (e) {
			throw new Error('JWT validation failed')
		}

		req.user = jwtPayload
		req.cookieToken = token

		next()
	})
}


export default router
