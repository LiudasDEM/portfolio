export default {
	port: process.env.HTTP_PORT || 8080,
	mongoConnectionString: process.env.MONGO_CONNECTION_STRING || 'mongodb://localhost:27017/portfolio',
	mongoTestsConnectionString: process.env.MONGO_TESTS_CONNECTION_STRING || 'mongodb://localhost:17017/portfolio-testing',
	redis: {
		host: process.env.REDIS_HOST || 'localhost',
		port: process.env.REDIS_PORT ? Number(process.env.REDIS_PORT) : 6379,
		password: process.env.REDIS_PASSWORD || '',
		database: process.env.REDIS_DATABASE || 'portfolio',
	},
	cookieName: process.env.COOKIE_NAME || 'portfolio',
	privateKey: (process.env.PRIVATE_KEY || '').replace(/\\n/g, '\n'),
	publicKey: (process.env.PUBLIC_KEY || '').replace(/\\n/g, '\n'),
}
