import { ResponseType } from "api/todolists-api";
import { appActions } from "app/app-reducer";
import { AppThunkDispatch } from "app/store";
import axios from "axios";
import { Dispatch } from "redux";

export const handleServerAppError = <T>(dispatch: Dispatch, data: ResponseType<T>) => {
  if (data.messages.length) {
    dispatch(appActions.setAppError({ error: data.messages[0] }));
    dispatch(appActions.setAppStatus({ status: "idle" }));
  } else {
    dispatch(appActions.setAppError({ error: "some error" }));
  }
  dispatch(appActions.setAppStatus({ status: "idle" }));
};

export const _handleServerNetworkError = (dispatch: Dispatch, error: { message: string }) => {
  dispatch(appActions.setAppError({ error: error.message }));
  dispatch(appActions.setAppStatus({ status: "idle" }));
};

export const handleServerNetworkError = (err: unknown, dispatch: AppThunkDispatch):void => {
  let errorMessage = 'Some Error occurred'
  if(axios.isAxiosError(err)){
    errorMessage = err.response?.data?.message || errorMessage
  } else if(err instanceof Error) {
    errorMessage = `NativeError: ${err.message}`
  } else {
    errorMessage = JSON.stringify(err)
  }
  dispatch(appActions.setAppError({error: errorMessage}));
  dispatch(appActions.setAppStatus({status: 'idle'}));

} 