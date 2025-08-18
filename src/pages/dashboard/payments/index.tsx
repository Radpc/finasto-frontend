import { Button } from "@/components/Button";
import "./_style.scss";
import { PaymentService } from "@/services/payment";
import { useState, useMemo, useCallback, useEffect } from "react";
import useSWR from "swr";
import Pagination from "@/components/Pagination";
import {
  IPaymentForm as ICreatePaymentForm,
  ModalCreatePayment,
} from "./components/modalCreatePayment";
import { formatDate, numberToCurrency } from "@/utils/formatters";
import { Input } from "@/components/Input";
import { KpiPayment } from "./components/kpiPayment";
import { currencyToNumber } from "@/utils/money";
import { useDebounce } from "@/hooks/useDebounce";
import SvgChevronDown from "@/assets/img/icons/ChevronDown.svg?react";
import {
  Account,
  Category,
  Payment,
  PaymentMethod,
  PaymentStatus,
  Tag,
} from "@/types/apiTypes";
import { Option, Select } from "@/components/Select";
import { useAccounts } from "@/hooks/swrHooks/useAccounts";
import { useCategories } from "@/hooks/swrHooks/useCategories";
import { useTags } from "@/hooks/swrHooks/useTags";
import { useRedux } from "@/hooks/reduxHooks";
import { SelectDatePicker } from "@/components/SelectDatePicker";
import { DateTime } from "luxon";
import { LoadingLines } from "@/components/Skeleton";
import { EmptyTable } from "@/components/EmptyTable";
import { ErrorTable } from "@/components/ErrorTable";
import SvgSync from "@/assets/img/icons/Sync.svg?react";
import { InfoHover } from "@/components/InfoHover";
import { paymentStatusOptions } from "./utils/paymentStatus";
import { PaymentStatusTag } from "@/components/Tags/PaymentStatusTag";
import SvgCalendar from "@/assets/img/icons/Calendar.svg?react";
import SvgOptionDots from "@/assets/img/icons/OptionDots.svg?react";
import { Dropdown } from "@/components/Dropdown";
import { ModalVisualizePayment } from "./components/modalVisualizePayment";
import { paymentMethodsOptions } from "./utils/paymentMethods";
import {
  IUpdatePaymentForm,
  ModalUpdatePayment,
} from "./components/modalUpdatePayment";
import { ModalRemovePayment } from "./components/modalRemovePayment";

interface IPagination {
  page: number;
  pageSize: number;
}

enum PaymentDirection {
  Income = "Ganho",
  Outcome = "Gasto",
}

const paymentDirectionOptions: Option<PaymentDirection>[] = [
  PaymentDirection.Income,
  PaymentDirection.Outcome,
].map((e) => ({ label: e, value: e }));

interface IFilters {
  searchBy: string;
  tags?: Tag[];
  account?: Account;
  category?: Category;
  since?: string;
  until?: string;
  paymentDirection?: PaymentDirection;
  hasRecurringPayment?: boolean;
  status?: PaymentStatus;
  paymentMethod?: PaymentMethod;
}

const hasRecurringPaymentOptions: Option<boolean>[] = [
  { label: "É recorrente", value: true },
  { label: "Não é recorrente", value: false },
];

export const PagePayments = () => {
  const currentFamily = useRedux((s) => s.session.selectedFamily);

  const [showExtraFilters, setShowExtraFilters] = useState(false);

  const [totalItems, setTotalItems] = useState(0);
  const [pagination, setPagination] = useState<IPagination>({
    page: 1,
    pageSize: 10,
  });
  const [filters, setFilters] = useState<IFilters>({
    searchBy: "",
    since: DateTime.now().startOf("month").toISO(),
    until: DateTime.now().endOf("month").toISO(),
  });

  const datepickerSince = useMemo(() => {
    if (filters.since) {
      return DateTime.fromISO(filters.since).toJSDate();
    }
    return null;
  }, [filters.since]);

  const datepickerUntil = useMemo(() => {
    if (filters.until) {
      return DateTime.fromISO(filters.until).toJSDate();
    }
    return null;
  }, [filters.until]);

  useEffect(() => {
    setPagination((l) => ({ ...l, page: 1 }));
  }, [filters]);

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
      const { data } = await PaymentService.getPayments({
        familyId: currentFamily?.id,
        page: pagination.page,
        since: filters.since,
        until: filters.until,
        pageSize: pagination.pageSize,
        searchBy: filters.searchBy,
        accountId: filters.account?.id,
        categoryId: filters.category?.id,
        tagIds: filters.tags?.map((t) => t.id),
        maxValue:
          filters.paymentDirection === PaymentDirection.Outcome ? 0 : undefined,
        minValue:
          filters.paymentDirection === PaymentDirection.Income ? 0 : undefined,
        hasRecurringPayment: filters.hasRecurringPayment,
        status: filters.status,
        paymentMethod: filters.paymentMethod,
      });

      const res = data.data;
      setTotalItems(res.pagination.total);

      return res.items;
    },
    [currentFamily?.id]
  );

  const paymentsSWR = useSWR(paymentsSWRKey, () =>
    fetchPayments(pagination, filters)
  );

  const paymentsSumSWRKey = useMemo(() => {
    return `/payments-sum/${JSON.stringify(filters)}`;
  }, [filters]);

  const fetchPaymentsSum = useCallback(
    async (filters: IFilters) => {
      const { data } = await PaymentService.getPaymentSums({
        familyId: currentFamily?.id,
        since: filters.since,
        until: filters.until,
        searchBy: filters.searchBy,
        accountId: filters.account?.id,
        categoryId: filters.category?.id,
        tagIds: filters.tags?.map((t) => t.id),
        maxValue:
          filters.paymentDirection === PaymentDirection.Outcome ? 0 : undefined,
        minValue:
          filters.paymentDirection === PaymentDirection.Income ? 0 : undefined,
        hasRecurringPayment: filters.hasRecurringPayment,
        status: filters.status,
        paymentMethod: filters.paymentMethod,
      });

      const res = data.data;

      return res;
    },
    [currentFamily?.id]
  );

  const paymentsSumSWR = useSWR(paymentsSumSWRKey, () =>
    fetchPaymentsSum(filters)
  );

  const [modalCreate, setModalCreate] = useState<{ visible: boolean }>({
    visible: false,
  });

  const [modalVisualize, setModalVisualize] = useState<{
    visible: boolean;
    payment?: Payment;
  }>({
    visible: false,
  });

  const [modalUpdate, setModalUpdate] = useState<{
    visible: boolean;
    payment?: Payment;
  }>({
    visible: false,
  });

  const [modalRemove, setModalRemove] = useState<{
    visible: boolean;
    payment?: Payment;
  }>({
    visible: false,
  });

  const onCreatePayment = async (form: ICreatePaymentForm) => {
    try {
      await PaymentService.createPayment({
        accountId: form.account.id,
        categoryId: form.category.id,
        description: form.description,
        paymentDate: form.paymentDate,
        status: form.status,
        paymentMethod: form.paymentMethod,
        value: currencyToNumber(form.value) * (form.isOutcome ? -1 : 1),
        observation: form.observation,
        tagIds: form.tags.map((t) => t.id),
      });
      paymentsSWR.mutate();
    } catch (err) {
      console.log(err);
      throw err;
    }
  };

  const onUpdatePayment = async (form: IUpdatePaymentForm) => {
    if (!modalUpdate.payment) return;

    try {
      await PaymentService.updatePayment(modalUpdate.payment.id, {
        categoryId: form.category.id,
        description: form.description,
        paymentDate: form.paymentDate,
        status: form.status,
        paymentMethod: form.paymentMethod,
        value: currencyToNumber(form.value) * (form.isOutcome ? -1 : 1),
        observation: form.observation,
        tagIds: form.tags.map((t) => t.id),
      });
      paymentsSWR.mutate();
    } catch (err) {
      console.log(err);
      throw err;
    }
  };

  const onRemovePayment = async () => {
    if (!modalRemove.payment) return;

    try {
      await PaymentService.removePayment(modalRemove.payment.id);
      paymentsSWR.mutate();
    } catch (err) {
      console.log(err);
      throw err;
    }
  };

  const [rawSearchAccount, setRawSearchAccount] = useState("");
  const accounts = useAccounts({ searchBy: rawSearchAccount });

  const [rawSearchCategory, setRawSearchCategory] = useState("");
  const categories = useCategories({ searchBy: rawSearchCategory });

  const [rawSearchTag, setRawSearchTag] = useState("");
  const tags = useTags({ searchBy: rawSearchTag });

  return (
    <div className="page payments">
      <ModalCreatePayment
        visible={modalCreate.visible}
        onClose={() => setModalCreate({ visible: false })}
        onSubmit={onCreatePayment}
      />
      <ModalUpdatePayment
        onSubmit={onUpdatePayment}
        defaultValues={modalUpdate.payment}
        visible={modalUpdate.visible}
        onClose={() => setModalUpdate((l) => ({ ...l, visible: false }))}
      />
      <ModalRemovePayment
        onConfirm={onRemovePayment}
        visible={modalRemove.visible}
        onClose={() => setModalRemove((l) => ({ ...l, visible: false }))}
      />
      {modalVisualize.payment && (
        <ModalVisualizePayment
          payment={modalVisualize.payment}
          visible={modalVisualize.visible}
          onClose={() => setModalVisualize((l) => ({ ...l, visible: false }))}
        />
      )}
      <h1>Pagamentos</h1>
      <section className="kpis">
        <KpiPayment
          label="Total"
          value={
            "R$ " +
            numberToCurrency(
              (paymentsSumSWR.data?.gain || 0) +
                (paymentsSumSWR.data?.loss || 0)
            )
          }
        />
        <KpiPayment
          label="Valor ganho"
          value={"R$ " + numberToCurrency(paymentsSumSWR.data?.gain || 0)}
        />
        <KpiPayment
          label="Valor gasto"
          value={"R$ " + numberToCurrency(paymentsSumSWR.data?.loss || 0)}
        />
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
              className="big-search"
            />
            <SelectDatePicker
              label="Período"
              noError
              clearable
              value={[datepickerSince, datepickerUntil]}
              onDateRangeChange={(firstDate, secondDate) => {
                if (firstDate && secondDate) {
                  const since = DateTime.fromJSDate(firstDate)
                    .startOf("day")
                    .toISO();

                  const until = DateTime.fromJSDate(secondDate)
                    .endOf("day")
                    .toISO();

                  if (since && until) {
                    setFilters((l) => ({
                      ...l,
                      since,
                      until,
                    }));
                  }
                } else {
                  setFilters((l) => ({
                    ...l,
                    since: undefined,
                    until: undefined,
                  }));
                }
              }}
            />
            <span
              className="more-filters-btn"
              onClick={() => setShowExtraFilters((l) => !l)}
            >
              Mais filtros
            </span>
          </div>
          <Button onClick={() => setModalCreate({ visible: true })}>
            Registrar pagamento
          </Button>
        </div>

        <div
          className={
            "more-filters " + (showExtraFilters ? "showing" : "hiding")
          }
        >
          <Select
            className="filter"
            label="Conta"
            placeholder="Selecione"
            compareBy={(a, b) => a?.id === b?.id}
            onChange={(account) => setFilters((f) => ({ ...f, account }))}
            isSearchable
            onSearch={(raw) => setRawSearchAccount(raw)}
            value={filters.account}
            optionsLoading={accounts.isLoading}
            options={accounts.options}
            clearable
            noError
          />

          <Select
            className="filter"
            label="Categoria"
            placeholder="Selecione"
            compareBy={(a, b) => a?.id === b?.id}
            onChange={(category) => setFilters((f) => ({ ...f, category }))}
            isSearchable
            onSearch={(raw) => setRawSearchCategory(raw)}
            value={filters.category}
            optionsLoading={categories.isLoading}
            options={categories.options}
            clearable
            noError
          />

          <Select
            className="filter"
            label="Tags"
            placeholder="Selecione"
            isMulti
            compareBy={(a, b) => a?.id === b?.id}
            onChange={(tags) => setFilters((f) => ({ ...f, tags }))}
            isSearchable
            onSearch={(raw) => setRawSearchTag(raw)}
            value={filters.tags}
            optionsLoading={tags.isLoading}
            options={tags.options}
            clearable
            noError
          />

          <Select
            noError
            className="filter"
            label="Balanço do pagamento"
            placeholder="Selecione"
            clearable
            options={paymentDirectionOptions}
            value={filters.paymentDirection}
            onChange={(paymentDirection) =>
              setFilters((f) => ({ ...f, paymentDirection }))
            }
          />

          <Select
            noError
            className="filter"
            label="Método de pagamento"
            placeholder="Selecione"
            clearable
            options={paymentMethodsOptions}
            value={filters.paymentMethod}
            onChange={(paymentMethod) =>
              setFilters((f) => ({ ...f, paymentMethod }))
            }
          />

          <Select
            noError
            className="filter"
            label="Status"
            placeholder="Selecione"
            clearable
            options={paymentStatusOptions}
            value={filters.status}
            onChange={(status) => setFilters((f) => ({ ...f, status }))}
          />

          <Select
            noError
            className="filter"
            label="Recorrente"
            placeholder="Selecione"
            options={hasRecurringPaymentOptions}
            value={filters.hasRecurringPayment}
            clearable
            onChange={(hasRecurringPayment) =>
              setFilters((f) => ({ ...f, hasRecurringPayment }))
            }
          />
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
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {paymentsSWR.isLoading ? (
              <LoadingLines lines={10} length={8} />
            ) : paymentsSWR.error ? (
              <ErrorTable colSpan={8} />
            ) : !paymentsSWR.data ? (
              <EmptyTable colSpan={8} />
            ) : (
              paymentsSWR.data.map((p) => (
                <tr key={"payment_" + p.id}>
                  <td>
                    <span className="description">
                      {p.recurringPayment && (
                        <InfoHover from={<SvgSync />}>
                          {p.observation}{" "}
                          {p.recurringPayment.totalValue
                            ? "- R$ " +
                              numberToCurrency(
                                Math.abs(p.recurringPayment.totalValue)
                              )
                            : ""}
                        </InfoHover>
                      )}
                      <span>{p.description}</span>
                    </span>
                  </td>
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

                  <td>
                    <PaymentStatusTag tag={p.status} />
                  </td>
                  <td>
                    <div className="text-and-icon">
                      <SvgCalendar />
                      <span>{formatDate(p.paymentDate)}</span>
                    </div>
                  </td>
                  <td>
                    <div className="text-and-icon">
                      <SvgCalendar />
                      <span>{formatDate(p.createdAt)}</span>
                    </div>
                  </td>
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
                          setModalVisualize({ visible: true, payment: p })
                        }
                      >
                        Visualizar
                      </button>
                      <button
                        onClick={() => {
                          setModalUpdate({ visible: true, payment: p });
                        }}
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => {
                          setModalRemove({ visible: true, payment: p });
                        }}
                      >
                        Excluir
                      </button>
                    </Dropdown>
                  </td>
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
