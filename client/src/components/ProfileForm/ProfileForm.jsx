import { useState, useEffect } from 'react';
import './ProfileForm.css';
import UserImage from '../../assets/images/user_icon.png';
import { useDispatch, useSelector } from 'react-redux';
import { ShowLoading, HideLoading } from '../../redux/loaderSlice';
import { fetchUserInfo } from '../../redux/userSlice';
import { message } from 'antd';
import { isEqual } from 'lodash';
import { isValidEmail } from '../../utils/validationUtils';
import userService from '../../services/userService';

const ProfileForm = () => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        number: "",
        dateOfBirth: "",
        address: "",
        city: "",
        zip: ""
    });
    const [error, setError] = useState({
        name: "",
        email: "",
        number: "",
        dateOfBirth: "",
        address: "",
        city: "",
        zip: ""
    });
    const { user } = useSelector(state => state.user);
    const dispatch = useDispatch();

    useEffect(() => {
        const { role, ...rest } = user;
        setFormData({
            ...formData,
            ...rest
        });
    }, [user]);

    const handleChange = (event) => {
        let name = event.target.name;
        let value = event.target.value;

        setFormData({ ...formData, [name]: value });
    };

    const validateUser = () => {
        let newError = { ...error };
        let errors = false;
        const { name, email, number, dateOfBirth, address, city, zip, password } = formData;
        if (!name) {
            newError.name = 'Name is required!';
            errors = true;
        }
        else {
            newError.name = '';
        }
        if (!email) {
            newError.email = 'Email is required!';
            errors = true;
        }
        else if (!isValidEmail(email)) {
            newError.email = 'Please provide valid email!';
            errors = true;
        }
        else {
            newError.email = '';
        }
        if (!number) {
            newError.number = 'Phone Number is required!';
            errors = true;
        }
        else {
            newError.number = '';
        }
        if (!dateOfBirth) {
            newError.dateOfBirth = 'Date Of Birth is required!';
            errors = true;
        }
        else {
            newError.dateOfBirth = '';
        }
        if (!address) {
            newError.address = 'Address is required!';
            errors = true;
        }
        else {
            newError.address = '';
        }
        if (!city) {
            newError.city = 'City is required!';
            errors = true;
        }
        else {
            newError.city = '';
        }
        if (!zip) {
            newError.zip = 'Zip is required!';
            errors = true;
        }
        else {
            newError.zip = '';
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
        try {
            const response = await userService.updateUserInfo(formData);
            dispatch(fetchUserInfo());
            message.success(response.message);
        } catch (error) {
            message.error(error.response.data?.error);
        } finally {
            dispatch(HideLoading());
        }
    };

    const handleDiscard = () => {
        const { role, ...rest } = user;
        setFormData({
            ...formData,
            ...rest
        });
    };

    const checkChanges = () => {
        const { role, ...rest } = user;
        return !isEqual(formData, rest);
    };

    return (
        <div className='container user-profile'>
            <div className='title'>Profile</div>
            {/* <img src={UserImage} className='user-image' alt='user-image' /> */}
            <div className='input-form'>
                <div className='input-container'>
                    <div className='input-wrapper'>
                        <div className='label-container'>
                            <label htmlFor='name' className='label'>Name</label>
                        </div>
                        <input
                            type='text'
                            name='name'
                            id='name'
                            className={`input ${error.name ? 'input-error' : ''}`}
                            value={formData.name}
                            onChange={handleChange}
                        />
                    </div>
                    {error.name && <div className='error'>{error.name}</div>}
                </div>
                <div className='input-container'>
                    <div className='input-wrapper'>
                        <div className='label-container'>
                            <label htmlFor='email' className='label'>E-mail</label>
                        </div>
                        <input
                            type='text'
                            name='email'
                            id='email'
                            className={`input ${error.email ? 'input-error' : ''}`}
                            value={formData.email}
                            onChange={handleChange}
                        />
                    </div>
                    {error.email && <div className='error'>{error.email}</div>}
                </div>
                <div className='input-container'>
                    <div className='input-wrapper'>
                        <div className='label-container'>
                            <label htmlFor='number' className='label'>Phone</label>
                        </div>
                        <input
                            type='text'
                            name='number'
                            id='number'
                            className={`input ${error.number ? 'input-error' : ''}`}
                            value={formData.number}
                            onChange={handleChange}
                        />
                    </div>
                    {error.number && <div className='error'>{error.number}</div>}
                </div>
                <div className='input-container'>
                    <div className='input-wrapper'>
                        <div className='label-container'>
                            <label htmlFor='dateOfBirth' className='label'>Date Of Birth</label>
                        </div>
                        <input
                            type='date'
                            name='dateOfBirth'
                            id='dateOfBirth'
                            className={`input ${error.dateOfBirth ? 'input-error' : ''}`}
                            value={formData.dateOfBirth}
                            onChange={handleChange}
                        />
                    </div>
                    {error.dateOfBirth && <div className='error'>{error.dateOfBirth}</div>}
                </div>
                <div className='input-container'>
                    <div className='input-wrapper'>
                        <div className='label-container'>
                            <label htmlFor='address' className='label'>Address</label>
                        </div>
                        <input
                            type='text'
                            name='address'
                            id='address'
                            className={`input ${error.address ? 'input-error' : ''}`}
                            value={formData.address}
                            onChange={handleChange}
                        />
                    </div>
                    {error.address && <div className='error'>{error.address}</div>}
                </div>
                <div className='input-container'>
                    <div className='input-wrapper'>
                        <div className='label-container'>
                            <label htmlFor='city' className='label'>City</label>
                        </div>
                        <input
                            type='text'
                            name='city'
                            id='city'
                            className={`input ${error.city ? 'input-error' : ''}`}
                            value={formData.city}
                            onChange={handleChange}
                        />
                    </div>
                    {error.city && <div className='error'>{error.city}</div>}
                </div>
                <div className='input-container'>
                    <div className='input-wrapper'>
                        <div className='label-container'>
                            <label htmlFor='zip' className='label'>ZIP</label>
                        </div>
                        <input
                            type='text'
                            name='zip'
                            id='zip'
                            className={`input ${error.zip ? 'input-error' : ''}`}
                            value={formData.zip}
                            onChange={handleChange}
                        />
                    </div>
                    {error.zip && <div className='error'>{error.zip}</div>}
                </div>
                <div className='btn-container'>
                    <button className='btn discard-btn' disabled={!checkChanges()} onClick={handleDiscard} >Discard</button>
                    <button className='btn save-btn' disabled={!checkChanges()} onClick={handleUpdate} >Update</button>
                </div>
            </div>
        </div>
    )
};

export default ProfileForm;