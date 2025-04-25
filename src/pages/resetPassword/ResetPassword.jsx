import React, { useState } from 'react';
import { MDBContainer, MDBInput, MDBBtn, MDBIcon } from 'mdb-react-ui-kit';
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import './resetPassword.css';

const ResetPassword = () => {
    const [searchParams] = useSearchParams();
    const tokenUrl = searchParams.get('token');
    const [resetPasswordRequest, setResetPasswordRequest] = useState({
        token: tokenUrl,
        newPassword: ''
    });
    const [loading, setLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState(null);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setResetPasswordRequest(prev => ({ ...prev, [e.target.id]: e.target.value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await axios.post(`${process.env.REACT_APP_API_URL}/auth/resetPassword`, resetPasswordRequest);
            setSuccessMessage('Password reset successfully');
            setError(null);
            setTimeout(() => navigate('/login'), 1500);
        } catch (err) {
            setError('Password invalid or reset link expired');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-vh-100 d-flex align-items-center bg-light">
            <MDBContainer className="p-5 border rounded-5 shadow-lg bg-white" style={{ maxWidth: '500px' }}>
                {/* Header Section */}
                <div className="text-center mb-5">
                    <MDBIcon fas icon="key" className="text-primary mb-3" size="3x" />
                    <h2 className="fw-bold mb-3 text-primary">Reset Password</h2>
                    <p className="text-muted">Enter your new password below</p>
                </div>

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

                {/* Password Input */}
                <div className="mb-4">
                    <MDBInput
                        type="password"
                        label="New Password"
                        id="newPassword"
                        value={resetPasswordRequest.newPassword}
                        onChange={handleChange}
                        className='border-2 p-2'
                        style={{ borderColor: '#dee2e6' }}
                    />
                </div>

                {/* Action Buttons */}
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
                            Processing...
                        </div>
                    ) : 'Reset Password'}
                </MDBBtn>

                {/* Navigation Links */}
                <div className="d-flex justify-content-between">
                    <a 
                        href="/login" 
                        className="text-decoration-none text-primary fw-bold"
                    >
                        <MDBIcon fas icon="arrow-left" className="me-2" />
                        Back to Login
                    </a>
                    <a 
                        href="/forgotPassword" 
                        className="text-decoration-none text-muted"
                    >
                        Resend Link?
                    </a>
                </div>
            </MDBContainer>
        </div>
    );
};

export default ResetPassword;
