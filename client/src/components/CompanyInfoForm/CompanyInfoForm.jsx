import { useEffect, useState } from 'react';
import './CompanyInfoForm.css';
import { useDispatch, useSelector } from 'react-redux';
import { ShowLoading, HideLoading } from '../../redux/loaderSlice';
import { fetchCompanyInfo } from '../../redux/companyInfoSlice';
import { message } from 'antd';
import { isEqual } from 'lodash';
import companyInfoService from '../../services/companyInfoService';

const CompanyInfoForm = () => {
    const [formData, setFormData] = useState({
        name: "",
        address: "",
        city: "",
        zip: "",
        type: "",
        logo: ""
    });
    const [error, setError] = useState({
        name: "",
        address: "",
        city: "",
        zip: "",
        type: "",
        logo: ""
    });

    const { companyInfo } = useSelector(state => state.companyInfo);
    const dispatch = useDispatch();

    useEffect(() => {
        if (companyInfo) {
            setFormData({
                ...formData,
                ...companyInfo
            });
        }
    }, [companyInfo]);

    const handleChange = (event) => {
        let name = event.target.name;
        let value = event.target.value;

        setFormData({ ...formData, [name]: value });
    };

    const handleFileChange = () => {

    };

    const checkChanges = () => {
        return !isEqual(formData, companyInfo);
    };

    const handleDiscard = () => {
        setFormData({
            ...companyInfo
        });
    };

    const validateInfo = () => {
        let newError = { ...error };
        let errors = false;
        const { name, address, city, zip, type, logo } = formData;
        if (!name) {
            newError.name = 'Name is required!';
            errors = true;
        }
        else {
            newError.name = '';
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
        if (!type) {
            newError.type = 'Type is required!';
            errors = true;
        }
        else {
            newError.type = '';
        }
        setError(newError);
        if (errors) {
            console.log('Error: ', newError);
            return false;
        }
        return true;
    };

    const handleUpdate = async () => {
        if (!validateInfo()) {
            return;
        }
        console.log('Updated Info: ', formData);
        dispatch(ShowLoading());
        let data = { ...formData };
        // if (!data.logo) {
        delete data.logo;
        // }
        try {
            const response = await companyInfoService.updateCompanyInfo(data);
            dispatch(fetchCompanyInfo());
            message.success(response.message);
        } catch (error) {
            message.error(error.response.data?.error);
        } finally {
            dispatch(HideLoading());
        }
    };

    return (
        <div className='container company-info'>
            <div className='title'>Company Info</div>
            {companyInfo &&
                <div className='input-form'>
                    <div className='input-container'>
                        <div className='input-wrapper'>
                            <div className='label-container'>
                                <label htmlFor='name2' className='label'>Name</label>
                            </div>
                            <input
                                type='text'
                                name='name'
                                id='name2'
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
                                <label htmlFor='address2' className='label'>Address</label>
                            </div>
                            <input
                                type='text'
                                name='address'
                                id='address2'
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
                                <label htmlFor='city2' className='label'>City</label>
                            </div>
                            <input
                                type='text'
                                name='city'
                                id='city2'
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
                                <label htmlFor='zip2' className='label'>ZIP</label>
                            </div>
                            <input
                                type='text'
                                name='zip'
                                id='zip2'
                                className={`input ${error.zip ? 'input-error' : ''}`}
                                value={formData.zip}
                                onChange={handleChange}
                            />
                        </div>
                        {error.zip && <div className='error'>{error.zip}</div>}
                    </div>
                    <div className='input-container'>
                        <div className='input-wrapper'>
                            <div className='label-container'>
                                <label htmlFor='logo' className='label'>Logo</label>
                            </div>
                            <input
                                type='file'
                                name='logo'
                                id='logo'
                                className={`input ${error.logo ? 'input-error' : ''}`}
                                // value={formData.logo}
                                onChange={handleFileChange}
                            />
                        </div>
                        {error.logo && <div className='error'>{error.logo}</div>}
                    </div>
                    <div className='btn-container'>
                        <button className='btn discard-btn' disabled={!checkChanges()} onClick={handleDiscard} >Discard</button>
                        <button className='btn save-btn' disabled={!checkChanges()} onClick={handleUpdate} >Update</button>
                    </div>
                </div>
            }
        </div>
    )
};

export default CompanyInfoForm;