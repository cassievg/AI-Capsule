import { Routes, Route, Navigate, BrowserRouter } from 'react-router-dom';

import { AuthProvider } from './context/AuthContext'

import Dashboard from './pages/dashboard'
import Login from './pages/login';

import './App.css'

function App() {
	return (
		<BrowserRouter>
			<AuthProvider>
				<Routes>
					<Route path="/" element={<Navigate to="/dashboard" replace />} />
					<Route path="/login" element={<Login />} />
					<Route path="/dashboard" element={<Dashboard />} />
					<Route path="*" element={<Navigate to="/dashboard" replace />} />
				</Routes>
			</AuthProvider>
		</BrowserRouter>
	)
}

export default App
