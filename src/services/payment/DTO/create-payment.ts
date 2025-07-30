import { Payment } from "../../../types/apiTypes";

type ExtraCreatePaymentDTO = { tagIds?: string[]; categoryId: string };

type ICreatePaymentRemove = Pick<Payment, "category" | "tags">;

export type ICreatePaymentDTO = Omit<
  Payment,
  keyof ICreatePaymentRemove | "id" | "createdAt" | "updatedAt"
> &
  ExtraCreatePaymentDTO;
