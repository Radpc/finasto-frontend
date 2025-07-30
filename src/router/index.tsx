import { useRedux } from "@/hooks/reduxHooks";
import { LayoutDashboard } from "@/layout/dashboard";
import { PageLogin } from "@/pages/auth/login";
import { PageCategories } from "@/pages/dashboard/categories";
import { PagePayments } from "@/pages/dashboard/payments";
import { PageTags } from "@/pages/dashboard/tags";
import { useEffect } from "react";
import { BrowserRouter, Route, Routes, useNavigate } from "react-router-dom";

export const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="auth">
          <Route path="login" element={<PageLogin />} />
        </Route>
        <Route path="dashboard" element={<LayoutDashboard />}>
          <Route path="payments" element={<PagePayments />} />
          <Route path="categories" element={<PageCategories />} />
          <Route path="tags" element={<PageTags />} />
        </Route>
        <Route path="*" element={<DefaultResolver />} />
      </Routes>
    </BrowserRouter>
  );
};

const DefaultResolver = () => {
  const loggedIn = useRedux((state) => !!state.session.user);

  const navigate = useNavigate();

  useEffect(() => {
    if (loggedIn) {
      navigate("/dashboard/categories");
    } else {
      navigate("/auth/login");
    }
  }, [loggedIn, navigate]);

  return <div />;
};
