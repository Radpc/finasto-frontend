import { Button } from "@/components/Button";
import { Input } from "@/components/Input";
import Modal, { ModalProps } from "@/components/Modal";
import { Select } from "@/components/Select";
import { useFamilies } from "@/hooks/swrHooks/useFamilies";
import { Family, UserRole } from "@/types/apiTypes";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";

export interface IAccountForm {
  family: Family;
  name: string;
}

const defaultAccountForm: Partial<IAccountForm> = {
  name: "",
};

interface IProps extends Pick<ModalProps, "visible" | "onClose"> {
  onSubmit: (form: IAccountForm) => Promise<unknown>;
}

export const ModalCreateAccount = ({ onClose, visible, onSubmit }: IProps) => {
  const families = useFamilies();

  const form = useForm<IAccountForm>({ defaultValues: defaultAccountForm });

  const [loading, setLoading] = useState(false);
  const innerOnClose = () => (!loading ? onClose() : undefined);
  const innerOnSubmit = async (form: IAccountForm) => {
    try {
      setLoading(true);
      await onSubmit(form);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      className="modal create-account default-header default-footer"
      onClose={innerOnClose}
      visible={visible}
    >
      <header>
        <h1>Criar conta</h1>
      </header>
      <main>
        <form onSubmit={form.handleSubmit(innerOnSubmit)}>
          <Controller
            name="family"
            control={form.control}
            rules={{ required: "Campo necessário" }}
            render={({ field, fieldState: { error } }) => (
              <Select
                value={field.value}
                label="Família"
                compareBy={(a, b) => a.id === b.id}
                onChange={field.onChange}
                options={families.options}
                error={error?.message}
              />
            )}
          />
          <Controller
            name="name"
            control={form.control}
            rules={{ required: "Campo necessário" }}
            render={({ field }) => (
              <Input placeholder="Digite aqui" {...field} label="Nome" />
            )}
          />
        </form>
      </main>

      <footer>
        <Button outlined disabled={loading} onClick={innerOnClose}>
          Cancelar
        </Button>
        <Button disabled={loading} onClick={form.handleSubmit(innerOnSubmit)}>
          Criar conta
        </Button>
      </footer>
    </Modal>
  );
};
