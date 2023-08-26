import { Dispatch } from "redux";
import { FormType } from "../Login";
import { SetAppErrorType, SetStatusType, setAppStatus } from "app/app-reducer";
import { handleServerAppError, handleServerNetworkError } from "utils/error-utils";
import { todolistsAPI } from "api/todolists-api";
const initialState = {
  isLoggedIn: false,
};
type InitialStateType = typeof initialState;

type ActionType = ReturnType<typeof setIsLoggedIn> | SetStatusType | SetAppErrorType
export const authReducer = (state: InitialStateType = initialState, action: ActionType): InitialStateType => {
  switch (action.type) {
    case "AUTH/SET_IS_LOGGED_IN":
      return { ...state, isLoggedIn: action.value };

    default:
      return state;
  }
};

export const setIsLoggedIn = (value: boolean) => {
  return {
    type: "AUTH/SET_IS_LOGGED_IN",
    value,
  };
};

export const loginWatcher = (formData: FormType) => async (dispatch: Dispatch<ActionType>) => {
  dispatch(setAppStatus("loading"));
  try {
    const res = await todolistsAPI.login(formData);
    if( res.data.resultCode === 0 ){
      dispatch(setIsLoggedIn(true))
      dispatch(setAppStatus("idle"));
    } else {
      handleServerAppError(dispatch, res.data  )
    }
  } catch (error) {
    handleServerNetworkError(dispatch, error as {message: string})
  }
};
