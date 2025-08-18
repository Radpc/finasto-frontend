import { Outlet } from "react-router-dom";
import { Sidebar } from "./components/sidebar";
import { Topbar } from "./components/topbar";
import { useRedux } from "@/hooks/reduxHooks";
import "./_style.scss";
import { useEffect, useState } from "react";
import { useMobile } from "@/hooks/useMobile";

export const LayoutDashboard = () => {
  const user = useRedux((state) => state.session.user);

  const [open, setOpen] = useState<boolean>(true);
  const isMobile = useMobile();

  useEffect(() => {
    if (isMobile) {
      setOpen(false);
    } else {
      setOpen(true);
    }
  }, [isMobile]);

  return (
    <div className="layout dashboard">
      {user && (
        <Topbar className="topbar" user={user} setOpen={setOpen} open={open} />
      )}
      <main>
        {(!isMobile || isMobile) && (
          <Sidebar
            className={
              "sidebar" +
              (isMobile ? " mobile" : "") +
              (isMobile && open ? " open" : "")
            }
            open={open}
            setOpen={setOpen}
          />
        )}
        <div className="layout-content">
          <Outlet />
        </div>
      </main>
    </div>
  );
};
