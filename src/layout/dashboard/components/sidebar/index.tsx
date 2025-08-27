import { Link } from "react-router-dom";
import "./_style.scss";
import { JSX } from "react";

import CategoryIcon from "@mui/icons-material/Category";
import PaymentsIcon from "@mui/icons-material/Payments";
import GroupIcon from "@mui/icons-material/Group";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import LabelIcon from "@mui/icons-material/Label";
import KeyboardDoubleArrowLeftIcon from "@mui/icons-material/KeyboardDoubleArrowLeft";
import KeyboardDoubleArrowRightIcon from "@mui/icons-material/KeyboardDoubleArrowRight";
import { useMobile } from "@/hooks/useMobile";

interface IProps {
  className?: string;
  open: boolean;
  setOpen: (open: boolean) => void;
}

interface ISidebarOptions {
  label: string;
  path: string;
  icon: JSX.Element;
}

const options: ISidebarOptions[] = [
  {
    label: "Pagamentos",
    path: "/dashboard/payments",
    icon: <PaymentsIcon color="action" />,
  },
  {
    label: "Categorias",
    path: "/dashboard/categories",
    icon: <CategoryIcon color="action" />,
  },
  {
    label: "Tags",
    path: "/dashboard/tags",
    icon: <LabelIcon color="action" />,
  },
  {
    label: "Usuários",
    path: "/dashboard/users",
    icon: <GroupIcon color="action" />,
  },
  {
    label: "Contas",
    path: "/dashboard/accounts",
    icon: <AccountBalanceIcon color="action" />,
  },
  {
    label: "Pagamentos recorrentes",
    path: "/dashboard/recurring-payments",
    icon: <CreditCardIcon color="action" />,
  },
];

export const Sidebar = ({ className, open, setOpen }: IProps) => {
  const isMobile = useMobile();

  return (
    <div
      className={
        "component sidebar " + (className ?? "") + (open ? " open" : " closed")
      }
    >
      <nav>
        {options.map((option, i) => (
          <div>
            <Link
              key={option.path + "_" + i}
              to={option.path}
              className={open ? "open" : "closed"}
              onClick={() => {
                if (isMobile) {
                  setOpen(false);
                }
              }}
            >
              {option.icon}
              {open ? option.label : ""}
            </Link>
          </div>
        ))}
      </nav>

      {!isMobile && (
        <button onClick={() => setOpen(!open)}>
          <p>
            {open ? (
              <KeyboardDoubleArrowLeftIcon />
            ) : (
              <KeyboardDoubleArrowRightIcon />
            )}
          </p>
        </button>
      )}
    </div>
  );
};
