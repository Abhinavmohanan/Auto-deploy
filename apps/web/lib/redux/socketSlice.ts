import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { io } from "socket.io-client";

const initialState: any = {
  socket: io(process.env.NEXT_PUBLIC_LOG_SERVER!, { autoConnect: false }),
};

export const socketSlice = createSlice({
  name: "socket",
  initialState,
  reducers: {
    socketConnect: (state) => {
      state.socket.connect();
    },
    socketDisconnect: (state) => {
      state.socket.disconnect();
    },
    socketOnConnect: (state, action: PayloadAction<any>) => {
      state.socket.on("connect", action.payload);
    },
    socketOnDisconnect: (state, action: PayloadAction<any>) => {
      state.socket.on("disconnect", action.payload);
    },
    socketListen: (state, action: PayloadAction<any>) => {
      state.socket.on(action.payload.event, action.payload.callback);
    },
    socketEmit: (state, action: PayloadAction<any>) => {
      state.socket.emit(action.payload.event, action.payload.data);
    },
    socketStopListening: (state, action: PayloadAction<any>) => {
      state.socket.off(action.payload.event);
    },
  },
});

export const {
  socketConnect,
  socketDisconnect,
  socketListen,
  socketEmit,
  socketStopListening,
  socketOnConnect,
  socketOnDisconnect,
} = socketSlice.actions;

export const selectSocket = (state: any) => state.socket;

export default socketSlice.reducer as any;
