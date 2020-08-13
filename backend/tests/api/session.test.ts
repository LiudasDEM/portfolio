import 'mocha'


import request from 'supertest'
import assert from 'assert'

import util, { createSession, clearTestingData, parseCookie } from '../util'
import { createUser, mId, createUserDTO } from '../create'


import app from '../../src/app'


const config = util.getConfig()
const redis = util.getRedisClient()


describe('/api/session', function () {
	beforeEach(clearTestingData)

	it('should throw InternalServer error when publicKey is not of privateKey pair', async function () {
		const token = await createSession({})

		const originalKey = config.publicKey
		config.publicKey = ''

		await request(app)
			.get('/api')
			.set('Cookie', token)
			.expect(500)

		config.publicKey = originalKey
	})

	describe('GET /api/session', function () {
		it('should return null when no cookie is set', async function () {
			await request(app)
				.get('/api/session')
				.expect(200, null)
		})

		it('should return null when jwtPayload user does not exist', async function () {
			await request(app)
				.get('/api/session')
				.set('Cookie', await createSession({ _id: mId('0') }))
				.expect(200, null)
		})

		it('should return found user DTO when jwtPayload user exists', async function () {
			const existingUserDTO = {
				email: 'test@test.com',
				firstName: 'testFirstName',
				lastName: 'testLastName',
			}

			const user = await createUser({
				...await createUserDTO(),
				email: 'test@test.com',
				firstName: 'testFirstName',
				lastName: 'testLastName',
			})

			await request(app)
				.get('/api/session')
				.set('Cookie', await createSession({ _id: user._id }))
				.expect(200, {
					...existingUserDTO,
					rights: [],
				})
		})
	})

	describe('POST /api/session', function () {
		it('should throw ValidationError when no body is provided', async function () {
			await request(app)
				.post('/api/session')
				.expect(400, {
					message: 'ValidationError',
					extra: 'instance.email is required, instance.password is required',
				})
		})

		it('should throw Unauthorized when no user with given email exists', async function () {
			await request(app)
				.post('/api/session')
				.send({ email: 'test@test.com', password: 'test123' })
				.expect(401, { message: 'Unauthorized' })
		})

		it('should throw Unauthorized when wrong password is provided', async function () {
			await createUser({
				...await createUserDTO(),
				email: 'test@test.com',
				password: 'test123',
			})

			await request(app)
				.post('/api/session')
				.send({ email: 'test@test.com', password: 'totallywrongpassword' })
				.expect(401, { message: 'Unauthorized' })
		})

		it('should generate jwt and set Set-Cookie header with random token', async function () {
			const createdUser = await createUser({
				...await createUserDTO(),
				email: 'test@test.com',
				password: 'test123',
			})

			const res = await request(app)
				.post('/api/session')
				.send({ email: 'test@test.com', password: 'test123' })
				.expect(201)

			const token = util.parseCookie(res.header['set-cookie'][0], config.cookieName)
			assert(token)

			const jwt = await redis.get(config.cookieName + token)
			const jwtPayload = util.verifyJWT(jwt)

			assert.deepStrictEqual(jwtPayload._id, createdUser._id.toString())
			assert.deepStrictEqual(jwtPayload.email, 'test@test.com')
			assert.deepStrictEqual(jwtPayload.rights, [])

			assert(jwtPayload.iat)
		})
	})

	describe('DELETE /api/session', function () {
		it('should delete JWT and set Set-Cookie header with empty token', async function () {
			const cookie = await createSession({})
			const token = parseCookie(cookie, config.cookieName)

			await request(app)
				.delete('/api/session')
				.set('Cookie', cookie)
				.expect('set-cookie', 'test=; Path=/; HttpOnly')
				.expect(204)

			assert(!(await redis.get(config.cookieName + token)))
		})
	})
})
