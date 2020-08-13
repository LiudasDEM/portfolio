import UserGroup, { IUserGroupModel, IUserGroup } from '../models/UserGroup'
import User from '../models/User'


import { constructModelGetters, constructModelDeleter, constructModelPutter, constructModelPoster } from 'apiService'
import { ValidationError } from 'apiService'


export const schema = {
	type: 'object',
	properties: {
		title: { type: 'string', required: true, minLength: 1, maxLength: 64 },
		rights: { type: 'array', items: { type: 'string', required: true } },
	},
}


export async function update(group: IUserGroupModel, dto: IUserGroup): Promise<void> {
	group.title = dto.title
	group.rights = dto.rights.filter((x: string) => allRights.includes(x))
	group.modifiedAt = new Date()
}


export const allRights = [
	...UserGroup.schema.statics.sharedRights,
	...UserGroup.schema.statics.administratorsOnlyRights,
]


export const [get, getOne] = constructModelGetters<IUserGroupModel>({
	Model: UserGroup,
	availableSelectOptions: '_id title rights',
	availableSortOptions: 'title',
})


export const DELETE = constructModelDeleter({
	getOne,
	validators: [validateUserGroupUsability],
	soft: false,
})


export const put = constructModelPutter<IUserGroupModel, IUserGroup>({
	update,
	getOne,
	schema,
})


export const post = constructModelPoster<IUserGroupModel, IUserGroup>({
	Model: UserGroup,
	schema, update,
})


export async function validateUserGroupUsability(userGroup: string): Promise<void> {
	if (await User.countDocuments({ userGroup })) {
		throw new ValidationError('UserGroup is assigned to users')
	}
}


export default {
	delete: DELETE,
	get, getOne,
	put,
	post,
	update,
	validateUserGroupUsability,
	schema,
}
