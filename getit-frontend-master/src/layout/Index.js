import React, { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./sidebar/Sidebar";
import Head from "./head/Head";
import Header from "./header/Header";
import Footer from "./footer/Footer";
import AppRoot from "./global/AppRoot";
import AppMain from "./global/AppMain";
import AppWrap from "./global/AppWrap";
import FileManagerProvider from "../pages/app/file-manager/components/Context";
import { useDispatch, useSelector } from "react-redux";
import { authProvider, checkUserAuthentication, logout } from "./../utils/authProvider";
import { AzureAD, AuthenticationState } from "react-aad-msal";

import { getPermission, permissionSelector } from "../reducers/rolePermission.reducer";
import KycDetailsRegular from "../pages/pre-built/kyc-list-regular/kycDetailsRegular";
const Layout = ({ title, userProfile, userLogOut, authenticationState, ...props }) => {
  return (
    <>
      <FileManagerProvider>
        <Head title={!title && "Loading"} />
        <AppRoot>
          <AppMain>
            <Sidebar fixed />
            <AppWrap>
              
              <Header
                fixed
                userProfile={userProfile}
                userLogOut={userLogOut}
                authenticationState={authenticationState}
              />
                
              <Outlet />
              
          
            </AppWrap>
          </AppMain>
        </AppRoot>
      </FileManagerProvider>
    </>
  );
};
export default Layout;
