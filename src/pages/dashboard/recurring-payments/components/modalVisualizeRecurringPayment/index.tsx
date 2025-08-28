import Modal, { ModalProps } from "@/components/Modal";
import { Payment, RecurringPayment } from "@/types/apiTypes";
import SvgCross from "@/assets/img/icons/Cross.svg?react";
import useSWR from "swr";
import { useCallback, useMemo, useState } from "react";
import { RecurringPaymentService } from "@/services/recurring-payment";
import { PaymentService } from "@/services/payment";
import "./_style.scss";
import Skeleton from "@mui/material/Skeleton";
import { formatDate, numberToCurrency } from "@/utils/formatters";
import { PaymentStatusTag } from "@/components/Tags/PaymentStatusTag";
import Pagination from "@/components/Pagination";
import { PaymentMethodTag } from "@/components/Tags/PaymentMethodTag";

interface IProps extends Pick<ModalProps, "visible" | "onClose"> {
  recurringPayment: RecurringPayment;
}

interface IPagination {
  page: number;
  pageSize: number;
}

export const ModalVisualizeRecurringPayment = ({
  onClose,
  recurringPayment,
  visible,
}: IProps) => {
  // Recurring payment
  const fetchRecurringPayment = useCallback(
    async (recurringPaymentId: string) => {
      const res = await RecurringPaymentService.getRecurringPayment(
        recurringPaymentId
      );
      return res.data.data;
    },
    []
  );

  const recurringPaymentSWRKey = useMemo(() => {
    return "/recurring-payment/" + recurringPayment.id;
  }, [recurringPayment]);

  const recurringPaymentSWR = useSWR(recurringPaymentSWRKey, () =>
    fetchRecurringPayment(recurringPayment.id)
  );

  const rp = recurringPaymentSWR.data || recurringPayment;

  // Payments
  const [paymentPagination, setPaymentPagination] = useState({
    page: 1,
    pageSize: 3,
  });
  const [totalPayments, setTotalPayments] = useState(0);

  const fetchPayments = useCallback(
    async (pagination: IPagination) => {
      const res = await PaymentService.getPayments({
        page: pagination.page,
        pageSize: pagination.pageSize,
        recurringPaymentId: recurringPayment.id,
      });
      setTotalPayments(res.data.data.pagination.total);
      return res.data.data.items;
    },
    [recurringPayment]
  );

  const paymentsSWRKey = useMemo(() => {
    return (
      "/payments/?recurringPayment=" +
      recurringPayment.id +
      "_" +
      JSON.stringify(paymentPagination)
    );
  }, [recurringPayment, paymentPagination]);

  const paymentsSWR = useSWR(paymentsSWRKey, () =>
    fetchPayments(paymentPagination)
  );

  return (
    <Modal
      onClose={onClose}
      visible={visible}
      className="modal visualize-recurring-payment default-header"
    >
      <header>
        <h1>Visualizar pagamento recorrente</h1>
        <SvgCross onClick={onClose} className="close" />
      </header>
      <main>
        <h2>Geral</h2>
        <section className="general">
          <div className="line">
            <div className="team">
              <span className="title">Descrição</span>
              <span className="value">{rp.description}</span>
            </div>
          </div>
          <div className="line">
            <div className="team width-defined">
              <span className="title">Valor</span>
              <span className="value">
                R$ {numberToCurrency(Math.abs(rp.singlePaymentValue))}
              </span>
            </div>

            <div className="team width-defined">
              <span className="title">Pagamento</span>
              <span className="value">
                {rp.automaticPayment ? "Automático" : "Manual"}
              </span>
            </div>

            <div className="team width-defined">
              <span className="title">Dia do pagamento</span>
              <span className="value">{rp.dayOfMonth} todo mês</span>
            </div>
          </div>
          <div className="line">
            <div className="team width-defined">
              <span className="title">Valor total</span>
              <span className="value">
                {rp.totalValue
                  ? "R$ " + numberToCurrency(Math.abs(rp.totalValue))
                  : "S/N"}
              </span>
            </div>
            <div className="team width-defined">
              <span className="title">Parcelas</span>
              <span className="value">
                {rp.numberOfInstallments
                  ? "x" + rp.numberOfInstallments
                  : "S/N"}
              </span>
            </div>
          </div>
        </section>
        <h2>Pagamentos</h2>
        <section className="payments">
          {paymentsSWR.isLoading ? (
            <Skeleton />
          ) : paymentsSWR.error ? (
            <span>Houve um erro</span>
          ) : !paymentsSWR.data || paymentsSWR.data.length === 0 ? (
            <span>Sem pagamentos ainda</span>
          ) : (
            <div className="cards">
              {paymentsSWR.data.map((p) => (
                <PaymentCard key={p.id} payment={p} />
              ))}
            </div>
          )}
          <Pagination
            className="pagination"
            currentPage={paymentPagination.page}
            onPageClick={(n) =>
              setPaymentPagination((l) => ({ ...l, page: n }))
            }
            totalPages={Math.ceil(totalPayments / paymentPagination.pageSize)}
          />
        </section>
      </main>
    </Modal>
  );
};

const PaymentCard = ({ payment }: { payment: Payment }) => {
  return (
    <div className="component payment-card">
      <div className="left-side">
        <span className="date">{formatDate(payment.paymentDate)}</span>
        <span className="value">
          {payment.value < 0 && "-"} R${" "}
          {numberToCurrency(Math.abs(payment.value))}
        </span>
      </div>
      <div className="right-side">
        <PaymentMethodTag tag={payment.paymentMethod} />
        <PaymentStatusTag tag={payment.status} />
      </div>
    </div>
  );
};
