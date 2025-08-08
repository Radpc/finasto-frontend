import { PaymentStatus } from "@/types/apiTypes";

export const translatePaymentStatus: { [S in PaymentStatus]: string } = {
  [PaymentStatus.Paid]: "Pago",
  [PaymentStatus.Predicted]: "Previsto",
  [PaymentStatus.Pending]: "Pendente",
};
