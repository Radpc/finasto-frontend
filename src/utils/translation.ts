import { PaymentMethod, PaymentStatus } from "@/types/apiTypes";

export const translatePaymentStatus: { [S in PaymentStatus]: string } = {
  [PaymentStatus.Paid]: "Pago",
  [PaymentStatus.Predicted]: "Previsto",
  [PaymentStatus.Pending]: "Pendente",
};

export const translatePaymentMethod: { [S in PaymentMethod]: string } = {
  [PaymentMethod.Cash]: "Dinheiro",
  [PaymentMethod.Credit]: "Crédito",
  [PaymentMethod.Debit]: "Débito",
  [PaymentMethod.Pix]: "PIX",
};
