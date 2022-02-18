import { createSlice } from "@reduxjs/toolkit";

const quizResultSlice = createSlice({
   name: 'quizResult', 
   initialState: {results: []},
   reducers: {
       addResult: (state, action) => {
        state.results.push(action.payload);
       },
       clearResult: (state, action) => {
           state.results = [];
       }
   }
});

export const {addResult, clearResult} = quizResultSlice.actions;
export default quizResultSlice.reducer;