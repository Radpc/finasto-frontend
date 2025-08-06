import { Button } from "@/components/Button";
import { Input } from "@/components/Input";
import Modal, { ModalProps } from "@/components/Modal";
import { Select } from "@/components/Select";
import { Switch } from "@/components/Switch";
import { useAccounts } from "@/hooks/swrHooks/useAccounts";
import { useCategories } from "@/hooks/swrHooks/useCategories";
import { paymentMethodsOptions } from "@/pages/dashboard/payments/utils/paymentMethods";
import { Account, Category, PaymentMethod, Tag } from "@/types/apiTypes";
import { useEffect, useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import "./_style.scss";
import { InfoHover } from "@/components/InfoHover";
import { currencyToNumber } from "@/utils/money";
import { numberToCurrency } from "@/utils/formatters";
import { DateTime } from "luxon";
import { useTags } from "@/hooks/swrHooks/useTags";

export interface IRecurringPaymentForm {
  account: Account;
  category: Category;
  tags: Tag[];
  description: string;
  paymentMethod: PaymentMethod;
  totalValue?: string;
  singlePaymentValue: string;
  numberOfInstallments?: string;
  dayOfMonth: string;
  automaticPayment: boolean;
  isOutcome: boolean;
  startFromDate?: string;
}

const defaultRecurringPaymentForm: Partial<IRecurringPaymentForm> = {
  description: "",
  isOutcome: true,
  paymentMethod: PaymentMethod.Credit,
  totalValue: "",
  singlePaymentValue: "",
  numberOfInstallments: "",
  dayOfMonth: "",
  automaticPayment: true,
  startFromDate: new Date().toISOString(),
};

interface IProps extends Pick<ModalProps, "visible" | "onClose"> {
  onSubmit: (form: IRecurringPaymentForm) => Promise<unknown>;
}

const formatInputDateToISO = (value: string) => {
  return DateTime.fromFormat(value, "yyyy-MM-dd'T'HH:mm").toISO() || "";
};

const formatISOToInputDate = (iso: string) => {
  return DateTime.fromISO(iso).toFormat("yyyy-MM-dd'T'HH:mm") || "";
};

export const ModalCreateRecurringPayment = ({
  onClose,
  visible,
  onSubmit,
}: IProps) => {
  const accounts = useAccounts();
  const categories = useCategories();
  const tags = useTags();

  const form = useForm<IRecurringPaymentForm>({
    defaultValues: defaultRecurringPaymentForm,
  });

  const [loading, setLoading] = useState(false);
  const innerOnClose = () => (!loading ? onClose() : undefined);
  const innerOnSubmit = async (form: IRecurringPaymentForm) => {
    try {
      setLoading(true);
      await onSubmit(form);
    } finally {
      setLoading(false);
    }
  };

  const isOutcomeWatch = form.watch("isOutcome");

  const totalValueWatch = form.watch("totalValue");
  const totalValueNumber = useMemo(() => {
    const parsedNumber = totalValueWatch
      ? currencyToNumber(totalValueWatch)
      : undefined;
    return parsedNumber || undefined;
  }, [totalValueWatch]);

  const installmentsWatch = form.watch("numberOfInstallments");
  const installmentsNumber = useMemo(() => {
    const parsedNumber = installmentsWatch
      ? currencyToNumber(installmentsWatch)
      : undefined;
    return parsedNumber || undefined;
  }, [installmentsWatch]);

  const installmentDefaultValue = useMemo(() => {
    if (totalValueNumber && installmentsNumber) {
      return totalValueNumber / installmentsNumber;
    }

    return undefined;
  }, [totalValueNumber, installmentsNumber]);

  useEffect(() => {
    if (installmentDefaultValue) {
      form.setValue(
        "singlePaymentValue",
        numberToCurrency(installmentDefaultValue)
      );
    }
  }, [form, installmentDefaultValue]);

  return (
    <Modal
      className="modal create-recurring-payment default-header default-footer"
      onClose={innerOnClose}
      visible={visible}
    >
      <header>
        <h1>Criar pagamento recorrente</h1>
      </header>
      <main>
        <form onSubmit={form.handleSubmit(innerOnSubmit)}>
          <h5>Geral</h5>
          <div className="line">
            <Controller
              name="description"
              control={form.control}
              rules={{ required: "Campo necessário" }}
              render={({ field, fieldState: { error } }) => (
                <Input
                  error={error?.message}
                  placeholder="Digite aqui"
                  {...field}
                  label="Descrição"
                />
              )}
            />
            <Controller
              name="isOutcome"
              control={form.control}
              render={({ field }) => (
                <div className="switch small">
                  <span className="label">Gasto</span>
                  <Switch
                    checked={field.value}
                    onChange={() => field.onChange(!field.value)}
                  />
                </div>
              )}
            />
          </div>
          <div className="line">
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
            <Controller
              name="category"
              control={form.control}
              rules={{ required: "Campo necessário" }}
              render={({ field, fieldState: { error } }) => (
                <Select
                  {...field}
                  label="Categoria"
                  compareBy={(a, b) => a.id === b.id}
                  options={categories.options}
                  error={error?.message}
                />
              )}
            />
          </div>

          <div className="line">
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
              name="automaticPayment"
              control={form.control}
              render={({ field }) => (
                <div className="switch small">
                  <span className="label">
                    <InfoHover from={<span>Automático</span>}>Opa</InfoHover>
                  </span>
                  <Switch
                    checked={field.value}
                    onChange={() => field.onChange(!field.value)}
                  />
                </div>
              )}
            />
          </div>

          <div className="line">
            <Controller
              name="startFromDate"
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
                  value={formatISOToInputDate(field.value || "")}
                  label="Início do pagamento"
                />
              )}
            />
            <Controller
              name="tags"
              control={form.control}
              rules={{ required: "Campo necessário" }}
              render={({ field, fieldState: { error } }) => (
                <Select
                  {...field}
                  isMulti
                  compareBy={(a, b) => a?.id === b?.id}
                  isSearchable
                  options={tags.options}
                  value={field.value}
                  error={error?.message}
                  label="Tags"
                />
              )}
            />
          </div>

          <h5>
            Valor total <small>Opcional</small>
          </h5>
          <div className="line">
            <Controller
              name="totalValue"
              control={form.control}
              render={({ field, fieldState: { error } }) => (
                <Input
                  label="Valor total"
                  preppend={"R$"}
                  className={
                    "input price " + (isOutcomeWatch ? "negative" : "positive")
                  }
                  currency
                  placeholder="Digite aqui"
                  {...field}
                  error={error?.message}
                />
              )}
            />
            <Controller
              name="numberOfInstallments"
              control={form.control}
              render={({ field, fieldState: { error } }) => (
                <Input
                  label="Parcelas"
                  placeholder="Digite aqui"
                  preppend={"X"}
                  // mask={maskInt}
                  {...field}
                  error={error?.message}
                />
              )}
            />
          </div>

          <h5>Parcela</h5>

          <div className="line">
            <Controller
              name="dayOfMonth"
              control={form.control}
              rules={{
                required: "Campo necessário",
                validate: (v) => {
                  const n = parseInt(v);
                  return (n > 0 && n < 31) || "Insira um dia válido";
                },
              }}
              render={({ field, fieldState: { error } }) => (
                <Input
                  // mask={maskInt}
                  placeholder="Digite aqui"
                  label="Dia do mês"
                  {...field}
                  error={error?.message}
                />
              )}
            />

            <Controller
              name="singlePaymentValue"
              control={form.control}
              rules={{ required: "Campo necessário" }}
              render={({ field, fieldState: { error } }) => (
                <Input
                  label="Valor da parcela"
                  preppend={"R$"}
                  className={
                    "input price " + (isOutcomeWatch ? "negative" : "positive")
                  }
                  currency
                  placeholder="Digite aqui"
                  {...field}
                  error={error?.message}
                />
              )}
            />
          </div>
        </form>
      </main>
      <footer>
        <Button outlined disabled={loading} onClick={innerOnClose}>
          Cancelar
        </Button>
        <Button disabled={loading} onClick={form.handleSubmit(innerOnSubmit)}>
          Criar recorrência
        </Button>
      </footer>
    </Modal>
  );
};
