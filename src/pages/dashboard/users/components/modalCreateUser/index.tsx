import { Button } from "@/components/Button";
import { Input } from "@/components/Input";
import Modal, { ModalProps } from "@/components/Modal";
import { Select } from "@/components/Select";
import { useFamilies } from "@/hooks/swrHooks/useFamilies";
import { Family, UserRole } from "@/types/apiTypes";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";

export interface IUserForm {
  family: Family;
  name: string;
  email: string;
  password: string;
  role: UserRole;
}

const defaultUserForm: Partial<IUserForm> = {
  name: "",
  email: "",
  password: "",
  role: UserRole.FamilyMember,
};

interface IProps extends Pick<ModalProps, "visible" | "onClose"> {
  onSubmit: (form: IUserForm) => Promise<unknown>;
}

export const ModalCreateUser = ({ onClose, visible, onSubmit }: IProps) => {
  const families = useFamilies();

  const form = useForm<IUserForm>({ defaultValues: defaultUserForm });

  const [loading, setLoading] = useState(false);
  const innerOnClose = () => (!loading ? onClose() : undefined);
  const innerOnSubmit = async (form: IUserForm) => {
    try {
      setLoading(true);
      await onSubmit(form);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      className="modal create-user default-header default-footer"
      onClose={innerOnClose}
      visible={visible}
    >
      <header>
        <h1>Criar usuário</h1>
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
          <Controller
            name="email"
            control={form.control}
            rules={{ required: "Campo necessário" }}
            render={({ field }) => (
              <Input placeholder="Digite aqui" {...field} label="E-mail" />
            )}
          />
          <Controller
            name="password"
            control={form.control}
            rules={{ required: "Campo necessário" }}
            render={({ field }) => (
              <Input
                placeholder="Digite aqui"
                {...field}
                label="Password"
                type="password"
              />
            )}
          />
        </form>
      </main>
      <footer>
        <Button outlined disabled={loading} onClick={innerOnClose}>
          Cancelar
        </Button>
        <Button disabled={loading} onClick={form.handleSubmit(innerOnSubmit)}>
          Criar usuário
        </Button>
      </footer>
    </Modal>
  );
};
