import { useState } from 'react';
import './ForgetPassword.css';
import { message } from 'antd';
import { useDispatch } from 'react-redux';
import { HideLoading, ShowLoading } from '../../../redux/loaderSlice';
import { isValidEmail } from '../../../utils/validationUtils';
import userService from '../../../services/userService';
import AuthContainer from '../../../components/AuthContainer/AuthContainer';
import Form from './components/Form/Form';
import ResendEmail from './components/ResendEmail/ResendEmail';

const ForgetPassword = () => {
    const [view, setView] = useState(0);
    const [email, setEmail] = useState('');
    const [emailError, setEmailError] = useState('');
    const dispatch = useDispatch();

    const validateEmail = () => {
        let error = false;
        let newError = '';
        if (!email) {
            newError = 'Email is required!';
            error = true;
        }
        else if (!isValidEmail(email)) {
            newError = 'Please provide valid email!';
            error = true;
        }
        else {
            newError = '';
        }
        setEmailError(newError);
        if (error) {
            return false;
        }
        return true;
    };

    const handleReset = async () => {
        if (!validateEmail()) {
            return;
        }
        dispatch(ShowLoading());
        try {
            const response = await userService.forgotPassword({ email }, 'staff');
            setView(1);
        } catch (error) {
            message.error(error.response.data?.error);
        } finally {
            dispatch(HideLoading());
        }
    };

    return (
        <div className="forget-password">
            <AuthContainer userType="staff">
                {view === 0 ?
                    <Form email={email} setEmail={setEmail} emailError={emailError} handleReset={handleReset} />
                    :
                    <ResendEmail handleReset={handleReset} setView={setView} />
                }
            </AuthContainer>
        </div>
    )
};

export default ForgetPassword;
