import UserLogin from '../pages/user/Login/Login.jsx';
import Register from '../pages/user/Register/Register.jsx';
import StaffLogin from '../pages/staff/Login/Login.jsx';
import ForgetPassword from '../pages/user/ForgetPassword/ForgetPassword.jsx';
import StaffForgetPassword from '../pages/staff/ForgetPassword/ForgetPassword.jsx';
import ResetPassword from '../pages/user/ResetPassword/ResetPassword.jsx';
import StaffResetPassword from '../pages/staff/ResetPassword/ResetPassword.jsx';
import Billing from '../pages/user/Billing/Billing.jsx';
import Settings from '../pages/user/Settings/Settings.jsx';
import AdminDashboard from '../pages/admin/Dashboard/Dashboard.jsx';
import AdminEmployees from '../pages/admin/Employees/Employees.jsx';
import AdminSettings from '../pages/admin/Settings/Settings.jsx';
import AdminProducts from '../pages/admin/Products/Products.jsx';
import StaffUsers from '../pages/staff/Users/Users.jsx';
import EmployeeSettings from '../pages/employee/Settings/Settings.jsx';
import Plans from '../pages/user/Plans/Plans.jsx';
import Success from '../pages/user/Success/Success.jsx';
import AuthenticatedRedirect from '../components/AuthenticatedRedirect/AuthenticatedRedirect.jsx';
// import Home from '../pages/common/Home/Home.jsx'
import NotFound from '../pages/common/NotFound/NotFound.jsx';

const routes = [
  //staff
  { path: "/staff/login", element: <AuthenticatedRedirect><StaffLogin /></AuthenticatedRedirect>, protected: false, showSidebar: false },
  { path: "/staff/forget-password", element: <AuthenticatedRedirect><StaffForgetPassword /></AuthenticatedRedirect>, protected: false, showSidebar: false },
  { path: "/staff/reset-password", element: <AuthenticatedRedirect><StaffResetPassword /></AuthenticatedRedirect>, protected: false, showSidebar: false },
  { path: "/staff/common/users", element: <StaffUsers />, protected: true, showSidebar: true },

  //admin
  { path: "/staff/admin/dashboard", element: <AdminDashboard />, protected: true, showSidebar: true },
  { path: "/staff/admin/employees", element: <AdminEmployees />, protected: true, showSidebar: true },
  { path: "/staff/admin/products", element: <AdminProducts />, protected: true, showSidebar: true },
  { path: "/staff/admin/settings", element: <AdminSettings />, protected: true, showSidebar: true },

  //employee
  { path: "/staff/employee/settings", element: <EmployeeSettings />, protected: true, showSidebar: true },

  //user
  { path: "/login", element: <AuthenticatedRedirect><UserLogin /></AuthenticatedRedirect>, protected: false, showSidebar: false },
  { path: "/register", element: <AuthenticatedRedirect><Register /></AuthenticatedRedirect>, protected: false, showSidebar: false },
  { path: "/forget-password", element: <AuthenticatedRedirect><ForgetPassword /></AuthenticatedRedirect>, protected: false, showSidebar: false },
  { path: "/reset-password", element: <AuthenticatedRedirect><ResetPassword /></AuthenticatedRedirect>, protected: false, showSidebar: false },
  // { path: "/", element: <Home />, protected: true, showSidebar: true },
  { path: "/billing", element: <Billing />, protected: true, showSidebar: true },
  { path: "/plans", element: <Plans />, protected: true, showSidebar: true },
  { path: "/success", element: <Success />, protected: true, showSidebar: false },
  { path: "/settings", element: <Settings />, protected: true, showSidebar: true },


  //not found
  { path: "*", element: <NotFound />, protected: false, showSidebar: false },
];

export default routes;
