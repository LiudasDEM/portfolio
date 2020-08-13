import { createClient, IClient } from 'async-redis'

import config from '../config'

const client = createClient(config.redis.port, config.redis.host)

if (config.redis.password) {
	client.auth(config.redis.password)
}

client.on('error', (error: Error) => console.error(error.message))

class RedisPrefixWrapper implements IClient {
	private client: IClient

	constructor(redisClient: IClient) {
		this.client = redisClient
	}

	public async set(key: string, value: any, type?: string, ttl?: number) {
		if (type) {
			return this.client.set(this.addPrefix(key), value, type, ttl)
		}
		return this.client.set(this.addPrefix(key), value)
	}

	public async get(key: string) {
		return this.client.get(this.addPrefix(key))
	}

	public async del(key: string) {
		return this.client.del(this.addPrefix(key))
	}

	public async keys(pattern: string) {
		return this.client.keys(this.addPrefix(pattern))
	}

	private addPrefix(key: string) {
		return config.redis.database + key
	}
}


export default new RedisPrefixWrapper(client)
