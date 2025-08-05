import { Button } from "@/components/Button";
import { Input } from "@/components/Input";
import Modal, { ModalProps } from "@/components/Modal";
import { Select } from "@/components/Select";
import { useFamilies } from "@/hooks/swrHooks/useFamilies";
import { Family } from "@/types/apiTypes";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";

export interface ITagForm {
  label: string;
  family: Family;
}

const defaultTagForm: Partial<ITagForm> = {
  label: "",
};

interface IProps extends Pick<ModalProps, "visible" | "onClose"> {
  onSubmit: (form: ITagForm) => Promise<unknown>;
}

export const ModalCreateTag = ({ onClose, visible, onSubmit }: IProps) => {
  const families = useFamilies();

  const form = useForm<ITagForm>({ defaultValues: defaultTagForm });

  const [loading, setLoading] = useState(false);
  const innerOnClose = () => (!loading ? onClose() : undefined);
  const innerOnSubmit = async (form: ITagForm) => {
    try {
      setLoading(true);
      await onSubmit(form);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      className="modal create-tag default-header default-footer"
      onClose={innerOnClose}
      visible={visible}
    >
      <header>
        <h1>Criar tag</h1>
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
            name="label"
            control={form.control}
            render={({ field }) => (
              <Input placeholder="Digite aqui" {...field} label="Label" />
            )}
          />
        </form>
      </main>
      <footer>
        <Button outlined disabled={loading} onClick={innerOnClose}>
          Cancelar
        </Button>
        <Button disabled={loading} onClick={form.handleSubmit(innerOnSubmit)}>
          Criar tag
        </Button>
      </footer>
    </Modal>
  );
};
