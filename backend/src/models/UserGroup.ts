import { Schema, Document, Model, model } from 'mongoose'

export interface IUserGroup {
	title: string,
	rights: string[],
}

export interface IUserGroupModel extends IUserGroup, Document {
	createdAt: Date,
	modifiedAt: Date,
	index: string,
}

const schema: Schema = new Schema({
	title: String,
	rights: [String],
	index: String,
	modifiedAt: { type: Date, default: Date.now },
	createdAt: { type: Date, default: Date.now },
})

schema.pre<IUserGroupModel>('save', function () {
	this.index = [this.title].join(' ')
})

schema.statics.sharedRights = [
	'UsersRead',
	'UsersWrite',
	'UsersDelete',
	'UserGroupsRead',
	'UserGroupsWrite',
	'UserGroupsDelete',
]

schema.statics.administratorsOnlyRights = [
]

const UserGroup: Model<IUserGroupModel> = model<IUserGroupModel>('UserGroup', schema)

export default UserGroup
