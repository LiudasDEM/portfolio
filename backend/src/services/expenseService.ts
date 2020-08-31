import Expense, { IExpense, IExpenseModel } from '../models/Expense'


import { constructModelGetters, constructModelDeleter, constructModelPutter, constructModelPoster } from 'apiService'


export const schema = {
	type: 'object',
	properties: {
		amount: { type: 'number', required: true },
		month: { type: 'number', required: true },
		year: { type: 'number', required: true },
		day: { type: 'number', required: true },
		user: { type: 'string,null' },
	},
}


export async function update(expense: IExpenseModel, dto: IExpense): Promise<void> {
	expense.amount = dto.amount
	expense.month = dto.month
	expense.type = dto.type
	expense.year = dto.year
	expense.day = dto.day
	expense.user = (dto.user && dto.user._id) ? dto.user._id : dto.user
	expense.modifiedAt = new Date()
}


export const [get, getOne] = constructModelGetters<IExpenseModel>({
	Model: Expense,
	availableSelectOptions: '_id amount type month year day user createdAt',
	availableSortOptions: 'amount month type year day createdAt',
})


export const DELETE = constructModelDeleter({
	getOne,
	soft: false,
})


export const put = constructModelPutter<IExpenseModel, IExpense>({
	update,
	getOne,
	schema,
})


export const post = constructModelPoster<IExpenseModel, IExpense>({
	Model: Expense,
	schema, update,
})


export default {
	delete: DELETE,
	get, getOne,
	put,
	post,
	update,
	schema,
}
