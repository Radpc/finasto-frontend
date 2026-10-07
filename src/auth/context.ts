import { createContext, useContext } from "react";

export interface AuthActions {
  /** Starts Auth0 sign-in; undefined when the app uses the password form. */
  signIn?: () => Promise<void>;
  signOut: () => void;
}

export const AuthContext = createContext<AuthActions | null>(null);

export const useAuthActions = () => {
  const actions = useContext(AuthContext);
  if (!actions) throw new Error("useAuthActions needs an <AuthBoundary>");
  return actions;
};

const SIGN_IN_ERROR_KEY = "finasto.signInError";

export const saveSignInError = (message: string) => {
  try {
    sessionStorage.setItem(SIGN_IN_ERROR_KEY, message);
  } catch {
    // Storage blocked: the message is lost, sign-out still happens
  }
};

/** Returns and clears the message left by a failed sign-in, if any. */
export const takeSignInError = () => {
  try {
    const message = sessionStorage.getItem(SIGN_IN_ERROR_KEY);
    sessionStorage.removeItem(SIGN_IN_ERROR_KEY);
    return message;
  } catch {
    return null;
  }
};
