import { ICreatePaymentDTO } from "./create-payment";

type IUpdatePaymentRemove = Pick<ICreatePaymentDTO, "createdBy" | "accountId">;
export type IUpdatePaymentDTO = Partial<
  Omit<ICreatePaymentDTO, keyof IUpdatePaymentRemove>
>;
