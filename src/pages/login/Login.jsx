import React, { useState } from 'react';
import { MDBContainer, MDBInput, MDBCheckbox, MDBBtn, MDBIcon } from 'mdb-react-ui-kit';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { login } from "../../redux/features/authSlice";
import './login.css';

function Login() {
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector(state => state.auth);

  const handleChange = (e) => {
    setCredentials(prev => ({ ...prev, [e.target.id]: e.target.value }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    const resultAction = await dispatch(login(credentials));
    if (login.fulfilled.match(resultAction)) navigate("/");
  };

  return (
    <div className="min-vh-100 d-flex align-items-center bg-light">
      <MDBContainer className="p-5 border rounded-5 shadow-lg bg-white" style={{ maxWidth: '500px' }}>
        {/* Header Section */}
        <div className="text-center mb-5">
          <h2 className="fw-bold mb-3 text-primary">Welcome Back!</h2>
          <p className="text-muted">Please sign in to continue</p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="alert alert-danger alert-dismissible fade show" role="alert">
            {error}
            <button type="button" className="btn-close" data-mdb-close="alert"></button>
          </div>
        )}

        {/* Form Inputs */}
        <div className="mb-4">
        <MDBInput
          label='Username'
          id='username'
          value={credentials.username}
          onChange={handleChange}
          className='border-2 p-2'
          style={{ borderColor: '#dee2e6' }}
        />
      </div>

      <div className="mb-4">
        <MDBInput
          type='password'
          label='Password'
          id='password'
          value={credentials.password}
          onChange={handleChange}
          className='border-2 p-2'
          style={{ borderColor: '#dee2e6' }}
        />
      </div>

        {/* Remember Me & Forgot Password */}
        <div className="d-flex justify-content-between mb-4">
          <MDBCheckbox 
            name='flexCheck' 
            label='Remember me' 
            wrapperClass='text-muted'
          />
          <a href="/forgotPassword" className="text-decoration-none text-primary">
            Forgot password?
          </a>
        </div>

        {/* Submit Button */}
        <MDBBtn 
          onClick={handleLogin}
          disabled={loading}
          className="w-100 mb-4 rounded-pill py-2 fw-bold"
          color='primary'
        >
          {loading ? (
            <div className="spinner-border spinner-border-sm" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          ) : 'Sign In'}
        </MDBBtn>

        {/* Social Login */}
        <div className="text-center mb-4">
          <p className="text-muted">or continue with</p>
          <div className="d-flex justify-content-center gap-3">
            {['facebook', 'twitter', 'google', 'github'].map((icon) => (
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

        {/* Registration Link */}
        <div className="text-center">
          <span className="text-muted">Not a member? </span>
          <a href="/register" className="text-primary fw-bold text-decoration-none">
            Register here
          </a>
        </div>
      </MDBContainer>
    </div>
  );
}

export default Login;