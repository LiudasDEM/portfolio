import React from 'react'
import ReactDOM from 'react-dom'

import 'bootstrap/dist/css/bootstrap.min.css'

import { BrowserRouter } from 'react-router-dom'


import { AuthProvider } from './contexts/Auth'
import { AlertsProvider } from './contexts/Alerts'


import App from './components/App'


const jsx = (
	<AlertsProvider>
		<AuthProvider>
			<BrowserRouter>
				<App />
			</BrowserRouter>
		</AuthProvider>
	</AlertsProvider>
)

ReactDOM.render(jsx, document.getElementById('app'))
