import { API } from "@/config/api";
import { ControllerResponse, PaginatedResponse } from "@/types/apiResponses";
import { Account } from "@/types/apiTypes";

interface IListAccountsQuery {
  page: number;
  pageSize: number;
  name?: string;
}

type ICreateAccountRemove = Pick<Account, "id" | "createdAt" | "updatedAt">;
type ICreateAccountAdd = { familyId: string };
type ICreateAccount = Omit<Account, keyof ICreateAccountRemove> &
  ICreateAccountAdd;

export class AccountService {
  static getAccounts(params: IListAccountsQuery) {
    const url = "/accounts";
    type Response = ControllerResponse<PaginatedResponse<Account>>;

    return API.get<Response>(url, {
      params,
    });
  }

  static createAccount(payload: ICreateAccount) {
    const url = "/accounts";
    type Response = ControllerResponse<Account>;
    return API.post<Response>(url, payload);
  }
}
