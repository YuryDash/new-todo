import { ResponseType } from "api/todolists-api";
import { appActions } from "app/app-reducer";
import { AppThunkDispatch } from "app/store";

export const handleServerAppError = <T>(dispatch: AppThunkDispatch, data: ResponseType<T>) => {
  if (data.messages.length) {
    dispatch(appActions.setAppError({ error: data.messages[0] }));
    dispatch(appActions.setAppStatus({ status: "idle" }));
  } else {
    dispatch(appActions.setAppError({ error: "some error" }));
  }
  dispatch(appActions.setAppStatus({ status: "idle" }));
};

export const handleServerNetworkError = (dispatch: AppThunkDispatch, error: { message: string }) => {
  dispatch(appActions.setAppError({ error: error.message }));
  dispatch(appActions.setAppStatus({ status: "idle" }));
};
