import React, { useEffect, useState } from "react";

import { getUser } from "../services/api/auth";

import "./dashboard.css";

const emptyCpsl = {
    project_name: '',
    prompt_title: '',
    prompt_text: '',
    response_summary: '',
    category: '',
    usefulness: '',
    reviewed: '',
    improved: '',
    screenshot_url: '',
    notes: ''
};

const Dashboard = () => {
    const [user, setUser] = useState(null);

    const [loading, setLoading] = useState(false);

    const init = async () => {
        setLoading(true);
    };

    useEffect(() => {
        setUser(getUser());


    });

    return (
        <div className="parent-container">
            <div className="title">AI Capsule Dashboard</div>

            <div className="user-intro">Welcome, {user.username}</div>
        </div>
    );
};