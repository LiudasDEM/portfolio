import { useCallback } from 'react'


export function useForm({ setData }) {
	const updateForm = useCallback(function updateForm(event) {
		if (event.persist) {
			event.persist()
		}

		setData(data => ({
			...data,
			[event.target.name]: event.target.value,
		}))
	}, []) //eslint-disable-line react-hooks/exhaustive-deps

	return { updateForm }
}


export default useForm
