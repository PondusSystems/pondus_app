import DashboardIcon from '../assets/icons/dashboard_icon.svg?react';
import UsersIcon from '../assets/icons/users_icon.svg?react';
import EmployeesIcon from '../assets/icons/employees_icon.svg?react';
import CalendarIcon from '../assets/icons/calendar_icon.svg?react';
import ActivitiesIcon from '../assets/icons/activities_icon.svg?react';
import InvoiceIcon from '../assets/icons/invoice_icon.svg?react';
import CampaignsIcon from '../assets/icons/campaigns_icon.svg?react';
import NotificationsIcon from '../assets/icons/notifications_icon.svg?react';
import SettingsIcon from '../assets/icons/settings_icon.svg?react';
import StatisticsIcon from '../assets/icons/statistics_icon.svg?react';
import ProductsIcon from '../assets/icons/products_icon.svg?react';
import BillingIcon from '../assets/icons/billing_icon.svg?react';


export const menuItems = {
    admin: [
        { path: '/staff/admin/dashboard', label: 'Dashboard', icon: <DashboardIcon />, disabled: false },
        { path: '/staff/admin/employees', label: 'Employees', icon: <EmployeesIcon />, disabled: false },
        { path: '/staff/common/users', label: 'Users', icon: <UsersIcon />, disabled: false },
        { path: '/staff/common/calendar', label: 'Calendar', icon: <CalendarIcon />, disabled: true },
        { path: '/staff/common/activities', label: 'Activities', icon: <ActivitiesIcon />, disabled: true },
        { path: '/staff/common/invoice', label: 'Invoice', icon: <InvoiceIcon />, disabled: true },
        { path: '/staff/common/campaigns', label: 'Campaigns', icon: <CampaignsIcon />, disabled: true },
        { path: '/staff/common/notifications', label: 'Notifications', icon: <NotificationsIcon />, disabled: true },
        { path: '/staff/admin/products', label: 'Products', icon: <ProductsIcon />, disabled: false },
        { path: '/staff/admin/settings', label: 'Settings', icon: <SettingsIcon />, disabled: false },
    ],
    employee: [
        { path: '/staff/common/users', label: 'Users', icon: <UsersIcon />, disabled: false },
        { path: '/staff/common/calendar', label: 'Calendar', icon: <CalendarIcon />, disabled: true },
        { path: '/staff/common/activities', label: 'Activities', icon: <ActivitiesIcon />, disabled: true },
        { path: '/staff/common/invoice', label: 'Invoice', icon: <InvoiceIcon />, disabled: true },
        { path: '/staff/common/campaigns', label: 'Campaigns', icon: <CampaignsIcon />, disabled: true },
        { path: '/staff/common/notifications', label: 'Notifications', icon: <NotificationsIcon />, disabled: true },
        { path: '/staff/employee/settings', label: 'Settings', icon: <SettingsIcon />, disabled: false },
    ],
    user: [
        { path: '/billing', label: 'Billing', icon: <BillingIcon />, disabled: false },
        { path: '/plans', label: 'Plans', icon: <ProductsIcon />, disabled: false },
        { path: '/notifications', label: 'Notifications', icon: <NotificationsIcon />, disabled: true },
        { path: '/statistics', label: 'Statistics', icon: <StatisticsIcon />, disabled: true },
        { path: '/activities', label: 'Activities', icon: <ActivitiesIcon />, disabled: true },
        { path: '/settings', label: 'Settings', icon: <SettingsIcon />, disabled: false },
    ],
};
