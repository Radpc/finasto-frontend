import { API, getAuthorizedHeader } from "@/config/api";
import { ControllerResponse, PaginatedResponse } from "@/types/apiResponses";
import { Account } from "@/types/apiTypes";

interface IListAccountsQuery {
  page: number;
  pageSize: number;
  name?: string;
}

type ICreateAccountRemove = Pick<Account, "id" | "createdAt" | "updatedAt">;
type ICreateAccount = Omit<Account, keyof ICreateAccountRemove>;

export class AccountService {
  static getAccounts(params: IListAccountsQuery) {
    const url = "/accounts";
    type Response = ControllerResponse<PaginatedResponse<Account>>;

    return API.get<Response>(url, {
      headers: getAuthorizedHeader(),
      params,
    });
  }

  static createAccount(payload: ICreateAccount) {
    const url = "/accounts";
    type Response = ControllerResponse<Account>;
    return API.post<Response>(url, payload, { headers: getAuthorizedHeader() });
  }
}
