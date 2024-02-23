import { PayloadAction, createSlice } from "@reduxjs/toolkit";

const initialState: string[] = [];

export const logSlice = createSlice({
  name: "logs",
  initialState,
  reducers: {
    addLog: (state, action: PayloadAction<any>) => {
      state.push(action.payload);
    },
    clearLogs: (state) => {
      state = [];
      return state;
    },
  },
});

export const { addLog, clearLogs } = logSlice.actions;

export const logSelector = (state: any): string[] => state.logs;

export default logSlice.reducer as any;
