import { RecurringPayment } from "@/types/apiTypes";
import { API } from "../../config/api";
import { ControllerResponse, PaginatedResponse } from "@/types/apiResponses";
import { ICreateRecurringPaymentDTO } from "./DTO/create-recurring-payment";

interface IListRecurringPaymentsParams {
  page: number;
  pageSize: number;

  accountId?: string;
}

export class RecurringPaymentService {
  static getRecurringPayment(recurringPaymentId: string) {
    const url = "/recurring-payments/" + recurringPaymentId;
    type Response = ControllerResponse<RecurringPayment>;
    return API.get<Response>(url);
  }

  static getRecurringPayments(params: IListRecurringPaymentsParams) {
    const url = "/recurring-payments";
    type Response = ControllerResponse<PaginatedResponse<RecurringPayment>>;
    return API.get<Response>(url, { params });
  }

  static createRecurringPayment(payload: ICreateRecurringPaymentDTO) {
    const url = "/recurring-payments";
    return API.post(url, payload);
  }
}
