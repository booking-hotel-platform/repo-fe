import React, { useState } from 'react';
import { MDBContainer, MDBInput, MDBBtn, MDBIcon } from 'mdb-react-ui-kit';
import { useNavigate } from 'react-router-dom';
import './register.css';
import { useDispatch, useSelector } from 'react-redux';
import { register } from '../../redux/features/authSlice';
import "react-toastify/dist/ReactToastify.css";
import { REGEX_USERNAME, REGEX_EMAIL, USERNAME_INVALID_MESSAGE, EMAIL_INVALID_MESSAGE, PASSWORD_INVALID_MESSAGE, PASSWORD_CONFIRM_INVALID_MESSAGE } from '../../constants/auth/authConstants';

const Register = () => {
  const [credentials, setCredentials] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, error } = useSelector(state => state.auth);  

  const validateForm = () => {
    const newErrors = {};
    if (!credentials.username.match(REGEX_USERNAME)) {
      newErrors.username = USERNAME_INVALID_MESSAGE;
    }
    if (!credentials.email.match(REGEX_EMAIL)) {
      newErrors.email = EMAIL_INVALID_MESSAGE;
    }
    if (credentials.password.length < 8) {
      newErrors.password = PASSWORD_INVALID_MESSAGE;
    }
    if (credentials.password !== credentials.confirmPassword) {
      newErrors.confirmPassword = PASSWORD_CONFIRM_INVALID_MESSAGE;
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    e.preventDefault();
    const resultAction = await dispatch(register(credentials));
    if (register.fulfilled.match(resultAction)){
      navigate("/login");
    }
  };

  const handleChange = (e) => {
    setCredentials(prev => ({
      ...prev,
      [e.target.id]: e.target.value
    }));
  };

  return (
    <div className="min-vh-100 d-flex align-items-center bg-light">
      <MDBContainer className="p-5 border rounded-5 shadow-lg bg-white" style={{ maxWidth: '500px' }}>
        {/* Header Section */}
        <div className="text-center mb-5">
          <h2 className="fw-bold mb-3 text-primary">Create Account</h2>
          <p className="text-muted">Join our community today</p>
        </div>

        {/* Error Display */}
        {errors.apiError && (
          <div className="alert alert-danger alert-dismissible fade show" role="alert">
            {errors.apiError}
            <button type="button" className="btn-close" onClick={() => setErrors({})}></button>
          </div>
        )}

        {/* Error API */}
        {error && (
          <div className="alert alert-danger alert-dismissible fade show" role="alert">
            {error}
            <button type="button" onClick={() => setErrors({})}></button>
          </div>
        )}

        {/* Registration Form */}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <MDBInput
              label='Username'
              id='username'
              value={credentials.username}
              onChange={handleChange}
              className={`${errors.username ? 'is-invalid' : ''}`}
            />
            {errors.username && <div className="invalid-feedback">{errors.username}</div>}
          </div>

          <div className="mb-4">
            <MDBInput
              type='email'
              label='Email'
              id='email'
              value={credentials.email}
              onChange={handleChange}
              className={`${errors.email ? 'is-invalid' : ''}`}
            />
            {errors.email && <div className="invalid-feedback">{errors.email}</div>}
          </div>

          <div className="mb-4">
            <MDBInput
              type='password'
              label='Password'
              id='password'
              value={credentials.password}
              onChange={handleChange}
              className={`${errors.password ? 'is-invalid' : ''}`}
            />
            {errors.password && <div className="invalid-feedback">{errors.password}</div>}
          </div>

          <div className="mb-4">
            <MDBInput
              type='password'
              label='Confirm Password'
              id='confirmPassword'
              value={credentials.confirmPassword}
              onChange={handleChange}
              className={`${errors.confirmPassword ? 'is-invalid' : ''}`}
            />
            {errors.confirmPassword && <div className="invalid-feedback">{errors.confirmPassword}</div>}
          </div>

          <MDBBtn 
            type='submit'
            disabled={loading}
            className="w-100 mb-4 rounded-pill py-2 fw-bold"
            color='primary'
          >
            {loading ? (
              <div className="spinner-border spinner-border-sm" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            ) : 'Create Account'}
          </MDBBtn>
        </form>

        {/* Social Registration */}
        <div className="text-center mb-4">
          <p className="text-muted">or sign up with</p>
          <div className="d-flex justify-content-center gap-3">
            {['facebook', 'google', 'github'].map((icon) => (
              <MDBBtn
                key={icon}
                tag='a'
                color='light'
                className="rounded-circle p-2 border"
                style={{ width: '40px', height: '40px' }}
              >
                <MDBIcon fab icon={icon} className={`text-${icon === 'google' ? 'danger' : 'dark'}`} />
              </MDBBtn>
            ))}
          </div>
        </div>

        {/* Login Link */}
        <div className="text-center">
          <span className="text-muted">Already have an account? </span>
          <a href="/login" className="text-primary fw-bold text-decoration-none">
            Login here
          </a>
        </div>
      </MDBContainer>
    </div>
  );
};

export default Register;