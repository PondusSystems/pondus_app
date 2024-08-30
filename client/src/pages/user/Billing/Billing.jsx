import { useState, useEffect } from 'react';
import './Billing.css';
import { message } from 'antd';
import { useDispatch } from 'react-redux';
import { ShowLoading, HideLoading } from '../../../redux/loaderSlice';
import stripeService from '../../../services/stripeService';
import subscriptionService from '../../../services/subscriptionService';

const Billing = () => {
    const dispatch = useDispatch();
    const [info, setInfo] = useState({
        status: false,
        planName: '',
        productId: '',
        subscriptionId: '',
        amount: null
    })

    useEffect(() => {
        const getSubscriptionInfo = async () => {
            dispatch(ShowLoading());
            try {
                const response = await subscriptionService.getUserSubscriptionInfo();
                if (response.info) {
                    setInfo(response.info);
                }
            } catch (error) {
                message.error(error.response.data.error);
            } finally {
                dispatch(HideLoading());
            }
        };

        getSubscriptionInfo();
    }, []);

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
            {info.status &&
                <div className='plan-info-container'>
                    <div className='plan-label'>Active Plan: </div>
                    <div className='plan-name'>{info.planName}</div>
                </div>
            }
            <button className='btn' onClick={handleContinue}>View Billing Portal</button>
        </div>
    )
};

export default Billing;