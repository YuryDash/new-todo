import { PayloadAction, createSlice } from "@reduxjs/toolkit";

export type RequestStatusType = "idle" | "loading" | "succeeded" | "failed";

const initialState = {
  status: "loading" as RequestStatusType,
  error: null as null | string,
};

const slice = createSlice({
  name: "app",
  initialState,
  reducers: {
    setAppStatus: (state, action: PayloadAction<{ status: RequestStatusType }>) => {
      state.status = action.payload.status;
    },
    setAppError: (state, action: PayloadAction<{ error: string | null }>) => {
      state.error = action.payload.error;
    },
  },
});
export const appReducer = slice.reducer;
export const appActions = slice.actions;
export type appInitialStateType = ReturnType<typeof slice.getInitialState>;