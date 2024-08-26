import { useState } from "react";
import './Login.css';
import AuthContainer from "../../../components/AuthContainer/AuthContainer";
import Form from "./components/Form/Form";


const Login = () => {
    return (
        <div className="login">
            <AuthContainer userType="staff">
                <Form />
            </AuthContainer>
        </div>
    );
};

export default Login;
