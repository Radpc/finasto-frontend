import { Outlet } from "react-router-dom";
import "./_style.scss";

export const LayoutAuth = () => {
  return (
    <div className="layout auth">
      <Outlet />
    </div>
  );
};
