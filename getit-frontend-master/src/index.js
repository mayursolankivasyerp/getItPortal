import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { PersistGate } from "redux-persist/integration/react";
import "./assets/scss/dashlite.scss";
import "./assets/scss/style-email.scss";
import { Provider } from "react-redux";
import store, { persistor } from "../src/store/index";
import reportWebVitals from "./reportWebVitals";

import { ToastContainer } from "react-toastify";

import { authProvider, checkAndRedirect } from "./utils/authProvider";
import { AzureAD, AuthenticationState } from "react-aad-msal";
const root = ReactDOM.createRoot(document.getElementById("root"));
checkAndRedirect();
root.render(
  <>
    <AzureAD provider={authProvider} forceLogin={true}>
      {({ login, logout, authenticationState, error, accountInfo }) => {
        switch (authenticationState) {
          case AuthenticationState.Authenticated:
            const { name, userName } = accountInfo.account;
            const userData = { name, userName };
            return (
              <>
                <Provider store={store}>
                  <PersistGate loading={null} persistor={persistor}>
                    <BrowserRouter>
                      <App userProfile={userData} userLogOut={logout} authenticationState={authenticationState} />
                    </BrowserRouter>
                  </PersistGate>
                </Provider>
                <ToastContainer autoClose={2000} position="bottom-center" />
              </>
            );
          case AuthenticationState.Unauthenticated:
            return (
              <div>
                {error && (
                  <p>
                    <span>An error occurred during authentication, please try again!</span>
                  </p>
                )}
                <p>
                  <span>Hey stranger, you look new!</span>
                  <button onClick={login}>Login</button>
                </p>
              </div>
            );
          case AuthenticationState.InProgress:
            return <p className="text-center fs-1">Authentication in progress...</p>;
        }
      }}
    </AzureAD>
  </>
);

reportWebVitals();
