import { appActions } from "app/app-reducer";
import { AppDispatch } from "app/store";
import axios from "axios";

export const handleServerNetworkError = (err: unknown, dispatch: AppDispatch):void => {
  let errorMessage = 'Some Error occurred'
  if(axios.isAxiosError(err)){
    errorMessage = err.response?.data?.message || err.message || errorMessage
  } else if(err instanceof Error) {
    errorMessage = `NativeError: ${err.message}`
  } else {
    errorMessage = JSON.stringify(err)
  }
  dispatch(appActions.setAppError({error: errorMessage}));
  dispatch(appActions.setAppStatus({status: 'idle'}));
} 