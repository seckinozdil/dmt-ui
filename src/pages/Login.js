import { useState, useContext } from 'react';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

export const Login = (props) => {
    const [firstName, setFirstName] = useState('');
    const [password, setPassword] = useState('');
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await login({ firstName, password });
            navigate('/');
        } catch (err) {
            console.log(err);
            
            alert('Login failed');
        }
    };

    return (
        <div className="login-body">
            <div className="login-image">
                <img src={`assets/layout/images/pages/login-${props.colorScheme === 'light' ? 'ondark' : 'onlight'}.png`} alt="atlantis" />
            </div>
            <div className="login-panel p-fluid">
                <div className="flex flex-column">
                    <div className="flex align-items-center mb-6 logo-container">
                        <img src={`assets/layout/images/logo-${props.colorScheme === 'light' ? 'dark' : 'light'}.png`} className="login-logo" alt="login-logo" />
                        <img src={`assets/layout/images/appname-${props.colorScheme === 'light' ? 'dark' : 'light'}.png`} className="login-appname" alt="login-appname" />
                    </div>
                    <div className="form-container">
                        <span className="p-input-icon-left">
                            <i className="pi pi-envelope"></i>
                            <InputText value={firstName} type="text" placeholder="Name" onChange={(e) => setFirstName(e.target.value)} />
                        </span>
                        <span className="p-input-icon-left">
                            <i className="pi pi-key"></i>
                            <InputText value={password} type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} />
                        </span>
                        <button className="flex p-link">Forgot your password?</button>
                    </div>
                    <div className="button-container">
                        <Button type="button" label="Login" onClick={handleSubmit}></Button>
                        <span>
                            Don’t have an account?<button className="p-link">Sign-up here</button>
                        </span>
                    </div>
                </div>

                <div className="login-footer flex align-items-center">
                    <div className="flex align-items-center login-footer-logo-container">
                        <img src="assets/layout/images/logo-gray.png" className="login-footer-logo" alt="login-footer-logo" />
                        <img src="assets/layout/images/appname-gray.png" className="login-footer-appname" alt="login-footer-appname" />
                    </div>
                    <span>Copyright 2021</span>
                </div>
            </div>
        </div>
    );
};
