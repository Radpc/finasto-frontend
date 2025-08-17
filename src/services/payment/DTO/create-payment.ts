import { Payment } from "../../../types/apiTypes";

type ExtraCreatePaymentDTO = {
  tagIds?: string[];
  categoryId: string;
  accountId: string;
};

type ICreatePaymentRemove = Pick<
  Payment,
  "category" | "tags" | "recurringPayment"
>;

export type ICreatePaymentDTO = Omit<
  Payment,
  keyof ICreatePaymentRemove | "id" | "createdAt" | "updatedAt"
> &
  ExtraCreatePaymentDTO;
