export type RequestStatusType = "idle" | "loading" | "succeeded" | "failed";

const initialState = {
  status: "loading" as RequestStatusType,
  error: null as null | string,
};

type InitialStateType = typeof initialState;
export type SetStatusType = ReturnType<typeof setAppStatus>;
export type SetAppErrorType = ReturnType<typeof setAppError>;
export const appReducer = (
  state: InitialStateType = initialState,
  action: AppActionsType,
): InitialStateType => {
  switch (action.type) {
    case "APP/SET_STATUS":
      return { ...state, status: action.payload.status };
    case "APP/SET_ERROR":
      return { ...state, error: action.payload.errorMessage };
    default:
      return state;
  }
};

export const setAppStatus = (status: RequestStatusType) => {
  return {
    type: "APP/SET_STATUS",
    payload: { status },
  } as const;
};

export const setAppError = (errorMessage: string | null) => {
  return {
    type: "APP/SET_ERROR",
    payload: {
      errorMessage,
    },
  } as const;
};
export type AppActionsType = SetStatusType | SetAppErrorType;
