import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  name: undefined,
  city: undefined,
  dates: [],
  minPrice: undefined,
  maxPrice: undefined,
};

const searchSlice = createSlice({
  name: 'search',
  initialState,
  reducers: {
    newSearch: (state, action) => {
      return action.payload;
    },
    resetSearch: () => initialState,
  },
});

export const { newSearch, resetSearch } = searchSlice.actions;
export default searchSlice.reducer;