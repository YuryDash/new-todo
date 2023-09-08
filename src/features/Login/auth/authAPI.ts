import {FormType} from "features/Login/Login";
import {instance, BaseResponseType} from "common/api/todolists-api";


export const authAPI = {
  login(data: FormType) {
    return instance.post<BaseResponseType<{ userId: number }>>("auth/login", data);
  },
  logout() {
    return instance.delete<BaseResponseType>("auth/login");
  },
  logMe() {
    return instance.get<BaseResponseType<{ id: number; email: string; login: string }>>("auth/me");
  },
}