import React, { useEffect } from 'react'


import { useAuth, setUser, logout } from '../contexts/Auth'


import Login from './Login'


function Layout() {
	const [state, dispatch] = useAuth()

	useEffect(() => {
		setUser(dispatch)
	}, [dispatch])

	return <>
		{!state.isAuthenticated
			? <Login />
			: <div><button onClick={() => logout(dispatch)}>logout</button></div>
		}
	</>
}


export default Layout
