import {FormType} from "features/Login/Login";
import {instance, ResponseType} from "common/api/todolists-api";


export const authAPI = {
  login(data: FormType) {
    return instance.post<ResponseType<{ userId: number }>>("auth/login", data);
  },
  logout() {
    return instance.delete<ResponseType>("auth/login");
  },
  logMe() {
    return instance.get<ResponseType<{ id: number; email: string; login: string }>>("auth/me");
  },
}