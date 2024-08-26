import './AuthContainer.css';
import { useSelector } from 'react-redux';
import LogoIcon from '../../assets/icons/logo.svg?react';
import IllustrationIcon from '../../assets/icons/illustration.svg?react';

const AuthContainer = ({ children, userType = 'user' }) => {
    const { companyInfo } = useSelector(state => state.companyInfo);

    return (
        <div className="auth-container">
            <div className="container" id="container-1">
                <div className="logo">
                    {userType === 'staff' ?
                        <LogoIcon className="logo-icon" />
                        :
                        <img src={companyInfo?.logo} style={{ width: '50px', height: '50px' }} alt='Gym Logo' />
                    }
                    <div className="logo-text">{userType === 'staff' ? 'Pondus' : companyInfo?.name}</div>
                </div>
                {children}
            </div>
            <div className="container" id="container-2">
                <IllustrationIcon />
            </div>
        </div>
    );
};

export default AuthContainer;
