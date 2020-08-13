

declare namespace Express {
	export interface Request { // tslint:disable-line
		user: any,
		cookieToken: string,
	}
}


declare module 'async-redis' {
	export interface IClient {
		auth?(password: string): void,
		on?(type: string, cb: CallableFunction): void,
		get(key: string): Promise<any>,
		del(key: string): Promise<boolean>,
		set(key: string, value: any, type?: string, ttl?: number): Promise<boolean>,
		keys(pattern: string): Promise<[string]>,
	}

	export function createClient(port: string | number, host: string): IClient
}
