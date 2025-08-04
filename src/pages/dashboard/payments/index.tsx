import { Button } from "@/components/Button";
import "./_style.scss";
import { PaymentService } from "@/services/payment";
import { useState, useMemo, useCallback, useEffect } from "react";
import useSWR from "swr";
import Pagination from "@/components/Pagination";
import {
  IPaymentForm,
  ModalCreatePayment,
} from "./components/modalCreatePayment";
import { formatDate, numberToCurrency } from "@/utils/formatters";
import { Input } from "@/components/Input";
import { KpiPayment } from "./components/kpiPayment";
import { realToNumber } from "@/utils/money";
import { useDebounce } from "@/hooks/useDebounce";
import SvgChevronDown from "@/assets/img/icons/ChevronDown.svg?react";
import { Tag } from "@/types/apiTypes";
import { translatePaymentStatus } from "@/utils/translation";

interface IPagination {
  page: number;
  pageSize: number;
}

interface IFilters {
  searchBy: string;
}

export const PagePayments = () => {
  const [totalItems, setTotalItems] = useState(0);
  const [pagination, setPagination] = useState<IPagination>({
    page: 1,
    pageSize: 10,
  });
  const [filters, setFilters] = useState<IFilters>({
    searchBy: "",
  });

  const [searchByRaw, setSearchByRaw] = useState("");
  const debounceSearchRaw = useDebounce(searchByRaw);
  useEffect(() => {
    setFilters((l) => ({ ...l, searchBy: debounceSearchRaw }));
  }, [debounceSearchRaw]);

  const paymentsSWRKey = useMemo(() => {
    return `/payments/${JSON.stringify(filters)}&${JSON.stringify(pagination)}`;
  }, [filters, pagination]);

  const fetchPayments = useCallback(
    async (pagination: IPagination, filters: IFilters) => {
      console.log(filters);
      const { data } = await PaymentService.getPayments({
        page: pagination.page,
        pageSize: pagination.pageSize,
        searchBy: filters.searchBy,
      });

      const res = data.data;
      setTotalItems(res.pagination.total);

      return res.items;
    },
    []
  );

  const paymentsSWR = useSWR(paymentsSWRKey, () =>
    fetchPayments(pagination, filters)
  );

  const [modalCreate, setModalCreate] = useState<{ visible: boolean }>({
    visible: false,
  });

  const onCreatePayment = async (form: IPaymentForm) => {
    try {
      await PaymentService.createPayment({
        accountId: form.account.id,
        categoryId: form.category.id,
        description: form.description,
        paymentDate: form.paymentDate,
        status: form.status,
        paymentMethod: form.paymentMethod,
        value: realToNumber(form.value) * (form.isOutcome ? -1 : 1),
        observation: form.observation,
        tagIds: form.tags.map((t) => t.id),
      });
      setModalCreate({ visible: false });
      paymentsSWR.mutate();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="page payments">
      <ModalCreatePayment
        visible={modalCreate.visible}
        onClose={() => setModalCreate({ visible: false })}
        onSubmit={onCreatePayment}
      />
      <h1>Pagamentos</h1>
      <section className="kpis">
        <KpiPayment label="Valor gasto" value="R$ 300" />
      </section>
      <main>
        <div className="above-table">
          <div className="filters">
            <Input
              value={searchByRaw}
              onChange={(e) => setSearchByRaw(e.target.value)}
              noError
              label="Buscar"
              placeholder="Digite aqui"
            />
          </div>

          <Button onClick={() => setModalCreate({ visible: true })}>
            Registrar pagamento
          </Button>
        </div>
        <table>
          <thead>
            <tr>
              <th>Descrição</th>
              <th>Valor</th>
              <th>Categoria</th>
              <th>Tags</th>
              <th>Status</th>
              <th>Data do pagamento</th>
              <th>Adicionado em</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {paymentsSWR.isLoading ? (
              <tr>Is loading</tr>
            ) : paymentsSWR.error || !paymentsSWR.data ? (
              <tr>Error</tr>
            ) : (
              paymentsSWR.data.map((p) => (
                <tr key={"payment_" + p.id}>
                  <td>{p.description}</td>
                  <td>
                    <div className="price-label">
                      <SvgChevronDown
                        className={p.value < 0 ? "red" : "green"}
                      />
                      <span>R$ {numberToCurrency(Math.abs(p.value))}</span>
                    </div>
                  </td>
                  <td>{p.category?.label}</td>
                  <td>
                    {!p.tags || p.tags.length === 0 ? (
                      <span>Sem tags</span>
                    ) : (
                      p.tags?.map((t) => (
                        <PaymentTagLabel
                          tag={t}
                          key={"t_" + p.id + "_" + t.id}
                        />
                      ))
                    )}
                  </td>

                  <td>{translatePaymentStatus[p.status]}</td>
                  <td>{formatDate(p.paymentDate)}</td>
                  <td>{formatDate(p.createdAt)}</td>
                  <td>Actions</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        <Pagination
          currentPage={pagination.page}
          totalPages={Math.ceil(totalItems / pagination.pageSize)}
          onPageClick={(page) => setPagination((l) => ({ ...l, page }))}
        />
      </main>
    </div>
  );
};

interface IProps {
  tag: Tag;
}

const PaymentTagLabel = ({ tag }: IProps) => {
  return <div className="component payment-tag-label">{tag.label}</div>;
};
