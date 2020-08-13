import 'mocha'


import request from 'supertest'
import assert from 'assert'


import util, { createSession } from '../util'
import models, { createUser, mId } from '../create'


import { IUserModel, IUser } from '../../src/models/User'

import app from '../../src/app'


describe('/api/users', function () {
	let sessionCookie = null

	const mapToTestsDTO = (x: IUser) => ({
		email: x.email || null,
		firstName: x.firstName || null,
		lastName: x.lastName || null,
		password: x.password || null,
		userGroup: x.userGroup || null,
	})

	before(util.clearTestingData)

	async function clearTestingData() {
		await util.clearTestingData({ keepSession: true })
	}

	async function createPersistingSession() {
		if (sessionCookie) { return }
		sessionCookie = await createSession({
			rights: ['UsersRead', 'UsersWrite', 'UsersDelete'],
		})
	}

	it('should throw unauthorized when cookie is not set', async function () {
		await request(app)
			.get('/api/users')
			.expect(401, { message: 'Unauthorized' })
	})

	it('should throw forbbiden when requester does not have Users right', async function () {
		await request(app)
			.get('/api/users')
			.set('Cookie', await createSession())
			.expect(403, { message: 'Forbidden' })
	})

	describe('GET', function () {
		after(clearTestingData)

		async function createReusableTestsContext() {
			const u1: IUserModel = await createUser({
				email: 'test@test1.com',
				firstName: 'testFirstName1',
				lastName: 'testLastName1',
				password: 'Test123!',
				userGroup: null,
			})

			const u2: IUserModel = await createUser({
				email: 'test@test2.com',
				firstName: 'testFirstName2',
				lastName: 'testLastName2',
				password: 'Test123!',
				userGroup: null,
			})

			const u3: IUserModel = await createUser({
				email: 'aintmatch@aintmatch.com',
				firstName: 'aintmatch',
				lastName: 'aintmatch',
				password: 'Test123!',
				userGroup: null,
			})

			sessionCookie = await createSession({
				rights: ['UsersRead', 'UsersWrite', 'UsersDelete'], isAdministrator: true,
			})

			return {
				u1, u2, u3,
				expectedUsers: [u1, u2, u3].map(mapToTestsDTO) as [IUser],
			}
		}

		let context = null

		before(async () => {
			context = await createReusableTestsContext()
		})

		describe('GET /api/users', function () {
			it('should return all created users', async function () {
				await request(app)
					.get('/api/users')
					.set('Cookie', sessionCookie)
					.set('Return-Total-Count', 'true')
					.expect('total-count', '3')
					.expect(200)
					.expect(res => assert.deepStrictEqual(res.body
						.map(mapToTestsDTO), context.expectedUsers))
			})

			it('should return only users matched by search', async function () {
				await request(app)
					.get('/api/users')
					.query({ sort: 'email', search: 'test' })
					.set('Cookie', sessionCookie)
					.set('Return-Total-Count', 'true')
					.expect('total-count', '2')
					.expect(200)
					.expect(res => assert.deepStrictEqual(res.body
						.map(mapToTestsDTO), context.expectedUsers.filter((x: IUser) => x.email.includes('test'))))
			})
		})

		describe('GET /api/users/:id', function () {
			it('should throw NotFound when requested user does not exist', async function () {
				await request(app)
					.get(`/api/users/${mId('0')}`)
					.set('Cookie', sessionCookie)
					.expect(404, { message: 'NotFound' })
			})

			it('should return user DTO when doc for provided id exists', async function () {
				await request(app)
					.get(`/api/users/${context.u1._id}`)
					.set('Cookie', sessionCookie)
					.expect(200)
					.expect(res => assert.deepStrictEqual(mapToTestsDTO(res.body), mapToTestsDTO(context.u1)))
			})
		})
	})

	describe('POST /api/users', function () {
		before(createPersistingSession)
		beforeEach(clearTestingData)

		it('should throw DuplicateEmail error when user with provided email already exists', async function () {
			const userDTO: IUser = {
				email: 'test@test.com',
				firstName: 'testFirstName',
				lastName: 'testLastName',
				password: 'Test123!',
				userGroup: {
					_id: mId('0'),
					rights: [],
				},
			}

			await createUser(userDTO)

			await request(app)
				.post('/api/users')
				.set('Cookie', sessionCookie)
				.send(userDTO)
				.expect(400, { message: 'ValidationError', extra: 'DuplicateEmail' })
		})

		it('should throw multiple ValidationErrors when request body is empty', async function () {
			await request(app)
				.post('/api/users')
				.set('Cookie', sessionCookie)
				.send({})
				.expect(400, {
					message: 'ValidationError',
					extra: 'instance.email is required, instance.firstName is required, instance.lastName is required',
				})
		})

		it('should create new User in database', async function () {
			const user: IUser = {
				email: 'test@test.com',
				firstName: 'testFirstName',
				lastName: 'testLastName',
				password: 'Test123!',
				userGroup: {
					_id: mId('0'),
					rights: [],
				},
			}

			await request(app)
				.post('/api/users')
				.set('Cookie', sessionCookie)
				.send(user)
				.expect(201)

			const createdUser = await models.User.findOne({ email: user.email }).select('_id secret')

			assert(await createdUser.isPassword('Test123!'))
		})

		it('should send user set password email if flag is set in body', async function () {
			const user: IUser = {
				email: 'test@test.com',
				firstName: 'testFirstName',
				lastName: 'testLastName',
				password: 'Test123!',
				userGroup: {
					_id: mId('0'),
					rights: [],
				},
			}

			await request(app)
				.post('/api/users')
				.set('Cookie', sessionCookie)
				.send(user)
				.expect(201)
		})
	})

	describe('PUT /api/users/:id', function () {
		before(createPersistingSession)
		beforeEach(clearTestingData)

		it('should throw NotFound when requested user does not exist', async function () {
			await request(app)
				.put(`/api/users/${mId('0')}`)
				.send({
					email: 'test@test.com',
					firstName: 'updatedFirstName',
					lastName: 'updatedLastName',
					userGroup: {
						_id: mId('0'),
						rights: [],
					},
				})
				.set('Cookie', sessionCookie)
				.expect(404, { message: 'NotFound' })
		})

		it('should throw ValidationError error when trying to update user with same email', async function () {
			const userDTO: IUser = {
				email: 'test@test.com',
				firstName: 'testFirstName',
				lastName: 'testLastName',
				password: 'Test123!',
				userGroup: {
					_id: mId('0'),
					rights: [],
				},
			}

			const userWithSameEmail = {
				...userDTO,
				email: 'email@update.com',
			}

			await createUser(userWithSameEmail)
			const createdUser = await createUser(userDTO)

			await request(app)
				.put(`/api/users/${createdUser._id}`)
				.set('Cookie', sessionCookie)
				.send(userWithSameEmail)
				.expect(400, { message: 'ValidationError', extra: 'DuplicateEmail' })
		})

		it('should update user when doc for provided id exists', async function () {
			const createdUser = await createUser({
				email: 'test@test.com',
				firstName: 'testFirstName',
				lastName: 'testLastName',
				password: 'Test123!',
				userGroup: null,
			})

			await request(app)
				.put(`/api/users/${createdUser._id}`)
				.send({
					email: 'test@test.com',
					firstName: 'updatedFirstName',
					lastName: 'updatedLastName',
					userGroup: {
						_id: mId('0'),
					},
				})
				.set('Cookie', sessionCookie)
				.expect(204)

			const updatedUser = await models.User
				.findById(createdUser._id)
				.select('_id email firstName lastName userGroup')
				.lean()

			assert.deepStrictEqual(updatedUser, {
				_id: createdUser._id,
				email: 'test@test.com',
				firstName: 'updatedFirstName',
				lastName: 'updatedLastName',
				userGroup: mId('0'),
			})
		})

		it('should send user set password email if flag is set in body', async function () {
			const createdUser = await createUser({
				email: 'test@test.com',
				firstName: 'testFirstName',
				lastName: 'testLastName',
				password: 'Test123!',
				userGroup: null,
			})

			await request(app)
				.put(`/api/users/${createdUser._id}`)
				.send({
					email: 'test@test.com',
					firstName: 'updatedFirstName',
					lastName: 'updatedLastName',
					userGroup: {
						_id: mId('0'),
					},
				})
				.set('Cookie', sessionCookie)
				.expect(204)
		})
	})
})
