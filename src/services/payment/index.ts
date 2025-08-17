import { Payment, PaymentMethod, PaymentStatus } from "@/types/apiTypes";
import { API, getAuthorizedHeader } from "../../config/api";
import { ICreatePaymentDTO } from "./DTO/create-payment";
import { ControllerResponse, PaginatedResponse } from "@/types/apiResponses";
import { IUpdatePaymentDTO } from "./DTO/update-payment";

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
  hasRecurringPayment?: boolean;
  paymentMethod?: PaymentMethod;
}

type IGetPaymentSumsQuery = Omit<IListPaymentsParams, "page" | "pageSize">;

export class PaymentService {
  static getPayments(params: IListPaymentsParams) {
    const url = "/payments";
    type Response = ControllerResponse<PaginatedResponse<Payment>>;

    return API.get<Response>(url, { headers: getAuthorizedHeader(), params });
  }

  static getPayment(paymentId: string) {
    const url = "/payments/" + paymentId;
    type Response = ControllerResponse<Payment>;

    return API.get<Response>(url, { headers: getAuthorizedHeader() });
  }

  static getPaymentSums(params: IGetPaymentSumsQuery) {
    const url = "/payments/value-sum";
    type Response = ControllerResponse<{ gain: number; loss: number }>;

    return API.get<Response>(url, { headers: getAuthorizedHeader(), params });
  }

  static createPayment(payload: ICreatePaymentDTO) {
    const url = "/payments";
    return API.post(url, payload, { headers: getAuthorizedHeader() });
  }

  static updatePayment(paymentId: string, payload: IUpdatePaymentDTO) {
    const url = "/payments/" + paymentId;
    return API.patch(url, payload, { headers: getAuthorizedHeader() });
  }
}
