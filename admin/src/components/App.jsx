import React from 'react'


import { AuthProvider } from '../contexts/Auth'
import { AlertsProvider } from '../contexts/Alerts'


import Layout from './Layout'


function App() {
	return <>
		<AlertsProvider>
			<AuthProvider>
				<Layout />
			</AuthProvider>
		</AlertsProvider>
	</>
}


export default App
