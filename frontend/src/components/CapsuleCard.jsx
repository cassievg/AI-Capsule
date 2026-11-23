import React, { useState } from "react";

import Alert from '@mui/material/Alert';

import "./CapsuleCard.css";
import { delCpsl, editCpsl } from "../services/api/capsules";

const CapsuleCard = (props) => {
    const {
        capsule,
        onUpdated
    } = props;

    const [editMod, setEditMod] = useState(false);
    const [editItem, setEditItem] = useState(null);

    const [del, setDel] = useState(false);

    const [viewMod, setViewMod] = useState(false);

    const [errMsg, setErrMsg] = useState('');

    const openEdit = () => {
        setEditItem({...capsule, notes: capsule.notes ?? ''});
        setErrMsg('');
        setEditMod(true);
    };

    const closeEdit = () => {
        setEditItem(null);
        setErrMsg('');
        setEditMod(false);
    };

    const updCpslData = (event) => {
        const {
            target
        } = event

        setEditItem((prev) => ({
            ...prev,
            [target.id]: target.type === 'checkbox' ?
                Number(target.checked) : target.value
        }));
    };

    const saveCpsl = async () => {
        const cpsl = {
            ...editItem,
            project_name: editItem.project_name.trim(),
            prompt_title: editItem.prompt_title.trim(),
            prompt_text: editItem.prompt_text.trim(),
            response_summary: editItem.response_summary.trim(),
            category: editItem.category.trim(),
            usefulness: editItem.usefulness.trim(),
            reviewed: Number(editItem.reviewed),
            improved: Number(editItem.improved),
            screenshot_url: editItem.screenshot_url,
            notes: editItem.notes.trim() || '-'
        };

        try {
            await editCpsl(cpsl);
            closeEdit();
            onUpdated(`Capsule "${capsule.project_name}" has been updated successfully!`);
        } catch (e) {
            setErrMsg(`Failed to update capsule: ${e.message}`);
        };
    };

    const openDel = () => {
        setErrMsg('');
        setDel(true);
    };

    const closeDel = () => {
        setErrMsg('');
        setDel(false);
    };

    const reqDel = async () => {
		try {
			await delCpsl(capsule.id);

			setDel(false);
            onUpdated(`Capsule "${capsule.project_name}" has been deleted successfully!`);
		}  catch (e) {
			setErrMsg(`Failed to delete capsule: ${e.message}`);
		}
    };

    const openView = async () => {
        setViewMod(true);
    };

    const closeView = async () => {
        setViewMod(false);
    };

    return (
        <>
            <div
                className="card-container"
                onClick={openView}
            >
                <div className="card-header">
                    <div className="capsule-info">{capsule.created_at} - v{capsule.prompt_version}</div>
                    <div className="category">{capsule.category}</div>
                </div>
                <div className="card-body">
                    <div className="prompt-text">{capsule.project_name}</div>
                </div>

                <div className="card-status">
                    <div className={`useful ${
                        capsule.usefulness === 'Good' ? 'good' :
                        capsule.usefulness === 'Needs Improvement' ? 'needs-improvement' :
                        'not-reviewed'
                    }`}>
                        {capsule.usefulness}
                    </div>

                    <div className="reviewed">
                        Reviewed: {capsule.reviewed ? 'Yes' : 'No'}
                    </div>

                    <div className="improved">
                        Improved: {capsule.improved ? 'Yes' : 'No'}
                    </div>
                </div>

                <div className="card-footer">
                    <button className="edit" onClick={openEdit}>
                        Edit
                    </button>

                    <button className="delete" onClick={openDel}>
                        Delete
                    </button>
                </div>
            </div>

            {editMod &&
                <div className='modal-overlay'>
                    <div className='modal-container'>
                        <div className='modal-header'>
                            <div className='modal-header-text'>Capsule Edit</div>
                            <div className='close-container'>
                                <button type='button' className='close-button' onClick={closeEdit}>X</button>
                            </div>
                        </div>
                        <div className='modal-content'>
                            {errMsg &&
                                <Alert severity='error'>{errMsg}</Alert>
                            }
                            <div className='edit-form-container'>
                                <div className='edit-form'>

                                    <div className='input-container'>
                                        <div className='label'>Project Name:</div>
                                        <input
                                            className='form-control'
                                            type='text'
                                            placeholder='...'
                                            aria-label='project_name'
                                            id='project_name'
                                            value={editItem.project_name}
                                            onChange={updCpslData}
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
                                            value={editItem.prompt_title}
                                            onChange={updCpslData}
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
                                            value={editItem.prompt_text}
                                            onChange={updCpslData}
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
                                            value={editItem.response_summary}
                                            onChange={updCpslData}
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
                                            value={editItem.category}
                                            onChange={updCpslData}
                                        />
                                    </div>   

                                    <div className='input-container'>
                                        <div className='label'>Usefulness:</div>
                                        <select
                                            className='form-control'
                                            id='usefulness'
                                            value={editItem.usefulness}
                                            onChange={updCpslData}
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
                                            checked={Boolean(editItem.reviewed)}
                                            onChange={updCpslData}
                                        />
                                    </div>            

                                    <div className='input-container'>
                                        <div className='label'>Improved:</div>
                                        <input
                                            type="checkbox"
                                            id="improved"
                                            checked={Boolean(editItem.improved)}
                                            onChange={updCpslData}
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
                                            value={editItem.screenshot_url}
                                            onChange={updCpslData}
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
                                            value={editItem.notes}
                                            onChange={updCpslData}
                                        />
                                    </div>    

                                    <div className='submit-container'>
                                        <button className='submit-button' onClick={saveCpsl}>Save</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            }

            {del &&
                    <div className='modal-overlay'>
                        <div className='modal-container'>
                            <div className='modal-header'>
                                <div className='modal-header-text'>Confirm Deletion</div>
                                <div className='close-container'>
                                    <button type='button' className='close-button' onClick={closeDel}>X</button>
                                </div>
                            </div>
                            <div className='modal-content'>
                                {errMsg &&
                                    <Alert severity='error'>{errMsg}</Alert>
                                }
                                <div className='delete-message'>
                                    Are you sure you want to delete this capsule?
                                </div>

                                <div className='delete-buttons'>
                                    <button className='view-button' onClick={closeDel}>
                                        Cancel
                                    </button>
                                    <button className='view-button' id='delete-btn' onClick={reqDel}>
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                }
                {viewMod &&
                    <div className='modal-overlay'>
                        <div className='modal-container'>
                            <div className='modal-header'>
                                <div className='modal-header-text'>Capsule #{capsule.id}</div>
                                <div className='close-container'>
                                    <button type='button' className='close-button' onClick={closeEdit}>X</button>
                                </div>
                            </div>
                            <div className='modal-content'>
                                {errMsg &&
                                    <Alert severity='error'>{errMsg}</Alert>
                                }
                                <div className='edit-form-container'>
                                    <div className='edit-form'>

                                        <div className='data-container'>
                                            <div className='label'>Project Name:</div>
                                            <div className='data'>{capsule.project_name}</div>
                                        </div>

                                        <div className='data-container'>
                                            <div className='label'>Prompt Title:</div>
                                            <div className='data'>{capsule.prompt_title}</div>
                                        </div>

                                        <div className='data-container'>
                                            <div className='label'>Prompt Text:</div>
                                            <div className='data'>{capsule.prompt_text}</div>
                                        </div>       

                                        <div className='data-container'>
                                            <div className='label'>Response Summary:</div>
                                            <div className='data'>{capsule.response_summary}</div>
                                        </div>   

                                        <div className='data-container'>
                                            <div className='label'>Category:</div>
                                            <div className='data'>{capsule.category}</div>
                                        </div>   

                                        <div className='data-container'>
                                            <div className='label'>Usefulness:</div>
                                            <div className='data'>{capsule.usefulness}</div>
                                        </div>           

                                        <div className='data-container'>
                                            <div className='label'>Reviewed:</div>
                                            <div className='data'>{capsule.reviewed ? 'Yes' : 'No'}</div>
                                        </div>            

                                        <div className='data-container'>
                                            <div className='label'>Improved:</div>
                                            <div className='data'>{capsule.improved ? 'Yes' : 'No'}</div>
                                        </div>         

                                        <div className='data-container'>
                                            <div className='label'>Screenshot:</div>
                                            <div className='data'>{capsule.screenshot_url}</div>
                                        </div>    

                                        <div className='data-container'>
                                            <div className='label'>Notes:</div>
                                            <div className='data'>{capsule.notes}</div>
                                        </div>    
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                }
        </>
    );
};

export default CapsuleCard;