import React, { useState } from 'react';
import { MDBContainer, MDBInput, MDBBtn, MDBIcon } from 'mdb-react-ui-kit';
import axios from "axios";
import './forgotPassword.css';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);

    const handleChange = (e) => {
        setEmail(e.target.value);
        setError(null); // Reset error khi người dùng nhập
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateEmail(email)) {
            setError('Invalid email format');
            return;
        }
        
        setLoading(true);
        try {
            await axios.post(`${process.env.REACT_APP_API_URL}/auth/forgotPassword?email=${email}`);
            setSuccessMessage('Password reset link has been sent to your email');
        } catch (err) {
            setError(err.response?.data?.message || 'User not found');
        } finally {
            setLoading(false);
        }
    };

    const validateEmail = (email) => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    };  

    return (
        <div className="min-vh-100 d-flex align-items-center bg-light">
            <MDBContainer className="p-5 border rounded-5 shadow-lg bg-white" style={{ maxWidth: '500px' }}>
                {/* Header Section */}
                <div className="text-center mb-5">
                    <MDBIcon fas icon="envelope" className="text-primary mb-3" size="3x" />
                    <h2 className="fw-bold mb-3 text-primary">Reset Your Password</h2>
                    <p className="text-muted">Enter your email to receive reset instructions</p>
                </div>

                {/* Success Alert */}
                {successMessage && (
                    <div className="alert alert-success alert-dismissible fade show" role="alert">
                        {successMessage}
                        <button 
                            type="button" 
                            className="btn-close" 
                            onClick={() => setSuccessMessage(null)}
                        ></button>
                    </div>
                )}

                {/* Error Alert */}
                {error && (
                    <div className="alert alert-danger alert-dismissible fade show" role="alert">
                        {error}
                        <button 
                            type="button" 
                            className="btn-close" 
                            onClick={() => setError(null)}
                        ></button>
                    </div>
                )}

                {/* Email Input */}
                <div className="mb-4">
                    <MDBInput
                        type="email"
                        label="Email Address"
                        id="email"
                        value={email}
                        onChange={handleChange}
                        className='border-2 p-2'
                        style={{ borderColor: '#dee2e6' }}
                        invalid={!!error}
                    />
                </div>

                {/* Submit Button */}
                <MDBBtn 
                    onClick={handleSubmit}
                    disabled={loading}
                    className="w-100 mb-4 rounded-pill py-2 fw-bold"
                    color='primary'
                >
                    {loading ? (
                        <div className="d-flex align-items-center justify-content-center">
                            <div className="spinner-border spinner-border-sm me-2" role="status">
                                <span className="visually-hidden">Loading...</span>
                            </div>
                            Sending...
                        </div>
                    ) : 'Send Reset Link'}
                </MDBBtn>

                {/* Navigation Links */}
                <div className="d-flex justify-content-center">
                    <a 
                        href="/login" 
                        className="text-decoration-none text-primary fw-bold"
                    >
                        <MDBIcon fas icon="arrow-left" className="me-2" />
                        Return to Login
                    </a>
                </div>
            </MDBContainer>
        </div>
    );
};

export default ForgotPassword;
