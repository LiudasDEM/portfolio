import { useCallback } from 'react'


export function useForm({ setData, rules, data }) {
	const validateField = useCallback(function validateField(key, value) {
		const rule = rules[key]

		const errors = []

		if (!rule) {
			return errors
		}

		if (rule.required && value == null) {
			errors.push(`${key} is required`)
			return errors
		}

		if (rule.type && typeof value !== rule.type) {
			errors.push(`${key} is not of type ${rule.type}`)
		}

		if (rule.maxLength) {
			if (typeof value === 'string') {
				if (value) {
					if (value.length > rule.maxLength) {
						errors.push(`${key} exceeds max length of ${rule.maxLength}`)
					}
				}
			} else {
				console.warn(`${key} cannot test maxLength rule on non string type`)
			}
		}

		if (rule.minLength) {
			if (typeof value === 'string') {
				if (value) {
					if (value.length < rule.minLength) {
						errors.push(`${key} does not meet min length of ${rule.minLength}`)
					}
				}
			} else {
				console.warn(`${key} cannot test minLength rule on non string type`)
			}
		}

		if (rule.maxValue) {
			if (typeof value === 'number') {
				if (value > rule.maxValue) {
					errors.push(`${key} does not meet min value of ${rule.maxValue}`)
				}
			} else {
				console.warn(`${key} cannot test maxValue rule on non number type`)
			}
		}

		if (rule.minValue && typeof value === 'number') {
			if (typeof value === 'number') {
				if (value < rule.minValue) {
					errors.push(`${key} does not meet min value of ${rule.minValue}`)
				}
			} else {
				console.warn(`${key} cannot test minValue rule on non number type`)
			}
		}

		if (value && rule.pattern && !rule.pattern.test(value)) {
			errors.push(`${key} does not match pattern ${rule.pattern}`)
		}

		return errors.filter(x => x)
	}, [rules])


	const validateForm = useCallback(function validateForm() {
		const errors = new Map()

		for (const [key, value] of Object.entries(data)) {
			const result = validateField(key, value)
			if (result.length) {
				errors.set(key, result)
			}
		}

		return errors
	}, [data, validateField])


	const updateForm = useCallback(function updateForm(event) {
		if (event && event.persist) {
			event.persist()
		}

		setData(data => ({
			...data,
			[event.target.name]: event.target.value,
		}))
	}, []) //eslint-disable-line react-hooks/exhaustive-deps


	return { updateForm, validateForm }
}


export default useForm
