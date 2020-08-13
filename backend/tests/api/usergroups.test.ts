import 'mocha'


import request from 'supertest'
import assert from 'assert'


import util, { createSession } from '../util'
import models, { createUserGroup, createUserGroupDTO, createUser, createUserDTO, mId } from '../create'


import { IUserGroup, IUserGroupModel } from '../../src/models/UserGroup'


import app from '../../src/app'


describe('/api/user-groups', function () {
	let sessionCookie = null

	const mapToTestsDTO = (x: IUserGroup) => ({
		title: x.title || null,
		rights: [...(x.rights || [])],
	})

	async function clearTestingData() {
		await util.clearTestingData({ keepSession: true })
	}

	before(util.clearTestingData)

	async function createPersistingSessions() {
		if (sessionCookie) { return }
		sessionCookie = await createSession({
			rights: ['UserGroupsRead', 'UserGroupsWrite'], isAdministrator: false,
		})
	}

	it('should return Forbidden when jwtPayload has no userGroups right', async function () {
		await request(app)
			.get('/api/user-groups')
			.set('Cookie', await createSession())
			.expect(403, { message: 'Forbidden' })
	})

	describe('GET', function () {
		after(clearTestingData)

		async function createReusableTestsContext() {
			sessionCookie = await createSession({
				rights: ['UserGroupsRead', 'UserGroupsWrite', 'UserGroupsDelete'], isAdministrator: false,
			})

			const r1: IUserGroupModel = await createUserGroup({
				title: 'testuserGroup1', rights: [],
			})
			const r2: IUserGroupModel = await createUserGroup({
				title: 'testuserGroup2', rights: ['Users', 'UserGroups'],
			})
			const r3: IUserGroupModel = await createUserGroup({
				title: 'nonsense3', rights: ['doesnotmatter'],
			})

			return {
				r1, r2, r3,
				expectedRights: [r1, r2, r3].map(mapToTestsDTO) as [IUserGroup],
			}
		}

		let context = null

		before(async () => {
			context = await createReusableTestsContext()
		})

		describe('GET /api/user-groups', function () {
			it('should return created userGroups DTOs', async function () {
				await request(app)
					.get('/api/user-groups')
					.set('Cookie', sessionCookie)
					.set('return-total-count', 'true')
					.expect('total-count', '3')
					.expect(200)
					.expect(res => assert.deepStrictEqual(res.body
						.map(mapToTestsDTO), context.expectedRights))
			})

			it('should only return rights that titles matches search', async function () {
				await request(app)
					.get('/api/user-groups')
					.query({ search: 'testuserGroup' })
					.set('Cookie', sessionCookie)
					.set('return-total-count', 'true')
					.expect('total-count', '2')
					.expect(200)
					.expect(res => assert.deepStrictEqual(res.body
						.map(mapToTestsDTO), context.expectedRights.filter(x => x.title.includes('test'))))
			})
		})

		describe('GET /api/user-groups/:id', function () {
			it('should throw NotFound when requested resourse does not exist', async function () {
				await request(app)
					.get(`/api/user-groups/${mId('0')}`)
					.set('Cookie', sessionCookie)
					.expect(404, { message: 'NotFound' })
			})

			it('should return userGroup DTO when doc for provided id exists', async function () {
				await request(app)
					.get(`/api/user-groups/${context.r1._id}`)
					.set('Cookie', sessionCookie)
					.expect(200)
					.expect(res => assert.deepStrictEqual(mapToTestsDTO(res.body), mapToTestsDTO(context.r1)))
			})
		})

		describe('GET /api/user-groups/rights', function () {
			it('should return all rights defined on userGroup schema ', async function () {
				await request(app)
					.get('/api/user-groups/rights')
					.set('Cookie', sessionCookie)
					.expect(200, [
						...models.UserGroup.schema.statics.sharedRights,
					])
			})
		})
	})

	describe('POST /api/user-groups', function () {
		before(createPersistingSessions)
		beforeEach(clearTestingData)

		it('should filter userGroup rights array before inserting doc', async function () {
			const userGroupDTO: IUserGroup = {
				...await createUserGroupDTO(),
				title: 'testuserGroup',
				rights: ['UsersRead', 'Gibberish', 'Testing'],
			}

			const res = await request(app)
				.post('/api/user-groups')
				.send(userGroupDTO)
				.set('Cookie', sessionCookie)
				.expect(201)

			const createdDocId = res.header['location'].split('/').pop()
			const createdUserGroup = await models.UserGroup.findById(createdDocId).select('-_id rights title').lean()

			assert.deepStrictEqual(createdUserGroup, {
				rights: ['UsersRead'],
				title: 'testuserGroup',
			})
		})
	})

	describe('PUT /api/user-groups/:id', function () {
		before(createPersistingSessions)
		beforeEach(clearTestingData)

		it('should throw NotFound when requested user does not exist', async function () {
			const userGroupDTO = {
				...await createUserGroupDTO(),
				title: 'testuserGroup',
				rights: ['Users', 'Gibberish', 'Testing'],
			}

			await request(app)
				.put(`/api/user-groups/${mId('0')}`)
				.send(userGroupDTO)
				.set('Cookie', sessionCookie)
				.expect(404, { message: 'NotFound' })
		})

		it('should update userGroup and splice gibberish rights', async function () {
			const userGroupDTO = {
				...await createUserGroupDTO(),
				title: 'testuserGroup',
				rights: ['UsersRead'],
			}

			const createdUserGroup = await createUserGroup(userGroupDTO)

			await request(app)
				.put(`/api/user-groups/${createdUserGroup._id}`)
				.send({
					title: 'updateduserGroup',
					rights: ['UsersRead', 'Gibberish', 'Testing'],
				})
				.set('Cookie', sessionCookie)
				.expect(204)

			const updateduserGroup = await models.UserGroup
				.findById(createdUserGroup._id)
				.select('-_id title rights')
				.lean()

			assert.deepStrictEqual(updateduserGroup, {
				title: 'updateduserGroup',
				rights: ['UsersRead'],
			})
		})
	})

	describe('DELETE /api/user-groups/:id', function () {
		before(createPersistingSessions)
		beforeEach(clearTestingData)

		it('should throw NotFound when requested userGroup does not exist', async function () {
			await request(app)
				.delete(`/api/user-groups/${mId('0')}`)
				.set('Cookie', sessionCookie)
				.expect(404, { message: 'NotFound' })
		})

		it('should not delete userGroup when its assigned to existing user', async function () {
			const userGroup = await createUserGroup({
				title: 'testuserGroup', rights: ['Users'],
			})

			await createUser({ ...await createUserDTO(), userGroup: userGroup._id })

			await request(app)
				.delete(`/api/user-groups/${userGroup._id}`)
				.set('Cookie', sessionCookie)
				.expect(400, {
					message: 'ValidationError',
					extra: 'UserGroup is assigned to users',
				})
		})

		it('should throw ValidationError when userGroup is assigned to user', async function () {
			const userGroup = await createUserGroup({ title: 'test', rights: ['Users'] })
			await createUser({ ...await createUserDTO(), userGroup: userGroup._id })

			await request(app)
				.delete(`/api/user-groups/${userGroup._id}`)
				.set('Cookie', sessionCookie)
				.expect(400, {
					message: 'ValidationError',
					extra: 'UserGroup is assigned to users',
				})
		})

		it('should remove userGroup', async function () {
			const userGroup = await createUserGroup({ title: 'test', rights: ['Users'] })

			await request(app)
				.delete(`/api/user-groups/${userGroup._id}`)
				.set('Cookie', sessionCookie)
				.expect(204)

			assert(!(await models.UserGroup.findById(userGroup._id)))
		})
	})
})
