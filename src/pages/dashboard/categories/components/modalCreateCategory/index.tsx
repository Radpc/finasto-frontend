import { Button } from "@/components/Button";
import { Input } from "@/components/Input";
import Modal, { ModalProps } from "@/components/Modal";
import { Select } from "@/components/Select";
import { useFamilies } from "@/hooks/swrHooks/useFamilies";
import { Family } from "@/types/apiTypes";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";

export interface ICategoryForm {
  label: string;
  family: Family;
}

const defaultCategoryForm: Partial<ICategoryForm> = {
  label: "",
};

interface IProps extends Pick<ModalProps, "visible" | "onClose"> {
  onSubmit: (form: ICategoryForm) => Promise<unknown>;
}

export const ModalCreateCategory = ({ onClose, visible, onSubmit }: IProps) => {
  const families = useFamilies();
  const form = useForm<ICategoryForm>({ defaultValues: defaultCategoryForm });

  const [loading, setLoading] = useState(false);
  const innerOnClose = () => (!loading ? onClose() : undefined);
  const innerOnSubmit = async (form: ICategoryForm) => {
    try {
      setLoading(true);
      await onSubmit(form);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      className="modal create-category"
      onClose={innerOnClose}
      visible={visible}
    >
      <h1>Create category</h1>
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
          render={({ field }) => <Input {...field} label="Label" />}
        />
        <Button disabled={loading} buttonType="submit">
          Create category
        </Button>
      </form>
    </Modal>
  );
};
