import Router from "./route/Index";
import ThemeProvider from "./layout/provider/Theme";
import React, { useLayoutEffect, useContext, useEffect, useState } from "react";
import { Routes, Route, useLocation } from "react-router-dom";

import { useDispatch, useSelector } from "react-redux";
import { getPermission, permissionSelector } from "./reducers/rolePermission.reducer";
import { AzureAD, AuthenticationState } from "react-aad-msal";
import { profileLogin } from "./reducers/loginProfile.reducer";

const App = ({ userProfile, userLogOut, authenticationState }) => {
  const dispatch = useDispatch();
  function getCookie(name) {
    return document.cookie.match("(^|;)\\s*" + name + "\\s*=\\s*([^;]+)")?.pop() || null;
  }
  let token = getCookie("token");

  useEffect(() => {
    function setCookie(name, value) {
      document.cookie = `${name}=${value};path=/`;
    }

    if (authenticationState === AuthenticationState.Authenticated && (token == null || token == "null")) {
      dispatch(profileLogin({ userName: userProfile.name, email: userProfile.userName }))
        .then((res) => {
          if (res.payload.code == 200) {
            token = `Bearer ` + res.payload.response;

            if (token) {
              dispatch(getPermission(token));
            }
          }
        })
        .catch((error) => {
          throw new Error(error);
        });
    }
  }, [authenticationState]);

  return (
    <ThemeProvider>
      <Router userProfile={userProfile} userLogOut={userLogOut} authenticationState={authenticationState} />
    </ThemeProvider>
  );
};
export default App;
