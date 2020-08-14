import React from 'react'


import { AuthProvider } from '../contexts/Auth'


import Layout from './Layout'


function App() {
	return <AuthProvider>
		<Layout />
	</AuthProvider>
}


export default App
