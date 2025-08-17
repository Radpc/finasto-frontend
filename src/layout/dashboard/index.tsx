import { Outlet } from "react-router-dom";
import { Sidebar } from "./components/sidebar";
import { Topbar } from "./components/topbar";
import { useRedux } from "@/hooks/reduxHooks";
import "./_style.scss";

export const LayoutDashboard = () => {
  const user = useRedux((state) => state.session.user);
  return (
    <div className="layout dashboard">
      {user && <Topbar className="topbar" user={user} />}
      <main>
        <Sidebar className="sidebar" />
        <div className="layout-content">
          <Outlet />
        </div>
      </main>
    </div>
  );
};
