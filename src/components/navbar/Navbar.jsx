import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import './navbar.css';
import {
  MDBNavbar,
  MDBNavbarBrand,
  MDBNavbarToggler,
  MDBNavbarNav,
  MDBNavbarItem,
  MDBNavbarLink,
  MDBBtn,
  MDBCollapse,
  MDBIcon
} from 'mdb-react-ui-kit';
import { useSelector } from 'react-redux';
import DropDownAccount from "../dropDownAccount/DropDownAccount";

const Navbar = () => {
  const navigate = useNavigate();
  const [openBasic, setOpenBasic] = useState(false);
  const { user } = useSelector(state => state.auth);
  console.log('user >> ', user)
  return (
    <MDBNavbar expand='lg' light bgColor='light' className='mdb-navbar-custom shadow-sm'>
      <MDBNavbarBrand 
        href='/' 
        className='ms-3' 
        onClick={(e) => {
          e.preventDefault();
          navigate('/');
        }}
      >
        <img
          src='/assets/Logo/Company=Logo.png'
          height='40'
          alt='Logo'
          loading='lazy'
        />
      </MDBNavbarBrand>

      <MDBNavbarToggler
        aria-controls='navbarContent'
        onClick={() => setOpenBasic(!openBasic)}
      >
        <MDBIcon icon='bars' />
      </MDBNavbarToggler>

      <MDBCollapse navbar open={openBasic} className='justify-content-end'>
        <MDBNavbarNav className='mb-2 mb-lg-0 align-items-center'>
          <MDBNavbarItem className='mx-2'>
            <MDBNavbarLink href='/chatbot'>About</MDBNavbarLink>
          </MDBNavbarItem>

          {user ? (
            <MDBNavbarItem className='mx-2'>
              <DropDownAccount />
            </MDBNavbarItem>
          ) : (
            <>
              <MDBNavbarItem className='mx-2'>
                <MDBBtn 
                  outline 
                  color='primary' 
                  className='px-4'
                  onClick={() => navigate('/register')}
                >
                  Register
                </MDBBtn>
              </MDBNavbarItem>
              <MDBNavbarItem className='mx-2'>
                <MDBBtn 
                  color='primary' 
                  className='px-4'
                  onClick={() => navigate('/login')}
                >
                  Login
                </MDBBtn>
              </MDBNavbarItem>
            </>
          )}
        </MDBNavbarNav>
      </MDBCollapse>
    </MDBNavbar>
  );
};

export default Navbar;
