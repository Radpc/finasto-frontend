import { RecurringPayment } from "@/types/apiTypes";
import { API, getAuthorizedHeader } from "../../config/api";
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
    return API.get<Response>(url, { headers: getAuthorizedHeader() });
  }

  static getRecurringPayments(params: IListRecurringPaymentsParams) {
    const url = "/recurring-payments";
    type Response = ControllerResponse<PaginatedResponse<RecurringPayment>>;
    return API.get<Response>(url, { headers: getAuthorizedHeader(), params });
  }

  static createRecurringPayment(payload: ICreateRecurringPaymentDTO) {
    const url = "/recurring-payments";
    return API.post(url, payload, { headers: getAuthorizedHeader() });
  }
}
