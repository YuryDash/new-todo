import { AppActionsType, setAppError, setAppStatus } from "app/app-reducer";
import { Dispatch } from "redux";
import { ResponseType } from "api/todolists-api";

export const handleServerAppError = <T>(dispatch: ErrorUtilsDispatchType, data: ResponseType<T>) => {
  if (data.messages.length) {
    dispatch(setAppStatus("idle"));
    dispatch(setAppError(data.messages[0]));
  } else {
    dispatch(setAppError('some error'))
  }
  dispatch(setAppError(data.messages[0]));
}

export const handleServerNetworkError = (dispatch: ErrorUtilsDispatchType , error: {message: string}) => {
  dispatch( setAppStatus('idle') )
  dispatch( setAppError(error.message) )
}
type ErrorUtilsDispatchType = Dispatch<AppActionsType>