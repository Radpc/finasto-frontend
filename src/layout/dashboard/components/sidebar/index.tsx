import { Link } from "react-router-dom";
import "./_style.scss";

interface IProps {
  className?: string;
}

export const Sidebar = ({ className }: IProps) => {
  return (
    <div className={"component sidebar " + (className ?? "")}>
      <nav>
        <Link to={"/dashboard/categories"}>Categorias</Link>
        <Link to={"/dashboard/payments"}>Pagamentos</Link>
        <Link to={"/dashboard/tags"}>Tags</Link>
        <Link to={"/dashboard/users"}>Usuários</Link>
        <Link to={"/dashboard/accounts"}>Contas</Link>
        <Link to={"/dashboard/recurring-payments"}>Pagamentos recorrentes</Link>
      </nav>
    </div>
  );
};
