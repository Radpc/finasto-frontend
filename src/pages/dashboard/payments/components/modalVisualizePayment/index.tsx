import Modal, { ModalProps } from "@/components/Modal";
import { Payment } from "@/types/apiTypes";
import "./_stytle.scss";
import { useCallback, useMemo } from "react";
import { PaymentService } from "@/services/payment";
import useSWR from "swr";

interface IProps extends Pick<ModalProps, "visible" | "onClose"> {
  payment: Payment;
}

export const ModalVisualizePayment = ({
  onClose,
  payment: paymentProp,
  visible,
}: IProps) => {
  const swrKey = useMemo(() => {
    return "/payment/" + paymentProp.id;
  }, [paymentProp]);

  const fetchPayment = useCallback(async (paymentId: string) => {
    const res = await PaymentService.getPayment(paymentId);
    return res.data.data;
  }, []);

  const swr = useSWR(swrKey, () => fetchPayment(paymentProp.id));

  const payment = swr.data || paymentProp;

  return (
    <Modal
      onClose={onClose}
      visible={visible}
      className="modal modal-visualize-payment default-header"
    >
      <header>
        <h1>Visualizar pagamento</h1>
      </header>
      <main>{payment.createdBy?.name || "Sem usuário"}</main>
    </Modal>
  );
};
