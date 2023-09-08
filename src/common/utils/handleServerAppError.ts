import { BaseResponseType } from "common/api/todolists-api";
import { appActions } from "app/app-reducer";
import { Dispatch } from "redux";


export const handleServerAppError = <T>(dispatch: Dispatch, data: BaseResponseType<T>, show:boolean = true) => {
  if(show){
    if (data.messages.length) {
      dispatch(appActions.setAppError({ error: data.messages[0] }));
      dispatch(appActions.setAppStatus({ status: "idle" }));
    } else {
      dispatch(appActions.setAppError({ error: "some error" }));
    }
  }
  // if (data.messages.length) {
  //   dispatch(appActions.setAppError({ error: data.messages[0] }));
  //   dispatch(appActions.setAppStatus({ status: "idle" }));
  // } else {
  //   dispatch(appActions.setAppError({ error: "some error" }));
  // }
  dispatch(appActions.setAppStatus({ status: "idle" }));
};