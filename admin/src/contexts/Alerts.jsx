import React from 'react'
import PropTypes from 'prop-types'


const AlertsStateContext = React.createContext()
const AlertsDispatchContext = React.createContext()


function alertsReducer(state, action) {
	if (action.type === 'ALERT_ADDED') {
		return {
			...state,
			alerts: [...state.alerts, action.alert],
		}
	}

	if (action.type === 'ALERT_REMOVED') {
		return {
			...state,
			alerts: state.alerts.filter(x => x !== action.alert),
		}
	}

	return state
}


function AlertsProvider({ children }) {
	const [state, dispatch] = React.useReducer(alertsReducer, { alerts: [] })

	return (
		<AlertsStateContext.Provider value={state}>
			<AlertsDispatchContext.Provider value={dispatch}>
				{children}
			</AlertsDispatchContext.Provider>
		</AlertsStateContext.Provider>
	)
}


AlertsProvider.propTypes = {
	children: PropTypes.node.isRequired,
}


function useAlertsState() {
	const context = React.useContext(AlertsStateContext)
	if (context === undefined) {
		throw new Error('useAlertsState must be used within a AlertsProvider')
	}
	return context
}


function useAlertsDispatch() {
	const context = React.useContext(AlertsDispatchContext)
	if (context === undefined) {
		throw new Error('useAlertsDispatch must be used within a AlertsProvider')
	}
	return context
}


function useAlerts() {
	const dispatch = useAlertsDispatch()
	const { alerts } = useAlertsState()


	function removeAlert(alert) {
		clearTimeout(alert.timeout)
		dispatch({ type: 'ALERT_REMOVED', alert })
	}


	function showAlert(value) {
		let alert = {}

		if (value instanceof TypeError) {
			console.error(value)
			alert = {
				text: 'Something went wrong',
				variant: 'danger',
			}
		}
		else if (value instanceof Error) {
			alert = {
				text: value.message,
				variant: 'danger',
			}
		}
		else if (value.status) {
			alert = {
				text: value.data && value.data.extra
					? value.data.extra
					: value.statusText,
				variant: 'danger',
			}
		}
		else if (value.text) {
			alert = {
				...value,
			}
		}
		else {
			alert = {
				text: value,
				variant: 'success',
			}
		}

		alert.timeout = setTimeout(() => removeAlert(alert), 5000)

		dispatch({ type: 'ALERT_ADDED', alert })
	}

	return { showAlert, removeAlert, alerts }
}


export { AlertsProvider, useAlerts }
