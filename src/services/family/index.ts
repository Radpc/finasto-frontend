import { API, getAuthorizedHeader } from "@/config/api";
import { ControllerResponse, PaginatedResponse } from "@/types/apiResponses";
import { Family } from "@/types/apiTypes";

interface IListFamiliesQuery {
  page: number;
  pageSize: number;
  name?: string;
}

type ICreateFamilyRemove = Pick<Family, "id" | "createdAt" | "updatedAt">;
type ICreateFamily = Omit<Family, keyof ICreateFamilyRemove>;

export class FamilyService {
  static getFamilies(params: IListFamiliesQuery) {
    const url = "/families";
    type Response = ControllerResponse<PaginatedResponse<Family>>;

    return API.get<Response>(url, {
      headers: getAuthorizedHeader(),
      params,
    });
  }

  static createFamily(payload: ICreateFamily) {
    const url = "/families";
    type Response = ControllerResponse<Family>;
    return API.post<Response>(url, payload, { headers: getAuthorizedHeader() });
  }
}
