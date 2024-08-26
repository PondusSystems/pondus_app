import { useState } from 'react';
import './ChangePasswordForm.css';
import { useDispatch } from 'react-redux';
import { ShowLoading, HideLoading } from '../../redux/loaderSlice';
import { message } from 'antd';
import { TbEye } from "react-icons/tb";
import { TbEyeOff } from "react-icons/tb";
import { isValidPassword } from '../../utils/validationUtils';
import userService from '../../services/userService';

const ChangePasswordForm = () => {
    const [formData, setFormData] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
    });
    const [error, setError] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
    });
    const [showPassword, setShowPassword] = useState({
        currentPassword: false,
        newPassword: false,
        confirmPassword: false
    });
    const dispatch = useDispatch();

    const handleChange = (event) => {
        let name = event.target.name;
        let value = event.target.value;

        setFormData({ ...formData, [name]: value });
    };

    const togglePasswordView = (name) => {
        setShowPassword({
            ...showPassword,
            [name]: !showPassword[name]
        });
    };

    const validateUser = () => {
        let newError = { ...error };
        let errors = false;
        const { currentPassword, confirmPassword, newPassword } = formData;
        if (!currentPassword) {
            newError.currentPassword = 'Current Password is required!';
            errors = true;
        }
        else {
            newError.currentPassword = '';
        }
        if (!newPassword) {
            newError.newPassword = 'New Password is required!';
            errors = true;
        }
        else if (!isValidPassword(newPassword)) {
            newError.newPassword = 'New Password must be at least 8 characters long!';
            errors = true;
        }
        else if (newPassword === currentPassword) {
            newError.newPassword = 'New Password must not be same as current password!';
            errors = true;
        }
        else {
            newError.newPassword = '';
        }
        if (!confirmPassword) {
            newError.confirmPassword = 'Confirm Password is required!';
            errors = true;
        }
        else if (newPassword !== confirmPassword) {
            newError.confirmPassword = "Password didn't match!";
            errors = true;
        }
        else {
            newError.confirmPassword = '';
        }
        setError(newError);
        if (errors) {
            console.log('Error: ', newError);
            return false;
        }
        return true;
    };

    const handleUpdate = async () => {
        if (!validateUser()) {
            return;
        }
        console.log('Form Data: ', formData);
        dispatch(ShowLoading());
        const data = {
            oldPassword: formData.currentPassword,
            newPassword: formData.newPassword,
        };
        try {
            const response = await userService.changeUserPassword(data);
            message.success(response.message);
            handleDiscard();
        } catch (error) {
            message.error(error.response.data?.error);
        } finally {
            dispatch(HideLoading());
        }
    };

    const handleDiscard = () => {
        setFormData({
            currentPassword: "",
            newPassword: "",
            confirmPassword: ""
        });
    };

    return (
        <div className='container change-password'>
            <div className='title'>Change Password</div>
            <div className='input-form'>
                <div className='input-container'>
                    <div className='input-wrapper'>
                        <div className='label-container'>
                            <label htmlFor='currentPassword' className='label'>Current Password</label>
                        </div>
                        <div className='pass-container'>
                            <input
                                type={showPassword.currentPassword ? 'text' : 'password'}
                                name='currentPassword'
                                id='currentPassword'
                                className={`input ${error.currentPassword ? 'input-error' : ''}`}
                                value={formData.currentPassword}
                                onChange={handleChange}
                            />
                            {!showPassword.currentPassword ?
                                <TbEye size={18} className='eye-icon' onClick={() => togglePasswordView("currentPassword")} />
                                :
                                <TbEyeOff size={18} className='eye-icon' onClick={() => togglePasswordView("currentPassword")} />
                            }
                        </div>
                    </div>
                    {error.currentPassword && <div className='error'>{error.currentPassword}</div>}
                </div>
                <div className='input-container'>
                    <div className='input-wrapper'>
                        <div className='label-container'>
                            <label htmlFor='newPassword' className='label'>New Password</label>
                        </div>
                        <div className='pass-container'>
                            <input
                                type={showPassword.newPassword ? 'text' : 'password'}
                                name='newPassword'
                                id='newPassword'
                                className={`input ${error.newPassword ? 'input-error' : ''}`}
                                value={formData.newPassword}
                                onChange={handleChange}
                            />
                            {!showPassword.newPassword ?
                                <TbEye size={18} className='eye-icon' onClick={() => togglePasswordView("newPassword")} />
                                :
                                <TbEyeOff size={18} className='eye-icon' onClick={() => togglePasswordView("newPassword")} />
                            }
                        </div>
                    </div>
                    {error.newPassword && <div className='error'>{error.newPassword}</div>}
                </div>
                <div className='input-container'>
                    <div className='input-wrapper'>
                        <div className='label-container'>
                            <label htmlFor='confirmPassword' className='label'>Confirm Password</label>
                        </div>
                        <div className='pass-container'>
                            <input
                                type={showPassword.confirmPassword ? 'text' : 'password'}
                                name='confirmPassword'
                                id='confirmPassword'
                                className={`input ${error.confirmPassword ? 'input-error' : ''}`}
                                value={formData.confirmPassword}
                                onChange={handleChange}
                            />
                            {!showPassword.confirmPassword ?
                                <TbEye size={18} className='eye-icon' onClick={() => togglePasswordView("confirmPassword")} />
                                :
                                <TbEyeOff size={18} className='eye-icon' onClick={() => togglePasswordView("confirmPassword")} />
                            }
                        </div>
                    </div>
                    {error.confirmPassword && <div className='error'>{error.confirmPassword}</div>}
                </div>
                <div className='btn-container'>
                    <button className='btn discard-btn' onClick={handleDiscard} >Discard</button>
                    <button className='btn save-btn' onClick={handleUpdate} >Update</button>
                </div>
            </div>
        </div>
    )
};

export default ChangePasswordForm;