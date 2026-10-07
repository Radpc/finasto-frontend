import { Payment, PaymentMethod, PaymentStatus } from "@/types/apiTypes";
import { API } from "../../config/api";
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
  recurringPaymentId?: string;
  hasRecurringPayment?: boolean;
  paymentMethod?: PaymentMethod;
}

type IGetPaymentSumsQuery = Omit<IListPaymentsParams, "page" | "pageSize">;

export class PaymentService {
  static getPayments(params: IListPaymentsParams) {
    const url = "/payments";
    type Response = ControllerResponse<PaginatedResponse<Payment>>;

    return API.get<Response>(url, { params });
  }

  static getPayment(paymentId: string) {
    const url = "/payments/" + paymentId;
    type Response = ControllerResponse<Payment>;

    return API.get<Response>(url);
  }

  static getPaymentSums(params: IGetPaymentSumsQuery) {
    const url = "/payments/value-sum";
    type Response = ControllerResponse<{ gain: number; loss: number }>;

    return API.get<Response>(url, { params });
  }

  static createPayment(payload: ICreatePaymentDTO) {
    const url = "/payments";
    return API.post(url, payload);
  }

  static updatePayment(paymentId: string, payload: IUpdatePaymentDTO) {
    const url = "/payments/" + paymentId;
    return API.patch(url, payload);
  }

  static removePayment(paymentId: string) {
    const url = "/payments/" + paymentId;
    return API.delete(url);
  }
}
