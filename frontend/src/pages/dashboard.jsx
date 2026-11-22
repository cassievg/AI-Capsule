import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext";
import { getCpsls, addCpsl } from "../services/api/capsules";

import Alert from '@mui/material/Alert';

import CapsuleCard from "../components/CapsuleCard";

import "./dashboard.css";

const emptyCpsl = {
    project_name: '',
    prompt_title: '',
    prompt_text: '',
    response_summary: '',
    category: '',
    usefulness: 'Not Reviewed',
    reviewed: 0,
    improved: 0,
    screenshot_url: '',
    notes: ''
};

const Dashboard = () => {
    const { isAuthenticated, profile, loading } = useAuth();

    const [cpsls, setCpsls] = useState([]);
    const [newData, setNewData] = useState(emptyCpsl);
    const [addMod, setAddMod] = useState(false);

    const [loadingData, setLoadingData] = useState(false);
    const [alert, setAlert] = useState('');
    const [sev, setSev] = useState('');

    const init = async () => {
        setLoadingData(true);

        try {
            const capsules = await getCpsls(); 
            setCpsls(capsules);
        } catch (e) {
            setAlert(`Initialization error: ${e.message}`);
            setSev('error');
        } finally {
            setLoadingData(false);
        }
    };

    useEffect(() => {
        if (isAuthenticated && !loading) {
            init();
        };
    }, [isAuthenticated, loading]);

    if (loading) {
        return <div className="loading-user">Checking authentication...</div>
    };

    if (!isAuthenticated) {
        return <Navigate to='/login' replace />
    };

    const handleUpdate = (msg) => {
        setAlert(msg);
        setSev('success');
        init();
    };

    const updData = (event) => {
        const {
            target
        } = event;

        setNewData((prev) => ({
            ...prev,
            [target.id]: target.type === 'checkbox' ? 
                Number(target.checked) : target.value
        }));
    };

    const openAdd = () => {
        setNewData({...emptyCpsl});
        setAlert('');
        setAddMod(true);
    };

    const closeAdd = () => {
        setNewData({...emptyCpsl});
        setAddMod(false);
    };

    const create = async (event) => {
        event.preventDefault();

        const cpsl = {
            ...newData,
            project_name: newData.project_name.trim(),
            prompt_title: newData.prompt_title.trim(),
            prompt_text: newData.prompt_text.trim(),
            response_summary: newData.response_summary.trim(),
            category: newData.category.trim(),
            usefulness: newData.usefulness.trim(),
            reviewed: Number(newData.reviewed),
            improved: Number(newData.improved),
            screenshot_url: newData.screenshot_url,
            notes: newData.notes.trim() || '-'
        }

        setAlert('');

		try {
			await addCpsl(cpsl);

			handleUpdate(`Capsule '${cpsl.project_name}' created successfully!`);
            closeAdd();
		} catch (e) {
            setAlert(`Capsule creation failed: ${e.message}`);
            setSev('error');
		}
    };

    return (
        <>
            {alert && (
                <Alert severity={sev || 'info'} onClose={() => setAlert('')}>
                    {alert}
                </Alert>
            )}

            {loadingData && <div className='loading-data'>Loading...</div>}

            <div className="parent-container">
                <div className="title">AI Capsule Dashboard</div>

                <div className="user-intro">Welcome, {profile.username}</div>
                
                <div className="create-container">
                    <button className="create-btn" onClick={openAdd}>+</button>
                </div>
                
                <div className="empty-parent">
                    {!loadingData && cpsls.length === 0 ?
                        <>
                            <div className="empty">No capsules yet.</div>
                            <div className="empty-desc">Click the '+' to create one!</div>
                        </>
                        :
                        (cpsls.map((cpsl, index) => {
                            return (
                                <CapsuleCard
                                    key={cpsl.id}
                                    capsule={cpsl}
                                    onUpdated={handleUpdate}
                                />
                            );
                        }))
                    }
                </div>
            </div>

            {addMod &&
                <div className='modal-overlay'>
                    <div className='modal-container'>
                        <div className='modal-header'>
                            <div className='modal-header-text'>Create Capsule</div>
                            <div className='close-container'>
                                <button type='button' className='close-button' onClick={closeAdd}>X</button>
                            </div>
                        </div>
                        <div className='modal-content'>
                            <div className='create-form-container'>
                                <form className='create-form' onSubmit={create}>

                                    <div className='input-container'>
                                        <div className='label'>Project Name:</div>
                                        <input
                                            className='form-control'
                                            type='text'
                                            placeholder='...'
                                            aria-label='project_name'
                                            id='project_name'
                                            value={newData.project_name}
                                            onChange={updData}
                                            required
                                        />
                                    </div>

                                    <div className='input-container'>
                                        <div className='label'>Prompt Title:</div>
                                        <input
                                            className='form-control'
                                            type='text'
                                            placeholder='...'
                                            aria-label='prompt_title'
                                            id='prompt_title'
                                            value={newData.prompt_title}
                                            onChange={updData}
                                            required
                                        />
                                    </div>

                                    <div className='input-container'>
                                        <div className='label'>Prompt Text:</div>
                                        <textarea
                                            className='form-control'
                                            type='text'
                                            placeholder='...'
                                            aria-label='prompt_text'
                                            id='prompt_text'
                                            value={newData.prompt_text}
                                            onChange={updData}
                                            required
                                        />
                                    </div>       

                                    <div className='input-container'>
                                        <div className='label'>Response Summary:</div>
                                        <textarea
                                            className='form-control'
                                            type='text'
                                            placeholder='...'
                                            aria-label='response_summary'
                                            id='response_summary'
                                            value={newData.response_summary}
                                            onChange={updData}
                                            required
                                        />
                                    </div>   

                                    <div className='input-container'>
                                        <div className='label'>Category:</div>
                                        <input
                                            className='form-control'
                                            type='text'
                                            placeholder='...'
                                            aria-label='category'
                                            id='category'
                                            value={newData.category}
                                            onChange={updData}
                                            required
                                        />
                                    </div>   

                                    <div className='input-container'>
                                        <div className='label'>Usefulness:</div>
                                        <select
                                            className='form-control'
                                            id='usefulness'
                                            value={newData.usefulness}
                                            onChange={updData}
                                        >
                                            <option value="Good">Good</option>
                                            <option value="Needs Improvement">Needs Improvement</option>
                                            <option value="Not Reviewed">Not Reviewed</option>
                                        </select>
                                    </div>           

                                    <div className='input-container'>
                                        <div className='label'>Reviewed:</div>
                                        <input
                                            type="checkbox"
                                            id="reviewed"
                                            checked={Boolean(newData.reviewed)}
                                            onChange={updData}
                                        />
                                    </div>            

                                    <div className='input-container'>
                                        <div className='label'>Improved:</div>
                                        <input
                                            type="checkbox"
                                            id="improved"
                                            checked={Boolean(newData.improved)}
                                            onChange={updData}
                                        />
                                    </div>         

                                    <div className='input-container'>
                                        <div className='label'>Screenshot:</div>
                                        <input
                                            className='form-control'
                                            type='text'
                                            placeholder='...'
                                            aria-label='screenshot_url'
                                            id='screenshot_url'
                                            value={newData.screenshot_url}
                                            onChange={updData}
                                            required
                                        />
                                    </div>    

                                    <div className='input-container'>
                                        <div className='label'>Notes:</div>
                                        <textarea
                                            className='form-control'
                                            type='text'
                                            placeholder='...'
                                            aria-label='notes'
                                            id='notes'
                                            value={newData.notes}
                                            onChange={updData}
                                        />
                                    </div>    

                                    <div className='submit-container'>
                                        <button type='submit' className='submit-button'>Create</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            }
        </>
    );
};

export default Dashboard;