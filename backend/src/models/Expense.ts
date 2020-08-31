import { Schema, Document, Model, model } from 'mongoose'

export interface IExpense {
	amount: number;
	month: number;
	day: number;
	year: number;
	type: string;
	user: any;
}

export interface IExpenseModel extends IExpense, Document {
	createdAt: Date;
	modifiedAt: Date;
	index: string;
}

const schema: Schema<IExpenseModel> = new Schema<IExpenseModel>({
	amount: Number,
	month: Number,
	day: Number,
	year: Number,
	type: String,
	user: Schema.Types.ObjectId,
	createdAt: { type: Date, default: Date.now },
	modifiedAt: { type: Date, default: Date.now },
})

schema.pre<IExpenseModel>('save', function () {
	this.index = [this.type, this.amount].join(' ')
})

const Expense: Model<IExpenseModel> = model<IExpenseModel>('Expense', schema)

export default Expense
