import React from "react";
import { Navigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext";

import { login } from "../services/api/auth";

import "./login.css";

const Login = () => {
    const { isAuthenticated, loading } = useAuth();

    const handleLogin = async () => {
        await login();
    };

    if (loading) {
        return <div className='loading-user'>Checking authentication...</div>
    };

    if (isAuthenticated) {
        return <Navigate to='/dashboard' replace />
    };

    return (
        <div className="login-page">
            <div className="container">
                <div className="title">Welcome to AI Capsule!</div>
                <div className="sub-title">Your all-in-one hub for AI-assisted projects</div>
                <div className="text">To proceed, please login. Your GitHub profile will be used automatically as your personal profile.</div>
                <button className="login" onClick={handleLogin}>Login</button>
            </div>
        </div>
    )
};

export default Login;
