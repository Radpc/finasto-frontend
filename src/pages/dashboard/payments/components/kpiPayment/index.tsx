import "./_style.scss";
interface IProps {
  label: string;
  value: string;
  className?: string;
}

export const KpiPayment = ({ label, value, className }: IProps) => {
  // O valor deve ser negativo (ex: "R$ - 2.411,25" ou "R$ - 11.937,25")

  return (
    <div className={"component kpi-payment " + (className ?? "")}>
      <span className="title">{label}</span>
      <span
        className={
          "value" +
          (label === "Total" ? (value.includes("-") ? " red" : " green") : "")
        }
      >
        {value}
      </span>
    </div>
  );
};
