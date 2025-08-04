import { Payment, PaymentStatus } from "@/types/apiTypes";
import { API, getAuthorizedHeader } from "../../config/api";
import { ICreatePaymentDTO } from "./DTO/create-payment";
import { ControllerResponse, PaginatedResponse } from "@/types/apiResponses";

interface IListPaymentsParams {
  page: number;
  pageSize: number;
  searchBy?: string;
  minValue?: number;
  maxValue?: number;
  since?: string;
  until?: string;
  categoryId?: string;
  status?: PaymentStatus;
  tagIds?: string[];
  familyId?: string;
  accountId?: string;
}

export class PaymentService {
  static getPayments(params: IListPaymentsParams) {
    const url = "/payments";
    type Response = ControllerResponse<PaginatedResponse<Payment>>;

    return API.get<Response>(url, { headers: getAuthorizedHeader(), params });
  }

  static createPayment(payload: ICreatePaymentDTO) {
    const url = "/payments";
    return API.post(url, payload, { headers: getAuthorizedHeader() });
  }
}
