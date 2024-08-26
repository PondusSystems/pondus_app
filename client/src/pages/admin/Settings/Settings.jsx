import '../../../styles/settings.css';
import ProfileForm from '../../../components/ProfileForm/ProfileForm';
import CompanyInfoForm from '../../../components/CompanyInfoForm/CompanyInfoForm';
import ChangePasswordForm from '../../../components/ChangePasswordForm/ChangePasswordForm';

const Settings = () => {
    return (
        <div className='settings'>
            <div className='main-title'>Settings</div>
            <div className='settings-form'>
                <ProfileForm />
                <CompanyInfoForm />
                <ChangePasswordForm />
            </div>
        </div>
    )
};

export default Settings;