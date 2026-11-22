import React, { createContext, useContext, useState, useEffect } from 'react';

import { getUser } from '../services/api/auth';

const AuthContext = createContext();
const useAuth = () => useContext(AuthContext);

function AuthProvider(props) {
	const [isAuthenticated, setIsAuthenticated] = useState(false);
	const [profile, setProfile] = useState({});
    const [loading, setLoading] = useState(true);

	useEffect(() => {
		const auth = async () => {
			try {
				const userData = await getUser();

				setIsAuthenticated(true);
				setProfile(userData);
			} catch (e) {
                if (e.response?.status === 401) {
                    setIsAuthenticated(false);
                    setProfile(null);
                } else {
                    console.error('Authentication failed:', e);
                }
			} finally {
                setLoading(false)
            }
		}

		auth();
	}, []);

	return (
		<AuthContext.Provider
			value={{
				isAuthenticated,
				setIsAuthenticated,
				profile,
				setProfile,
                loading
			}}
		>
			{props.children}
		</AuthContext.Provider>
	)
}

export {
	AuthProvider,
	useAuth
};
