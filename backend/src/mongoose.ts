import mongoose from 'mongoose'
import config from '../config'


mongoose
	.connect(config.mongoConnectionString, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
		useCreateIndex: true,
		useFindAndModify: false,
	})
	.then(() => { console.info('mongo connected') })
	.catch(() => { console.error('mongo failed to connect') })


export default mongoose
