import { Auth0Provider, useAuth0 } from "@auth0/auth0-react";
import { ReactNode, useCallback, useEffect, useMemo, useRef } from "react";
import { toast } from "react-toastify";
import { isAxiosError } from "axios";
import { auth0Config } from "@/config/auth";
import { setTokenGetter } from "@/config/api";
import { useRedux, useReduxDispatch } from "@/hooks/reduxHooks";
import { AuthService } from "@/services/auth";
import { setSession, unsetSession } from "@/storage/slices/session";
import { AuthContext, saveSignInError } from "./context";

interface IProps {
  children: ReactNode;
}

/**
 * Provides sign-in and sign-out to the app. With Auth0 configured it wraps the
 * app in Auth0's provider and waits for Auth0 before rendering the routes;
 * otherwise it only offers sign-out for the password form.
 */
export const AuthBoundary = ({ children }: IProps) => {
  if (!auth0Config) return <PasswordAuth>{children}</PasswordAuth>;

  return (
    <Auth0Provider
      domain={auth0Config.domain}
      clientId={auth0Config.clientId}
      authorizationParams={{
        audience: auth0Config.audience,
        redirect_uri: window.location.origin,
        scope: "openid profile email offline_access",
      }}
      // Tokens stay in memory (the SDK default), never in localStorage
      useRefreshTokens
      onRedirectCallback={(appState) =>
        window.history.replaceState({}, "", appState?.returnTo ?? "/")
      }
    >
      <Auth0Session>{children}</Auth0Session>
    </Auth0Provider>
  );
};

const PasswordAuth = ({ children }: IProps) => {
  const dispatch = useReduxDispatch();
  const actions = useMemo(
    () => ({ signOut: () => dispatch(unsetSession()) }),
    [dispatch],
  );
  return (
    <AuthContext.Provider value={actions}>{children}</AuthContext.Provider>
  );
};

const Auth0Session = ({ children }: IProps) => {
  const {
    isLoading,
    isAuthenticated,
    getAccessTokenSilently,
    loginWithRedirect,
    logout,
  } = useAuth0();
  const dispatch = useReduxDispatch();
  const user = useRedux((s) => s.session.user);
  const loadingUser = useRef(false);

  const signOut = useCallback(() => {
    dispatch(unsetSession());
    logout({ logoutParams: { returnTo: window.location.origin } });
  }, [dispatch, logout]);

  const actions = useMemo(
    () => ({ signIn: () => loginWithRedirect(), signOut }),
    [loginWithRedirect, signOut],
  );

  useEffect(() => {
    setTokenGetter(() =>
      isAuthenticated ? getAccessTokenSilently() : Promise.resolve(undefined),
    );
  }, [isAuthenticated, getAccessTokenSilently]);

  useEffect(() => {
    if (isLoading) return;

    // Tokens live in memory, so a page reload starts without one. If the
    // person was signed in, go back through Auth0: with a live Auth0 session
    // this returns straight to the same page without asking for a password.
    if (!isAuthenticated) {
      if (user) {
        loginWithRedirect({
          appState: {
            returnTo: window.location.pathname + window.location.search,
          },
        });
      }
      return;
    }

    if (user || loadingUser.current) return;
    loadingUser.current = true;
    AuthService.me()
      .then(({ data: { data: me } }) => {
        dispatch(setSession({ user: me, family: me.families?.[0] }));
        toast.success("Bem vindo, " + me.name);
      })
      .catch((error) => {
        const status = isAxiosError(error) ? error.response?.status : 0;
        // Signing out leaves the app, so the sign-in page shows the reason
        saveSignInError(
          status === 403
            ? "Não encontramos uma conta Finasto para este e-mail verificado."
            : "Não foi possível entrar. Tente novamente.",
        );
        signOut();
      })
      .finally(() => {
        loadingUser.current = false;
      });
  }, [isLoading, isAuthenticated, user, dispatch, signOut, loginWithRedirect]);

  // Hold the routes until we know who is signed in, so the router does not
  // bounce to the sign-in page while Auth0 finishes the redirect.
  if (isLoading || isAuthenticated !== Boolean(user)) return <SignInProgress />;

  return (
    <AuthContext.Provider value={actions}>{children}</AuthContext.Provider>
  );
};

const SignInProgress = () => (
  <div role="status" aria-live="polite" style={{ padding: 32 }}>
    Entrando…
  </div>
);
