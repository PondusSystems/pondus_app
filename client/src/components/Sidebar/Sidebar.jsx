import React, { useState, useEffect, useRef } from 'react';
import './Sidebar.css';
import { useLocation, Link } from 'react-router-dom';
import LogoIcon from '../../assets/icons/logo.svg?react';
import LogoutIcon from '../../assets/icons/logout_icon.svg?react';
import { GiHamburgerMenu } from "react-icons/gi";
import { BiMenuAltRight } from "react-icons/bi";
import { useDispatch, useSelector } from 'react-redux';
import { message } from 'antd';
import { HideLoading, ShowLoading } from '../../redux/loaderSlice';
import Cookies from 'js-cookie';
import { setLoggedOut } from '../../redux/logoutSlice';
import { clearUser } from '../../redux/userSlice';
import { menuItems } from '../../constants/menuItems';
import userService from '../../services/userService';

const Sidebar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const sidebarRef = useRef(null);
    const { user } = useSelector(state => state.user);
    const { companyInfo } = useSelector(state => state.companyInfo);
    const items = menuItems[user?.role] || [];
    const location = useLocation();
    const dispatch = useDispatch();

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen]);

    const handlePageChange = () => {
        setIsOpen(false);
    };

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
        <div className='sidebar-wrapper'>
            {!isOpen &&
                <div className='hamburger-container'>
                    <GiHamburgerMenu
                        size={20}
                        className='hamburger-menu'
                        onClick={() => setIsOpen(true)}
                    />
                </div>
            }
            <div ref={sidebarRef} className={`sidebar ${isOpen ? 'sidebar-opened' : 'sidebar-closed'}`}>
                <div className='hamburger-close-container'>
                    <BiMenuAltRight
                        size={30}
                        className='hamburger-menu'
                        onClick={() => setIsOpen(false)}
                    />
                </div>
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
                                    <Link to={item.path} className='item-link' onClick={handlePageChange}>
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
        </div>
    );
};

export default Sidebar;
