import User, { IUserModel, IUser } from '../models/User'

import { constructModelGetters, constructModelPutter, constructModelPoster } from 'apiService'
import { ValidationError } from 'apiService'


export const PASSWORD_PATTERN = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!"#$%&'()*+,-./:;<=>?@])[A-Za-z\d!"#$%&'()*+,-./:;<=>?@]{8,}$/

export const schema = {
	type: 'object',
	properties: {
		email: { type: 'string', required: true, minLength: 1, maxLength: 64, format: 'email' },
		firstName: { type: 'string', required: true, minLength: 1, maxLength: 64 },
		lastName: { type: 'string', required: true, minLength: 1, maxLength: 64 },
		password: {
			type: ['string', 'null'], minLength: 6, maxLength: 128,
			pattern: PASSWORD_PATTERN,
		},
	},
}


export async function update(user: IUserModel, dto: IUser): Promise<void> {
	user.firstName = dto.firstName
	user.lastName = dto.lastName
	user.userGroup = dto.userGroup
	user.modifiedAt = new Date()

	if (dto.password) {
		await user.setPassword(dto.password)
	}
}


export async function validateUserEmail(id: string, { email }: { email: string }): Promise<void> {
	const userWithSameEmail = await User.countDocuments({ _id: { $nin: [id] }, email })
	if (userWithSameEmail) { throw new ValidationError('DuplicateEmail') }
}


export function getModelInitialValues(dto: IUser): any {
	return {
		email: dto.email,
		createdAt: new Date(),
	}
}


export const [get, getOne] = constructModelGetters<IUserModel>({
	Model: User,
	availableSelectOptions: 'email firstName lastName userGroup secret hash',
	availableSortOptions: 'email firstName lastName',
})


export const put = constructModelPutter<IUserModel, IUser>({
	getOne,
	validators: [validateUserEmail],
	update, schema,
})


export const post = constructModelPoster<IUserModel, IUser>({
	Model: User,
	schema, update,
	validators: [validateUserEmail],
	getModelInitialValues,
})


export default {
	get,
	getOne,
	put,
	post,
	update,
	validateUserEmail,
	schema,
	PASSWORD_PATTERN,
}
