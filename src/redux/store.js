import { configureStore } from '@reduxjs/toolkit';
import authReducer from './features/authSlice';
import searchReducer from './features//searchSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    search: searchReducer,
  }
});

// Tự động lưu user vào localStorage
let currentUser;
store.subscribe(() => {
  const previousUser = currentUser;
  currentUser = store.getState().auth.user;
  
  if (previousUser !== currentUser) {
    if (currentUser) {
      localStorage.setItem('user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('user');
    }
  }
});

export default store;