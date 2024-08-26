import './Success.css';
import AuthContainer from '../../../components/AuthContainer/AuthContainer';
import Content from './components/Content/Content';

const Success = () => {
    return (
        <div className="success">
            <AuthContainer>
                <Content />
            </AuthContainer>
        </div>
    )
};

export default Success;