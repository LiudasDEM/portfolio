import 'mocha'

import jwt from 'jsonwebtoken'
import crypto from 'crypto'
import cookie from 'cookie'

import config from '../config'

import User from '../src/models/User'
import UserGroup from '../src/models/UserGroup'


const _warn = console.warn
const _info = console.info
const _error = console.error
const _debug = console.debug


config.mongoConnectionString = config.mongoTestsConnectionString
config.cookieName = 'test'
config.privateKey = '-----BEGIN RSA PRIVATE KEY-----\nMIIEowIBAAKCAQEAoIlp9vYoCbzmz82F0KNve5m3wIwH2v2osGd1FHs6gxtxWSMB\n+xOqN9qjtffaVQclnuRqs19qaFkN/Dk2grlle7aOd7jwQlsLDAqRzdoITHPVvgbZ\nscfJViGzuSf+qHJKhEYw/+C/fMtMjbPgF2VyWIMWISpj+856CiTddcPpNMA9ZBa5\nVqk0xqt1WiPq/lxGwkFhUKnQojBkHfek2B/sfIWarMmzNKigNPzSx6RC5YrqH//J\nVGycYSPiqzZN2elKF+Gywe9D937+MyAKYqWwpp+JWxiqmvIzmanOe3sdcd94e0uK\n8v7g2sT7ee9lVmHKQIGakvqN/Ef/nujliOSUswIDAQABAoIBAAaeY74I3BG6thFv\nOcsmUdxYtBi+LTy8JI5RVaRoiDsLkJrKNLSzVNtEqmdANsI2rzhj1npavrpaoZb6\njOLK3gJBvpH1EALMWiI+9U/1Y04zoGZbRfJseEKS1SQXIAq125ikhDSogXyVrSxS\ndDTCu/omPW1UoBarpqBwcKkAUMcZ7TGytMe95DcM2GqhhCOFd68wjqw9wXJzY21A\nKN5duN5HYOIyMcK1XW+YE0kvOglQGBJfMA99ResRMdzGumJQ7FyL1c1hvR+MYpug\ngMGc4zAV9RFdgaKm6CSt6ynJGPY0eOTZuAaYRif10PLfGCxo6kyQECNnNt1wxMdf\nvVFk/uECgYEA1LP9c/s2Aw7hfudT5V/RhMX/sTphi5Wp96A5pmj7h13PYUvxMtVt\nblUJxS5yQOKqtVEXh/V1YIACHnARA22W6iy98AxFpvlhBiH5j94QEgie/AwVuQQf\nQDA3RAw6J1H7Pien7Uu0ijNfp5jMvXQbXOlU0+P/mSSYUXINU2JNwSkCgYEAwTcG\nRtSo0uJS0xBI19qlvZCakkL2D5fo+EYSTijJIjrsHlJXpyG65Zv4FgGOLGfceYx3\nd+E1QMYedQb67Lds1sdOvdtqFiTRx458qO6K7q3PjfD4bU+GUmKetOiAjxvGwL0g\nZ/+QYN02oI60FaUoCqqEEHIGrelX7RJ4NoUdVnsCgYBOC6kRGHkOEDS/asQG4uyu\n6jPS5NgL7qOJ/9mHbPf2CH7idYoQG+3mUP+fwVYc5s66bwHSWkdyXCXq4zXq6xg3\n3qjm3qnkBZcLOAYpOtLsuwsS8qA53gBVfhuZNV9VNCia+tQMJv4cw5LynQdq8KJl\nqhv9D6immZ3mLJIlKWncWQKBgGTvFbxSw47G5HWWADei5QpOTDE0Ac7LkMyB7nYe\nIFRda5O7eEa6/COOgt8cGOVhrG9izdY2M9eOp8KCzvpyJ81beOr9gEHpIh2Zdc3a\nL4HYEqEXzO9tp8HJ+xaOjvozjHSLWC579zRi23Ksma7lBDHuOedNaefYCjKyf1Ib\n3+OZAoGBALbS8RfjNOdpGRqvJzc/I/CPUe5ZY0jHk/5zJ7K+JqpyTO5TdrIO1ED+\nsR62I5dLPlq8xx0kxH8v5+DUsKftQjXL2RCKernxUUH2b90T9TNZ6vVGIqbPeCc3\nLytvPH0DyVp3/et/zjW26l6YAPAuzp7animPy1Q7jNj31v+lY/kk\n-----END RSA PRIVATE KEY-----'.replace(/\\n/g, '\n')
config.publicKey = '-----BEGIN PUBLIC KEY-----\nMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAoIlp9vYoCbzmz82F0KNv\ne5m3wIwH2v2osGd1FHs6gxtxWSMB+xOqN9qjtffaVQclnuRqs19qaFkN/Dk2grll\ne7aOd7jwQlsLDAqRzdoITHPVvgbZscfJViGzuSf+qHJKhEYw/+C/fMtMjbPgF2Vy\nWIMWISpj+856CiTddcPpNMA9ZBa5Vqk0xqt1WiPq/lxGwkFhUKnQojBkHfek2B/s\nfIWarMmzNKigNPzSx6RC5YrqH//JVGycYSPiqzZN2elKF+Gywe9D937+MyAKYqWw\npp+JWxiqmvIzmanOe3sdcd94e0uK8v7g2sT7ee9lVmHKQIGakvqN/Ef/nujliOSU\nswIDAQAB\n-----END PUBLIC KEY-----'
config.redis = {
	port: 16379,
	host: 'localhost',
	password: '',
	database: 'testing',
}

import mongoose from '../src/mongoose'
import redis from '../src/redis'

export async function createSession(payload = {}): Promise<string> {
	const token = crypto.randomBytes(16).toString('hex')
	const jwtToken = jwt.sign(payload, config.privateKey, { algorithm: 'RS256' })

	await redis.set(config.cookieName + token, jwtToken)
	return cookie.serialize('test', token)
}


export async function clearTestingData({ keepSession } = { keepSession: false }): Promise<void> {
	// @ts-ignore
	if (!mongoose.connection.name.includes('testing')) {
		// @ts-ignore
		throw new Error(`Will not delete data from non testing DB '${mongoose.connection.name}'. Configure mongoTestsConnectionString`)
	}

	await Promise.all([
		User.deleteMany({}),
		UserGroup.deleteMany({}),
	]).then((async function () {
		if (!config.redis.database.includes('testing')) {
			throw new Error('Will not delete data from non testing DB. Configure Redis database for tests')
		}

		if (keepSession) {
			return
		}

		const keys = await redis.keys('*')
		await Promise.all(keys.map(function (key: string) { return redis.del(key) }))
	}))
}


// @ts-ignore
export function verifyJWT(token: string): any { return jwt.verify(token, config.publicKey, { algorithm: 'RSA256' }) }
export function getRedisClient(): any { return redis }
export function getConfig(): typeof config { return config }
export function parseCookie(cookieValue: string, cookieName: string): string { return cookie.parse(cookieValue)[cookieName] }


before(() => {
	console.warn = () => { }	// tslint:disable-line:no-empty
	console.error = () => { } // tslint:disable-line:no-empty
	console.info = () => { } // tslint:disable-line:no-empty
	console.debug = () => { } // tslint:disable-line:no-empty
})


after(() => {
	console.warn = _warn
	console.error = _error
	console.info = _info
	console.debug = _debug
})


after(async () => {
	await mongoose.connection.close()
	mongoose.models = {}
	mongoose.connection.removeAllListeners()
	// @ts-ignore
	mongoose.modelSchemas = {}
})


export default {
	config,
	getConfig,
	parseCookie,
	verifyJWT,
	getRedisClient,
	clearTestingData,
}
