import "./_style.scss";
interface IProps {
  label: string;
  value: string;
  className?: string;
}

export const KpiPayment = ({ label, value, className }: IProps) => {
  return (
    <div className={"component kpi-payment " + (className ?? "")}>
      <span className="title">{label}</span>
      <span className="value">{value}</span>
    </div>
  );
};
