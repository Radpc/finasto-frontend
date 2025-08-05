import { RecurringPayment } from "../../../types/apiTypes";

type ExtraCreateRecurrentPaymentDTO = {
  categoryId: string;
  accountId: string;
  startDateFrom?: string;
};

type ICreateRecurrentPaymentRemove = Pick<
  RecurringPayment,
  "category" | "account" | "payments"
>;

export type ICreateRecurringPaymentDTO = Omit<
  RecurringPayment,
  keyof ICreateRecurrentPaymentRemove | "id" | "createdAt" | "updatedAt"
> &
  ExtraCreateRecurrentPaymentDTO;
