import React from 'react'
import PropTypes from 'prop-types'


const AuthStateContext = React.createContext()
const AuthDispatchContext = React.createContext()


import http from '../http'


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

	return state
}


function AuthProvider({ children }) {
	const [state, dispatch] = React.useReducer(authReducer, { user: null, isAuthenticated: false })

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
	return [useAuthState(), useAuthDispatch()]
}


function setUser(dispatch) {
	http.get('/api/session').then(res => {
		dispatch({ type: 'AUTHENTICATED', user: res.data })
	}, console.error)
}


function logout(dispatch) {
	http.delete('/api/session').then(() => {
		dispatch({ type: 'LOGGED_OUT' })
	}, console.error)
}


export { AuthProvider, useAuth, setUser, logout }
