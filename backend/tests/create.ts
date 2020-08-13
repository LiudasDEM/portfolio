import mongoose from 'mongoose'


import User, { IUser, IUserModel } from '../src/models/User'


export function uniq(): string {
	return Math.floor(Math.random() * 1048576).toString(32)
}


export function mId(x?: string): mongoose.Types.ObjectId {
	return new mongoose.Types.ObjectId(id(x))
}


export function id(x?: string): string {
	return ('000000000000000000000000' + x).substr(-24, 24)
}


export async function createUserDTO(): Promise<IUser> {
	const u = uniq()

	return {
		email: `${u}-@email.com`,
		firstName: `${u}-firstName`,
		lastName: `${u}-lastName`,
		password: `${u}-password`,
		userGroup: null,
	}
}


export async function createUser(data?: IUser): Promise<IUserModel> {
	const user: IUserModel = new User({
		...await createUserDTO(),
		...(data || {}),
	})

	if ((data || {}).password) { await user.setPassword(data.password) }

	return await user.save()
}


export default {
	User,
}
