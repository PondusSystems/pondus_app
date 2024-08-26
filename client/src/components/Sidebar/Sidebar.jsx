import React from 'react';
import './Sidebar.css';
import { useLocation, Link } from 'react-router-dom';
import LogoIcon from '../../assets/icons/logo.svg?react';
import LogoutIcon from '../../assets/icons/logout_icon.svg?react';
import { useDispatch, useSelector } from 'react-redux';
import { message } from 'antd';
import { HideLoading, ShowLoading } from '../../redux/loaderSlice';
import Cookies from 'js-cookie';
import { setLoggedOut } from '../../redux/logoutSlice';
import { clearUser } from '../../redux/userSlice';
import { menuItems } from '../../constants/menuItems';
import userService from '../../services/userService';

const Sidebar = () => {
    const { user } = useSelector(state => state.user);
    const { companyInfo } = useSelector(state => state.companyInfo);
    const items = menuItems[user?.role] || [];
    const location = useLocation();
    const dispatch = useDispatch();

    const handleLogout = async () => {
        dispatch(ShowLoading());
        try {
            await userService.logoutUser({});
            Cookies.remove('pondus-jwt-token');
            dispatch(setLoggedOut());
            dispatch(clearUser());
        } catch (error) {
            message.error(error.response.data);
        }
        dispatch(HideLoading());
    };

    return (
        <div className="sidebar">
            <div className="logo">
                {user?.role !== 'user' ?
                    <LogoIcon className="logo-icon" />
                    :
                    <img src={companyInfo?.logo} style={{ width: '50px', height: '50px' }} alt='Gym Logo' />
                }
                <div className="logo-text">{user.role !== 'user' ? "Pondus" : companyInfo?.name}</div>
            </div>
            <div className='menu'>
                {items.map((item) => (
                    <div key={item.path} className={`item ${location.pathname === item.path ? 'active-item' : 'non-active-item'}`}>
                        {item.disabled ?
                            <>
                                <div className='item-link'>
                                    {React.cloneElement(item.icon, { width: 30, height: 30, opacity: item.disabled ? 0.3 : 1 })}
                                    <div className='item-label disabled-label'>{item.label}</div>
                                </div>
                            </>
                            :
                            <>
                                <Link to={item.path} className='item-link'>
                                    {React.cloneElement(item.icon, { width: 30, height: 30, opacity: item.disabled ? 0.3 : 1 })}
                                    <div className='item-label'>{item.label}</div>
                                </Link>
                            </>
                        }
                    </div>
                ))}
                <div className={`item non-active-item`} onClick={handleLogout}>
                    <div className='item-link'>
                        <LogoutIcon width='30' height='30' />
                        <div className='item-label'>Log out</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Sidebar;
