import {
  createAsyncThunk,
  createEntityAdapter,
  createSlice,
} from "@reduxjs/toolkit";
import { objectIdToString } from "../utils";

const usersAdapter = createEntityAdapter({
  selectId: entity => entity._id,
});
const usersSlice = createSlice({
  name: "users",
  initialState: usersAdapter.getInitialState({
    status: "idle",
    error: "",
  }),
});

export default usersSlice;
