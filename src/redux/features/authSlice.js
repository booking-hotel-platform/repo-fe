import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import Cookies from 'js-cookie'; // Thêm import


// Async Thunk Register
export const register = createAsyncThunk(
  'auth/register',
  async (credentials, { rejectWithValue }) => {
    try {
      await axios.post(`${process.env.REACT_APP_API_URL}/auth/signup`, credentials);
      return true;
      // Giả định API trả về user data trong response.data.user
    } catch (error) {
      return rejectWithValue(error.response.data.errors[0] || 'Đăng ký thất bại');
    }
  }
);

// Async Thunk Login
export const login = createAsyncThunk(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/auth/signin`, credentials, {
        withCredentials: true 
      });
      return response.data; 
    } catch (error) {
      return rejectWithValue(error.response.data.errors[0] || 'Đăng nhập thất bại');
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: JSON.stringify(Cookies.get('access_token')) || null, 
    error: null
  },
  reducers: {
    logout: (state) => {
      state.user = null;
      Cookies.remove('access_token'); 
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.fulfilled, (state, action) => {
        state.user = action.payload.accessToken;
        // if(Cookies.get('access_token') == null) {
        //   Cookies.set('access_token', JSON.stringify(action.payload.accessToken), { 
        //     expires: 7, 
        //     secure: process.env.NODE_ENV === 'production',
        //     sameSite: 'None'
        //   });
        // }
      })
      .addCase(login.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.user = action.payload;
      })
      .addCase(register.rejected, (state, action) => {
        state.error = action.payload;
      });
  }
});


export const { logout } = authSlice.actions;
export default authSlice.reducer;
