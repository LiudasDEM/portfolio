import { Schema, Document, Model, model } from 'mongoose'

import crypto from 'crypto'
import { promisify } from 'util'

const SALT_BYTES = 32
const KEY_BYTES = 128
const PBKDF2_ROUNDS = 4096

export interface IUser {
	email: string;
	firstName: string;
	lastName: string;
	userGroup: any;
	password: string;
	secret?: string;
	hash?: string;
}

export interface IUserModel extends IUser, Document {
	createdAt: Date;
	modifiedAt: Date;
	index: string;
	hash: string;
	isPassword(password: string): Promise<boolean>;
	setPassword(password: string): Promise<void>;
}

const schema: Schema<IUserModel> = new Schema<IUserModel>({
	email: { type: String, unique: true },
	firstName: String,
	lastName: String,
	index: String,
	secret: String,
	userGroup: Schema.Types.ObjectId,
	hash: String,
	createdAt: { type: Date, default: Date.now },
	modifiedAt: { type: Date, default: Date.now },
})

schema.pre<IUserModel>('save', function () {
	this.index = [this.email, this.firstName, this.lastName].join(' ')
	const salt = crypto.randomBytes(16).toString('hex')
	this.hash = crypto
		.createHash('sha512')
		.update(Buffer.from(this.index + salt))
		.digest('hex') + salt
})

schema.methods.setPassword = async function (password: string): Promise<void> {
	const salt = await promisify(crypto.randomBytes)(SALT_BYTES)
	const key = await promisify(crypto.pbkdf2)(password, salt, PBKDF2_ROUNDS, KEY_BYTES, 'sha512')
	this.secret = Buffer.concat([salt, key]).toString('base64')
}

schema.methods.isPassword = async function (password: string): Promise<boolean> {
	const secret = Buffer.from(this.secret || '', 'base64')

	const salt = secret.slice(0, SALT_BYTES)
	const dbKey = secret.slice(SALT_BYTES)
	const key = await promisify(crypto.pbkdf2)(password, salt, PBKDF2_ROUNDS, KEY_BYTES, 'sha512')

	return key.equals(dbKey)
}

const User: Model<IUserModel> = model<IUserModel>('User', schema)

export default User
