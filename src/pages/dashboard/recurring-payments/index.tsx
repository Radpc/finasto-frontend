import Pagination from "@/components/Pagination";
import { useCallback, useMemo, useState } from "react";
import useSWR from "swr";
import {
  IRecurringPaymentForm,
  ModalCreateRecurringPayment,
} from "./components/modalCreateRecurringPayment";
import { Button } from "@/components/Button";
import { RecurringPaymentService } from "@/services/recurring-payment";
import { currencyToNumber } from "@/utils/money";
import "./_style.scss";

import SvgOptionDots from "@/assets/img/icons/OptionDots.svg?react";
import { Dropdown } from "@/components/Dropdown";
import { RecurringPayment } from "@/types/apiTypes";
import { Input } from "@/components/Input";
import { ModalVisualizeRecurringPayment } from "./components/modalVisualizeRecurringPayment";
import { formatDate, numberToCurrency } from "@/utils/formatters";

interface IPagination {
  page: number;
  pageSize: number;
}

interface IFilters {
  searchBy: string;
}

export const PageRecurringPayments = () => {
  const [totalItems, setTotalItems] = useState(0);
  const [pagination, setPagination] = useState<IPagination>({
    page: 1,
    pageSize: 10,
  });
  const [filters] = useState<IFilters>({
    searchBy: "",
  });

  const recurringPaymentsSWRKey = useMemo(() => {
    return `/recurring-payments/${JSON.stringify(filters)}&${JSON.stringify(
      pagination
    )}`;
  }, [filters, pagination]);

  const fetchRecurringPayments = useCallback(
    async (pagination: IPagination, filters: IFilters) => {
      console.log(filters);
      const { data } = await RecurringPaymentService.getRecurringPayments({
        page: pagination.page,
        pageSize: pagination.pageSize,
      });

      const res = data.data;
      setTotalItems(res.pagination.total);

      return res.items;
    },
    []
  );

  const recurringPaymentsSWR = useSWR(recurringPaymentsSWRKey, () =>
    fetchRecurringPayments(pagination, filters)
  );

  const [modalCreate, setModalCreate] = useState<{ visible: boolean }>({
    visible: false,
  });

  const onCreateRecurringPayment = async (form: IRecurringPaymentForm) => {
    try {
      await RecurringPaymentService.createRecurringPayment({
        accountId: form.account.id,
        automaticPayment: form.automaticPayment,
        categoryId: form.category.id,
        dayOfMonth: parseInt(form.dayOfMonth),
        description: form.description,
        paymentMethod: form.paymentMethod,
        singlePaymentValue:
          currencyToNumber(form.singlePaymentValue) * (form.isOutcome ? -1 : 1),
        startDateFrom: form.startFromDate,
        numberOfInstallments: form.numberOfInstallments
          ? parseInt(form.numberOfInstallments)
          : undefined,
        totalValue: form.totalValue
          ? currencyToNumber(form.totalValue) * (form.isOutcome ? -1 : 1)
          : undefined,
      });
      setModalCreate({ visible: false });
      recurringPaymentsSWR.mutate();
    } catch (err) {
      console.log(err);
    }
  };

  // Modals
  const [modalVisualize, setModalVisualize] = useState({
    visible: false,
    recurringPayment: undefined as undefined | RecurringPayment,
  });

  return (
    <div className="page recurring-payments">
      <ModalCreateRecurringPayment
        visible={modalCreate.visible}
        onClose={() => setModalCreate({ visible: false })}
        onSubmit={onCreateRecurringPayment}
      />
      {modalVisualize.recurringPayment && (
        <ModalVisualizeRecurringPayment
          recurringPayment={modalVisualize.recurringPayment}
          onClose={() => setModalVisualize((l) => ({ ...l, visible: false }))}
          visible={modalVisualize.visible}
        />
      )}
      <h1>Pagamentos recorrentes</h1>

      <main>
        <div className="above-table">
          <div className="filters">
            <Input
              noError
              label="Buscar"
              placeholder="Digite aqui"
              className="big-search"
            />
          </div>
          <Button onClick={() => setModalCreate({ visible: true })}>
            Criar pagamento recorrente
          </Button>
        </div>
        <table className="default-table">
          <thead>
            <tr>
              <th>Descrição</th>
              <th>Valor total</th>
              <th>Valor individual</th>
              <th>Parcelas</th>
              <th>Adicionado em</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {recurringPaymentsSWR.isLoading ? (
              <tr>Is loading</tr>
            ) : recurringPaymentsSWR.error || !recurringPaymentsSWR.data ? (
              <tr>Error</tr>
            ) : (
              recurringPaymentsSWR.data.map((rp) => (
                <tr key={"recurring_payment" + rp.id}>
                  <td>{rp.description}</td>
                  <td>
                    {rp.totalValue
                      ? "R$ " + numberToCurrency(Math.abs(rp.totalValue))
                      : "S/N"}
                  </td>
                  <td>
                    R$ {numberToCurrency(Math.abs(rp.singlePaymentValue))}
                  </td>
                  <td>
                    {rp.numberOfInstallments
                      ? "x" + rp.numberOfInstallments
                      : "S/N"}
                  </td>
                  <td>{formatDate(rp.createdAt)}</td>
                  <td>
                    <Dropdown
                      buttons
                      from={(props) => (
                        <button className="btn-dropdown" {...props}>
                          <SvgOptionDots />
                        </button>
                      )}
                    >
                      <button
                        onClick={() =>
                          setModalVisualize({
                            visible: true,
                            recurringPayment: rp,
                          })
                        }
                      >
                        Visualizar
                      </button>
                      <button disabled>Editar</button>
                      <button disabled>Excluir</button>
                    </Dropdown>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        <Pagination
          className="pagination"
          currentPage={pagination.page}
          totalPages={Math.ceil(totalItems / pagination.pageSize)}
          onPageClick={(page) => setPagination((l) => ({ ...l, page }))}
        />
      </main>
    </div>
  );
};
