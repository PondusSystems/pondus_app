import Cookies from 'js-cookie';
import { menuItems } from '../constants/menuItems';

const isAuthenticated = () => {
    const token = Cookies.get('pondus-jwt-token');
    return !!token;
};

const verifyAuthorization = (role) => {
    if (role === 'user' && window.location.pathname === '/success') {
        return true;
    }
    const allowedPages = menuItems[role]?.map(item => item.path) || [];
    const currentPath = window.location.pathname;

    return allowedPages.includes(currentPath);
};

export { isAuthenticated, verifyAuthorization };