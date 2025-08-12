import { Option } from "@/components/Select";
import { PaymentStatus } from "@/types/apiTypes";

export const paymentStatusOptions: Option<PaymentStatus>[] = [
  { label: "Pago", value: PaymentStatus.Paid },
  { label: "Pendente", value: PaymentStatus.Pending },
  { label: "Previsto", value: PaymentStatus.Predicted },
];
