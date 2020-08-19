import React from 'react'
import PropTypes from 'prop-types'


import { http } from '../shared'


const AuthStateContext = React.createContext()
const AuthDispatchContext = React.createContext()


import { useAlerts } from './Alerts'


function authReducer(state, action) {
	if (action.type === 'AUTHENTICATED') {
		return {
			...state,
			user: action.user,
			isAuthenticated: true,
		}
	}

	if (action.type === 'LOGGED_OUT') {
		return {
			...state,
			user: null,
			isAuthenticated: false,
		}
	}

	if (action.type === 'LOADED') {
		return {
			...state,
			isLoading: false,
		}
	}

	return state
}


function AuthProvider({ children }) {
	const [state, dispatch] = React.useReducer(authReducer, { user: null, isAuthenticated: false, isLoading: true })

	return (
		<AuthStateContext.Provider value={state}>
			<AuthDispatchContext.Provider value={dispatch}>
				{children}
			</AuthDispatchContext.Provider>
		</AuthStateContext.Provider>
	)
}


AuthProvider.propTypes = {
	children: PropTypes.node.isRequired,
}


function useAuthState() {
	const context = React.useContext(AuthStateContext)
	if (context === undefined) {
		throw new Error('useAuthState must be used within a AuthProvider')
	}
	return context
}


function useAuthDispatch() {
	const context = React.useContext(AuthDispatchContext)
	if (context === undefined) {
		throw new Error('useAuthDispatch must be used within a AuthProvider')
	}
	return context
}


function useAuth() {
	const { showAlert } = useAlerts()

	const dispatch = useAuthDispatch()
	const { user, isAuthenticated, isLoading } = useAuthState()

	async function setUser() {
		await http.get('/api/session').then(res => {
			if (res.data) {
				dispatch({ type: 'AUTHENTICATED', user: res.data })
			}
		}, showAlert)

		dispatch({ type: 'LOADED' })
	}

	function logout() {
		http.delete('/api/session').then(() => {
			dispatch({ type: 'LOGGED_OUT' })
			showAlert('Logged out succesfully')
		}, showAlert)
	}

	return { setUser, logout, user, isAuthenticated, isLoading }
}


export { AuthProvider, useAuth }
