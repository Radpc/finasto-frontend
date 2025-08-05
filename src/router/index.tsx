import { useRedux } from "@/hooks/reduxHooks";
import { LayoutAuth } from "@/layout/auth";
import { LayoutDashboard } from "@/layout/dashboard";
import { PageLogin } from "@/pages/auth/login";
import { PageAccounts } from "@/pages/dashboard/accounts";
import { PageCategories } from "@/pages/dashboard/categories";
import { PagePayments } from "@/pages/dashboard/payments";
import { PageRecurringPayments } from "@/pages/dashboard/recurring-payments";
import { PageTags } from "@/pages/dashboard/tags";
import { PageUsers } from "@/pages/dashboard/users";
import { useEffect } from "react";
import { BrowserRouter, Route, Routes, useNavigate } from "react-router-dom";

export const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="auth" element={loggedOut(<LayoutAuth />)}>
          <Route path="login" element={<PageLogin />} />
        </Route>
        <Route path="dashboard" element={loggedIn(<LayoutDashboard />)}>
          <Route path="payments" element={<PagePayments />} />
          <Route path="categories" element={<PageCategories />} />
          <Route path="tags" element={<PageTags />} />
          <Route path="users" element={<PageUsers />} />
          <Route path="accounts" element={<PageAccounts />} />
          <Route
            path="recurring-payments"
            element={<PageRecurringPayments />}
          />
        </Route>
        <Route path="*" element={<Resolver />} />
      </Routes>
    </BrowserRouter>
  );
};

interface IProps {
  children?: React.ReactNode;
}

const Resolver = ({ children }: IProps) => {
  const loggedIn = useRedux((state) => !!state.session.user);

  const navigate = useNavigate();

  useEffect(() => {
    if (!loggedIn) {
      navigate("/auth/login");
    } else {
      navigate("/dashboard/payments");
    }
  }, [loggedIn, navigate]);

  return children;
};

const PrivateRoute = ({ children }: IProps) => {
  const loggedIn = useRedux((state) => !!state.session.user);

  const navigate = useNavigate();

  useEffect(() => {
    if (!loggedIn) {
      navigate("/auth/login");
    }
  }, [loggedIn, navigate]);

  return children;
};

const PublicRoute = ({ children }: IProps) => {
  const loggedIn = useRedux((state) => !!state.session.user);

  const navigate = useNavigate();

  useEffect(() => {
    if (loggedIn) {
      navigate("/dashboard/payments");
    }
  }, [loggedIn, navigate]);

  return children;
};

const loggedIn = (element: React.ReactNode) => (
  <PrivateRoute>{element}</PrivateRoute>
);

const loggedOut = (element: React.ReactNode) => (
  <PublicRoute>{element}</PublicRoute>
);
