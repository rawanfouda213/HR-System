import { RoleResponse } from "./role-response";

export interface LoginResponse {
  token: string;
  role: RoleResponse;
}
