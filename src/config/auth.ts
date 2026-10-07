/**
 * Auth0 settings. When all three are set the app signs in with Auth0;
 * otherwise it falls back to the email and password form (local development).
 * These values are public: they end up in the JavaScript bundle.
 */
const domain = import.meta.env.VITE_AUTH0_DOMAIN;
const clientId = import.meta.env.VITE_AUTH0_CLIENT_ID;
const audience = import.meta.env.VITE_AUTH0_AUDIENCE;

export const auth0Config =
  domain && clientId && audience ? { domain, clientId, audience } : null;

export const isAuth0Enabled = auth0Config !== null;
