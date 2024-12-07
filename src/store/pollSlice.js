import { createSlice } from '@reduxjs/toolkit';

const pollSlice = createSlice({
  name: 'poll',
  initialState: {
    selectedAnswers: [],
    isPollSubmitted: false,
    isLoading: false,
    error: null,
  },
  reducers: {
    setSelectedAnswer: (state, action) => {
      const { stepIndex, answer } = action.payload;
      state.selectedAnswers[stepIndex] = answer;
    },
    submitPollStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    submitPollSuccess: (state) => {
      state.isPollSubmitted = true;
      state.isLoading = false;
    },
    submitPollFailure: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    resetPoll: (state) => {
      state.selectedAnswers = [];
      state.isPollSubmitted = false;
      state.isLoading = false;
      state.error = null;
    },
  },
});

export const {
  setSelectedAnswer,
  submitPollStart,
  submitPollSuccess,
  submitPollFailure,
  resetPoll,
} = pollSlice.actions;

export default pollSlice.reducer;
