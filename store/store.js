import { configureStore } from "@reduxjs/toolkit";
import quizResultReducer from './QuizResultSlice';

const store = configureStore({reducer: {quizResult: quizResultReducer}});

export default store;