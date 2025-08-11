import { Button } from "@/components/Button";
import { Input } from "@/components/Input";
import Modal, { ModalProps } from "@/components/Modal";
import { Select } from "@/components/Select";
import {
  Account,
  Category,
  PaymentMethod,
  PaymentStatus,
  Tag,
} from "@/types/apiTypes";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { paymentStatusOptions } from "../../utils/paymentStatus";
import { paymentMethodsOptions } from "../../utils/paymentMethods";
import { DateTime } from "luxon";
import "./_style.scss";
import { Switch } from "@/components/Switch";
import { useAccounts } from "@/hooks/swrHooks/useAccounts";
import { useCategories } from "@/hooks/swrHooks/useCategories";
import { useTags } from "@/hooks/swrHooks/useTags";

export interface IPaymentForm {
  description: string;
  account: Account;
  isOutcome: boolean;
  value: string;
  category: Category;
  observation: string;
  status: PaymentStatus;
  paymentMethod: PaymentMethod;
  paymentDate: string;
  tags: Tag[];
}

const defaultCategoryForm: Partial<IPaymentForm> = {
  description: "",
  isOutcome: true,
  category: undefined,
  observation: "",
  paymentMethod: PaymentMethod.Credit,
  status: PaymentStatus.Paid,
  tags: [],
  value: "0",
};

interface IProps extends Pick<ModalProps, "visible" | "onClose"> {
  onSubmit: (form: IPaymentForm) => Promise<unknown>;
}

const formatInputDateToISO = (value: string) => {
  return DateTime.fromFormat(value, "yyyy-MM-dd'T'HH:mm").toISO() || "";
};

const formatISOToInputDate = (iso: string) => {
  return DateTime.fromISO(iso).toFormat("yyyy-MM-dd'T'HH:mm") || "";
};

export const ModalCreatePayment = ({ onClose, visible, onSubmit }: IProps) => {
  const accounts = useAccounts();

  const form = useForm<IPaymentForm>({ defaultValues: defaultCategoryForm });
  useEffect(() => {
    form.reset({
      ...defaultCategoryForm,
      paymentDate: new Date().toISOString(),
    });
  }, [form, visible]);

  const [loading, setLoading] = useState(false);
  const innerOnClose = () => (!loading ? onClose() : undefined);
  const innerOnSubmit = async (form: IPaymentForm) => {
    try {
      setLoading(true);
      await onSubmit(form);
    } finally {
      setLoading(false);
    }
  };

  const [categorySearch, setCategorySearch] = useState("");
  const categories = useCategories({ searchBy: categorySearch });

  const [tagSearch, setTagSearch] = useState("");
  const tags = useTags({ searchBy: tagSearch });

  const isOutcomeWatch = form.watch("isOutcome");

  return (
    <Modal
      className="modal create-payment default-header default-footer"
      onClose={innerOnClose}
      visible={visible}
    >
      <header>
        <h1 className="title">Registrar pagamento</h1>
      </header>
      <main>
        <form onSubmit={form.handleSubmit(innerOnSubmit)}>
          <div>
            <Controller
              name="account"
              control={form.control}
              rules={{ required: "Campo necessário" }}
              render={({ field, fieldState: { error } }) => (
                <Select
                  {...field}
                  label="Conta"
                  compareBy={(a, b) => a.id === b.id}
                  options={accounts.options}
                  error={error?.message}
                />
              )}
            />
          </div>
          <div className="price-section">
            <Controller
              name="value"
              control={form.control}
              rules={{ required: "Campo necessário" }}
              render={({ field, fieldState: { error } }) => (
                <Input
                  currency
                  className={
                    "input price " + (isOutcomeWatch ? "negative" : "positive")
                  }
                  preppend="R$"
                  placeholder="Digite aqui"
                  {...field}
                  error={error?.message}
                  label={"Valor " + (isOutcomeWatch ? "pago" : "recebido")}
                />
              )}
            />

            <Controller
              name="isOutcome"
              control={form.control}
              render={({ field }) => (
                <div className="switch">
                  <span className="label">Gasto</span>
                  <Switch
                    checked={field.value}
                    onChange={() => field.onChange(!field.value)}
                  />
                </div>
              )}
            />
          </div>

          <div className="divided">
            <Controller
              name="description"
              control={form.control}
              rules={{ required: "Campo necessário" }}
              render={({ field, fieldState: { error } }) => (
                <Input
                  label="Descrição"
                  error={error?.message}
                  placeholder="Digite aqui"
                  {...field}
                />
              )}
            />

            <Controller
              name="paymentDate"
              control={form.control}
              rules={{ required: "Campo necessário" }}
              render={({ field, fieldState: { error } }) => (
                <Input
                  {...field}
                  type="datetime-local"
                  onChange={(e) =>
                    field.onChange(formatInputDateToISO(e.target.value))
                  }
                  error={error?.message}
                  value={formatISOToInputDate(field.value)}
                  label="Data do pagamento"
                />
              )}
            />
          </div>

          <div className="divided">
            <Controller
              name="category"
              control={form.control}
              rules={{ required: "Campo necessário" }}
              render={({ field, fieldState: { error } }) => (
                <Select
                  isSearchable
                  compareBy={(c1, c2) => c1.id === c2.id}
                  onSearch={(newValue) => setCategorySearch(newValue)}
                  optionsLoading={categories.isLoading}
                  options={categories.options}
                  placeholder="Selecione"
                  label="Categoria"
                  onChange={field.onChange}
                  value={field.value}
                  error={error?.message}
                />
              )}
            />

            <Controller
              name="status"
              control={form.control}
              rules={{ required: "Campo necessário" }}
              render={({ field, fieldState: { error } }) => (
                <Select
                  label="Status"
                  onChange={field.onChange}
                  value={field.value}
                  options={paymentStatusOptions}
                  error={error?.message}
                />
              )}
            />
          </div>

          <div className="divided">
            <Controller
              name="paymentMethod"
              control={form.control}
              rules={{ required: "Campo necessário" }}
              render={({ field, fieldState: { error } }) => (
                <Select
                  label="Forma de pagamento"
                  onChange={field.onChange}
                  value={field.value}
                  options={paymentMethodsOptions}
                  error={error?.message}
                />
              )}
            />

            <Controller
              name="tags"
              control={form.control}
              render={({ fieldState: { error }, field }) => (
                <Select
                  isSearchable
                  compareBy={(c1, c2) => c1.id === c2.id}
                  isMulti
                  placeholder="Selecione"
                  label="Tags"
                  onChange={field.onChange}
                  value={field.value}
                  onSearch={(newSearch) => setTagSearch(newSearch)}
                  optionsLoading={tags.isLoading}
                  options={tags.options}
                  error={error?.message}
                />
              )}
            />
          </div>

          <Controller
            name="observation"
            control={form.control}
            render={({ field }) => (
              <Input placeholder="Digite aqui" {...field} label="Observação" />
            )}
          />
        </form>
      </main>
      <footer>
        <Button
          disabled={loading}
          outlined
          onClick={innerOnClose}
          buttonType="button"
        >
          Cancelar
        </Button>
        <Button disabled={loading} onClick={form.handleSubmit(innerOnSubmit)}>
          Registrar
        </Button>
      </footer>
    </Modal>
  );
};
