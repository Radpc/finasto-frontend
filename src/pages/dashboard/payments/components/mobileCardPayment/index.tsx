import { Payment } from "@/types/apiTypes";
import "./_style.scss";
import ArrowCircleDownSharpIcon from "@mui/icons-material/ArrowCircleDownSharp";
import ArrowCircleUpSharpIcon from "@mui/icons-material/ArrowCircleUpSharp";
import { numberToCurrency } from "@/utils/formatters";
import { pink } from "@mui/material/colors";
import { Dropdown } from "@/components/Dropdown";
import SvgOptionDots from "@/assets/img/icons/OptionDots.svg?react";

interface IMobileCardPaymentProps {
  data: Payment;
  setModalVisualize: (modal: { visible: boolean; payment: Payment }) => void;
  setModalUpdate: (modal: { visible: boolean; payment: Payment }) => void;
  setModalRemove: (modal: { visible: boolean; payment: Payment }) => void;
}

export const MobileCardPayment = ({
  data,
  setModalVisualize,
  setModalUpdate,
  setModalRemove,
}: IMobileCardPaymentProps) => {
  return (
    <div className="mobile-card-payment">
      <div className="icon">
        {data.value < 0 ? (
          <ArrowCircleUpSharpIcon sx={{ color: pink[500] }} />
        ) : (
          <ArrowCircleDownSharpIcon color="success" />
        )}
      </div>
      <div className="content">
        <div className="info">
          <div className="details">
            <p className="description">{data.description}</p>
            <p className="category">Categoria: {data.category?.label}</p>
            {data.tags?.length ? (
              <div className="tags">
                {data.tags?.map((t) => (
                  <span key={"tag_" + t.id} className="tag">
                    {t.label}
                  </span>
                ))}
              </div>
            ) : (
              <></>
            )}
          </div>
          <div className="values">
            <div className="amount">
              <p style={{ whiteSpace: "nowrap" }}>
                R$ {numberToCurrency(Math.abs(data.value))}
              </p>
              <Dropdown
                buttons
                from={(props) => (
                  <button className="dropdown-btn" {...props}>
                    <SvgOptionDots />
                  </button>
                )}
              >
                <button
                  onClick={() =>
                    setModalVisualize({ visible: true, payment: data })
                  }
                >
                  Visualizar
                </button>
                <button
                  onClick={() => {
                    setModalUpdate({ visible: true, payment: data });
                  }}
                >
                  Editar
                </button>
                <button
                  onClick={() => {
                    setModalRemove({ visible: true, payment: data });
                  }}
                >
                  Excluir
                </button>
              </Dropdown>
            </div>

            <p className="date">
              {new Date(data.paymentDate).toLocaleDateString()}
            </p>
          </div>
        </div>
        {data.recurringPayment && (
          <div className="recurring">
            *<p>Pagamento recorrente</p>
          </div>
        )}
      </div>
    </div>
  );
};
