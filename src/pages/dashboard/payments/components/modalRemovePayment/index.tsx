import { Button } from "@/components/Button";
import Modal, { ModalProps } from "@/components/Modal";
import { useState } from "react";
import "./_style.scss";

interface IProps extends Pick<ModalProps, "visible" | "onClose"> {
  onConfirm: () => Promise<unknown>;
}

export const ModalRemovePayment = ({ onClose, onConfirm, visible }: IProps) => {
  const [isLoading, setIsLoading] = useState(false);

  const onInnerClose = () => (!isLoading ? onClose() : undefined);

  const onInnerSubmit = async () => {
    try {
      setIsLoading(true);
      await onConfirm();
      onClose();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      visible={visible}
      onClose={onInnerClose}
      className="modal remove-payment default-header default-footer"
    >
      <header>Remover pagamento</header>
      <main>
        <h3>Tem certeza?</h3>
        <p>O pagamento será excluído do sistema e não poderá ser recuperado</p>
      </main>
      <footer>
        <Button disabled={isLoading} onClick={onInnerClose} outlined>
          Cancelar
        </Button>
        <Button disabled={isLoading} onClick={onInnerSubmit} type="warning">
          Remover
        </Button>
      </footer>
    </Modal>
  );
};
