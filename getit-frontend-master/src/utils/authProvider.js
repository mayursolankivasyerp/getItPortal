import { MsalAuthProvider, LoginType } from "react-aad-msal";
import { AUTHDETAILS } from "./Constant";

const config = {
  auth: {
    clientId: AUTHDETAILS.clientId,
    authority: AUTHDETAILS.authority,
    knownAuthorities: AUTHDETAILS.knownAuthorities,
    redirectUri: AUTHDETAILS.redirectUri,
    postLogoutRedirectUri: AUTHDETAILS.postLogoutRedirectUri,

    navigateToLoginRequestUrl: true,

    validateAuthority: true,
  },
  cache: {
    cacheLocation: "localStorage",
    storeAuthStateInCookie: true,

    //   cacheLocation: "sessionStorage",
    //  storeAuthStateInCookie: false,
  },
};

const authenticationParameters = {
  scopes: ["user.read"],
};

const options = {
  loginType: LoginType.Redirect,
  tokenRefreshUri: window.location.origin + "/auth.html",
};

export const authProvider = new MsalAuthProvider(config, authenticationParameters, options);

export function checkAndRedirect() {
  const userAgent = navigator.userAgent;
  if (userAgent.includes("Outlook") || userAgent.includes("Teams")) {
    window.location.href = "http://localhost:3000";
  }
}

export async function checkUserAuthentication() {
  try {
    const account = await authProvider.getAccount();

    return !!account;
  } catch (error) {
    return false;
  }
}

export async function logout() {
  await authProvider.logout();
  const logoutUrl = AUTHDETAILS.logoutUrl;
  window.location.href = logoutUrl;
}
