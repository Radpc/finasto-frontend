import { API } from "@/config/api";
import { ControllerResponse, PaginatedResponse } from "@/types/apiResponses";
import { User } from "@/types/apiTypes";

interface IListUsersQuery {
  page: number;
  pageSize: number;
  searchBy?: string;
}

type ICreateUserRemove = Pick<
  User,
  "id" | "createdAt" | "updatedAt" | "families"
>;
type ICreateUserAdd = { familyId: string; password: string };
type ICreateUser = Omit<User, keyof ICreateUserRemove> & ICreateUserAdd;

export class UserService {
  static getUsers(params: IListUsersQuery) {
    const url = "/users";
    type Response = ControllerResponse<PaginatedResponse<User>>;

    return API.get<Response>(url, {
      params,
    });
  }

  static createUser(payload: ICreateUser) {
    const url = "/users";
    type Response = ControllerResponse<User>;
    return API.post<Response>(url, payload);
  }
}
