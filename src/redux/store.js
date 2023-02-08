import {
  configureStore,
  createAsyncThunk,
  createEntityAdapter,
  createSlice,
} from "@reduxjs/toolkit";
import { objectIdToString } from "../utils";
import assessmentsSlice from "./assessmentsSlice";
import usersSlice from "./usersSlice";

export const store = configureStore({
  reducer: {
    assessments: assessmentsSlice.reducer,
    users: usersSlice.reducer,
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});
