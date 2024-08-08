import Router from "./route/Index";
import ThemeProvider from "./layout/provider/Theme";
import React, { useLayoutEffect, useContext, useEffect, useState } from "react";
import { Routes, Route, useLocation } from "react-router-dom";

import { useDispatch, useSelector } from "react-redux";
import { getPermission, permissionSelector } from "./reducers/rolePermission.reducer";
import { AzureAD, AuthenticationState } from "react-aad-msal";
import { profileLogin } from "./reducers/loginProfile.reducer";
import Header from "./layout/header/Header";
import { APIKEY, AccessControlOrigin, AgentName, ApiUrl, appId } from "./utils/Constant";
import axios from "axios";


const App = ({ userProfile, userLogOut, authenticationState }) => {
  const dispatch = useDispatch();
  function getCookie(name) {
    return document.cookie.match("(^|;)\\s*" + name + "\\s*=\\s*([^;]+)")?.pop() || null;
  }
  let token = getCookie("GetItToken");
  useEffect(() => {
    // Check if OneSignal is already loaded on the page
    if (window.OneSignal) {
      window.OneSignal.push(function () {
        // Initialize OneSignal
        window.OneSignal.init({
          appId: appId,
          notifyButton: {
            enable: true,
            position: 'bottom-left',
            size: 'small',
            theme: 'inverse',
            colors: {
              'circle.background': 'rgb(84,110,123)',
              'circle.foreground': 'white',
              'badge.background': 'rgb(84,110,123)',
              'badge.foreground': 'white',
              'badge.bordercolor': 'white',
              'pulse.color': 'white',
              'dialog.button.background.hovering': 'rgb(77, 101, 113)',
              'dialog.button.background.active': 'rgb(70, 92, 103)',
              'dialog.button.background': 'rgb(84,110,123)',
              'dialog.button.foreground': 'white'
            },
            displayPredicate: function () {
              return window.OneSignal.isPushNotificationsEnabled()
                .then(function (isPushEnabled) {
                  return !isPushEnabled;
                });
            }
          },
          allowLocalhostAsSecureOrigin: true,
        });

        // Add a subscription change event handler
        window.OneSignal.on('subscriptionChange', async function (isSubscribed) {
          if (isSubscribed) {
              window.OneSignal.getUserId(async function (userId) {
              // console.log("userId--->>>",userId )
                  try {
                      const commonHeaders = {
                          Accept: "*/*",
                          "Content-Type": "application/json",
                          "Access-Control-Allow-Origin": AccessControlOrigin, // Assuming AccessControlOrigin is defined somewhere
                          "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,PATCH,OPTIONS",
                          "X-APIKEY": APIKEY, // Assuming APIKEY is defined somewhere
                          AgentName: AgentName, // Assuming AgentName is defined somewhere
                          Authorization: token,
                      };
                      const apiUrlPath = `${ApiUrl}/onesignal/save?oneSignalUserId=${userId}`;
                      const response = await axios.get(apiUrlPath, {
                          headers: commonHeaders,
                      });
                    
                      location.reload();
                      // Handle the response as needed
                  } catch (error) {
                      console.error("Error:", error);
                      // Handle the error
                  }
              });
          }
      });
      

        // Automatically request notification permission when the page loads
        window.OneSignal.registerForPushNotifications();
      });
    } else {
      // OneSignal is not available, handle it as needed
      console.error("OneSignal is not available.");
    }
  }, []);
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
