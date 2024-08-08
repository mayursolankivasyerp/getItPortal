export const AUTHDETAILS = {
  clientId: "13331191-2fc0-4056-9c6a-f846a6103dd7",
  authority: "https://login.microsoftonline.com/15ec6e46-29a6-4d25-8195-f35727de2ea3",
  knownAuthorities: [],
  redirectUri: "http://localhost:3000/",
  postLogoutRedirectUri: "http://localhost:3000",
  logoutUrl:
    "https://login.microsoftonline.com/15ec6e46-29a6-4d25-8195-f35727de2ea3/oauth2/v2.0/logout?client-request-id=c44d28ee-22b7-4e78-b8c8-53367e925de1&post_logout_redirect_uri=http%3A%2F%2Flocalhost%3A3000",
};
export const ApiUrl = "https://getitapi.vasyerp.in/api";
//export const ApiUrl = "http://192.168.175.197:9091/api";

// export const ApiUrl = "https://192.168.174.162:9091/api";

// export const ApiUrl = "http://192.168.174.77:9091/api";

export const APIKEY = "c2bd9b2c-66b4-4923-9d07-60cad928dcf2";

export const AgentName = "VASY_HRMS";
export const AccessControlOrigin = "*";

function getCookie(name) {
  return document.cookie.match("(^|;)\\s*" + name + "\\s*=\\s*([^;]+)")?.pop() || null;
}
export const token = getCookie("token");
