import { useEffect } from 'react';
import './Billing.css';
import { message } from 'antd';
import { useDispatch } from 'react-redux';
import { ShowLoading, HideLoading } from '../../../redux/loaderSlice';
import stripeService from '../../../services/stripeService';

const Billing = () => {
    const dispatch = useDispatch();

    const handleContinue = async () => {
        dispatch(ShowLoading())
        try {
            const response = await stripeService.createBillingPortalSession({});
            if (response.url) {
                console.log('URL: ', response.url);
                window.location.href = response.url;
            }
        } catch (error) {
            message.error(error.response.data.error);
        } finally {
            dispatch(HideLoading());
        }
    };

    return (
        <div className='billing'>
            <div className='title'>Billing</div>
            <button className='btn' onClick={handleContinue}>View Billing Portal</button>
        </div>
    )
};

export default Billing;