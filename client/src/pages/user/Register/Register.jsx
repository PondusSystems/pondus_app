import './Register.css';
import AuthContainer from "../../../components/AuthContainer/AuthContainer";
import Form from "./components/Form/Form";


const Register = () => {
    return (
        <div className="register">
            <AuthContainer>
                <Form />
            </AuthContainer>
        </div>
    );
};

export default Register;
