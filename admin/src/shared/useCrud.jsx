import { useCallback, useEffect } from 'react'
import { useHistory } from 'react-router-dom'

import http from 'z-fetch'

import { useAlerts } from '../contexts/Alerts'


export default function useCrud({
	data, endpoint,
	setData, createModel,
	makeDTO, id,
	path, ...rest
}) {
	const history = useHistory()
	const { showAlert } = useAlerts()


	const load = useCallback(() => {
		http.get(`${endpoint}/${id}`).then((res) => {
			setData({ ...createModel(), ...res.data })
		}, showAlert)
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [id])


	useEffect(() => {
		if (id === 'new') {
			return
		}
		load()
	}, [id, load])


	const save = useCallback((event) => {
		if (event) {
			event.preventDefault()
		}

		const dto = makeDTO(data)

		const promise = !dto._id
			? http.post(endpoint, dto).then(res => {
				const id = res.headers.get('location').split('/').pop()
				history.replace(`${path}/${id}`)
			})
			: http.put(`${endpoint}/${dto._id}`, dto).then(() => {
				load()
			})

		promise.then(() => {
			showAlert(rest.successMessage || 'saved')
		}, showAlert)
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [data])


	return { save, load }
}
