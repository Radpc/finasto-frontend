import { API } from "@/config/api";
import { ControllerResponse, PaginatedResponse } from "@/types/apiResponses";
import { Tag } from "@/types/apiTypes";

interface IListTagsQuery {
  page: number;
  pageSize: number;
  searchBy?: string;
}

type ICreateTagRemove = Pick<Tag, "id" | "createdAt" | "updatedAt">;
type ICreateTagAdd = { familyId: string };
type ICreateTag = Omit<Tag, keyof ICreateTagRemove> & ICreateTagAdd;

export class TagService {
  static getTags(params: IListTagsQuery) {
    const url = "/tags";
    type Response = ControllerResponse<PaginatedResponse<Tag>>;

    return API.get<Response>(url, {
      params,
    });
  }

  static createTag(payload: ICreateTag) {
    const url = "/tags";
    type Response = ControllerResponse<Tag>;
    return API.post<Response>(url, payload);
  }
}
