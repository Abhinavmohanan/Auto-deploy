import { configureStore, Store } from "@reduxjs/toolkit";
import socketReducer, { socketSlice } from "./socketSlice";
import logReducer, { logSlice } from "./logSlice";

export const store: Store = configureStore({
  reducer: { [socketSlice.name]: socketReducer, [logSlice.name]: logReducer },
  middleware: (getDefaultMiddleware) => {
    return getDefaultMiddleware({
      serializableCheck: false,
    });
  },
});
