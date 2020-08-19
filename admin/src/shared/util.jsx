export function getSearch() {
	return window.location.search
		.substr(1)
		.split('&')
		.map(x => x.split('='))
		.filter(([k, v]) => k && v)
		.reduce((acc, [k, v]) => ({ ...acc, [k]: decodeURIComponent(v) }), {})
}


export function buildSearch(params) {
	const q = Object.entries(params)
		.filter(([, v]) => v != null)
		.map(([k, v]) => `${k}=${encodeURIComponent(v)}`)
		.join('&')

	return q ? `?${q}` : q
}
