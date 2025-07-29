import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import ReactDOM from "react-dom";
import "./_style.scss";
import { CSSTransition } from "react-transition-group";

export interface ModalProps {
  children?: React.ReactNode;
  className?: string;
  visible: boolean;
  custom?: boolean;
  componentClassName?: string;
  onClose: () => void;
  side?: boolean;
  confirmExit?: boolean;
}

export type ModalReference = { onConfirmExit: () => void };

const Modal = forwardRef<ModalReference, ModalProps>(
  (
    {
      children,
      onClose,
      side,
      visible,
      className,
      custom,
      confirmExit,
      componentClassName,
    },
    ref
  ) => {
    const closeOnEscapeKeyDown = (e: KeyboardEvent) =>
      e.key === "Escape" ? onClose() : null;
    const modalRef = useRef(null);
    const [innerVisible, setInnerVisible] = useState(false);

    useEffect(() => setInnerVisible(visible), [visible]);

    useEffect(() => {
      document.body.addEventListener("keyup", closeOnEscapeKeyDown);
      return function cleanup() {
        document.body.removeEventListener("keyup", closeOnEscapeKeyDown);
      };
    }, []);

    const [, setConfirmExitModal] = useState(false);

    const innerOnClose = () => {
      if (confirmExit) {
        setConfirmExitModal(true);
      } else {
        onClose();
      }
    };

    useImperativeHandle(ref, () => ({
      onConfirmExit: () => setConfirmExitModal(true),
    }));

    return ReactDOM.createPortal(
      <CSSTransition
        classNames="modal-animation"
        nodeRef={modalRef}
        in={innerVisible}
        unmountOnExit
        timeout={200}
      >
        <div
          ref={modalRef}
          role="button"
          tabIndex={0}
          onKeyUp={({ key }) => (key === "Escape" ? innerOnClose() : null)}
          className={
            "component modal " +
            (side ? "side " : "") +
            (componentClassName ?? "")
          }
          onClick={(e) =>
            e.target === e.currentTarget ? innerOnClose() : null
          }
        >
          <div
            className={
              "modal-structure " +
              (custom ? "" : "default-modal ") +
              (className ?? "")
            }
          >
            {children}
          </div>
        </div>
      </CSSTransition>,
      document.getElementById("root") as HTMLElement
    );
  }
);

Modal.displayName = "Modal";

export default Modal;
