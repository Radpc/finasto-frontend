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

  return (
    <div className="page recurring-payments">
      <ModalCreateRecurringPayment
        visible={modalCreate.visible}
        onClose={() => setModalCreate({ visible: false })}
        onSubmit={onCreateRecurringPayment}
      />
      <h1>Recurring payments</h1>
      <Button onClick={() => setModalCreate({ visible: true })}>
        Create recurring payment
      </Button>
      <main>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Label</th>
              <th>Created at</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {recurringPaymentsSWR.isLoading ? (
              <tr>Is loading</tr>
            ) : recurringPaymentsSWR.error || !recurringPaymentsSWR.data ? (
              <tr>Error</tr>
            ) : (
              recurringPaymentsSWR.data.map((c) => (
                <tr key={"recurring_payment" + c.id}>
                  <td>#{c.id}</td>
                  <td>{c.description}</td>
                  <td>{c.createdAt}</td>
                  <td>Actions</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </main>
      <Pagination
        currentPage={pagination.page}
        totalPages={Math.ceil(totalItems / pagination.pageSize)}
        onPageClick={(page) => setPagination((l) => ({ ...l, page }))}
      />
    </div>
  );
};
