import React, { useEffect, useLayoutEffect, useState } from "react";
// import { Routes, Route, useLocation } from "react-router-dom";
import { Routes, Route, Navigate, useLocation, useNavigate } from "react-router-dom";

import { useSelector } from "react-redux";
import EcomDashboard from "../pages/panel/e-commerce/index";

import TicketTypeList from "../pages/pre-built/ticketTypes/TicketTypeList";
import TicketLists from "../pages/pre-built/user-manage/TicketLists";
import Error404Modern from "../pages/error/404-modern";
import Layout from "../layout/Index";
import Success from "../pages/auth/Success";
import { AccessControlOrigin, emailUrl } from "../utils/Constant";
import axios from "axios";
import KycDetailsRegular from "../pages/pre-built/kyc-list-regular/kycDetailsRegular";
import HomePage from "../pages/pre-built/user-manage/HomePage";
import DocumentsEmp from "../pages/pre-built/user-manage/DocumentsEmp";
const Router = ({ userProfile, userLogOut, authenticationState }) => {
  const [loader, setLoader] = useState(false);

  const location = useLocation();
  const navigate = useNavigate(); // Get the navigate function

  useLayoutEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);
  useEffect(() => {
    if (location.pathname === "/ticket-approval") {
      const Url = `${emailUrl}${location.pathname}${location.search}`;
      axios
        .get(Url, {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": AccessControlOrigin,
          },
        })
        .then((response) => {
          if (response.status == 200) {
            setLoader(true);
            navigate("/auth-success" + location.search);
          }
          setLoader(true);
        })
        .catch((error) => {
          throw new Error(error);
          setLoader(true);
        });
    }
  }, [location]);

  const {
    permission: { permissionList },
  } = useSelector((state) => state);
  const menuItems = permissionList.response || []; // Default to an empty array if permissionList.response is not available
  const [first, setfirst] = useState(false);
  // const activeRoutes = menuItems.filter(item => item.status === "active");
  // console.log("activeRoutes", activeRoutes)
  // const activeRoutes = menuItems.filter(item => {
  //   if (item.menuURL === "#") {
  //     return item.subMenu.filter((sub)=>{
  //      return sub.status === "active"
  //     })
  //   } else {
  //     return item.status === "active" && item.menuURL !== "#";
  //   }
  // });
  useEffect(() => {
    if (menuItems.length > 0) {
      setfirst(true);
    }
  }, [menuItems]);

  const activeRoutes1 = menuItems.length > 0 && menuItems.filter((item) => item.menuURL === "#");
  const activeRoutes2 =
    activeRoutes1 != null &&
    activeRoutes1.length > 0 &&
    activeRoutes1.map((item) => item.subMenu.filter((sub) => sub.status === "active"));
  // const activeRoutes = getRouteFunc(menuItems)
  const getRouteFunc = (item) => {
    item.filter((obj) => {
      if (item.menuURL === "#") {
        return getRouteFunc(item.subMenu);
      } else {
        return item.subMenu.map((sub) => {
          return sub.status === "active";
        });
      }
    });
  };
  //  console.log("activeRoutes", activeRoutes)
  const firstActiveRoute = activeRoutes2?.length > 0 ? activeRoutes2[0][0] : null;
  // const firstActiveRoute = activeRoutes.length > 0 ? activeRoutes[0] : null;

  const renderRoute = (route) => {
    // console.log("route",route)
    let Component;
    if (route.menuURL === "/home") {
      Component = <HomePage />;
    } else if (route.menuURL === "/dashboard") {
      Component = (
        <EcomDashboard userLogOut={userLogOut} authenticationState={authenticationState} userProfile={userProfile} />
      );
    } else if (
      route.menuURL === "/document/type/SOP" ||
      route.menuURL === "/document/type/DIY" ||
      route.menuURL === "/document/type/Other"||
      route.menuURL === "/document/type/Policy"
    ) {
      Component = <DocumentsEmp menuURL={route?.menuURL} typeData={route} action={route.action} />;
    } else {
      Component = <TicketLists menuData={route} action={route.action} />;
    }

    return (
      <Route
        exact
        path={route.menuURL}
        element={Component}
        routeName={route.name}
        key={route.navMenuId} // Use a unique key here
      />
    );
  };

  const renderRoutesRecursive = (routes) => {
    return routes.map((route) => {
      if (route.subMenu && route.subMenu.some((subItem) => subItem.status === "active")) {
        return (
          <React.Fragment key={route.navMenuId}>
            {renderRoute(route)}
            {renderRoutesRecursive(route.subMenu)}
          </React.Fragment>
        );
      } else {
        return renderRoute(route);
      }
    });
  };

  return (
    first && (
      <Routes>
        <Route
          element={
            <Layout userProfile={userProfile} userLogOut={userLogOut} authenticationState={authenticationState} />
          }
        >
           <Route path="/" element={<HomePage />}></Route>
          {renderRoutesRecursive(menuItems)}
        </Route>
     
        <Route path="/auth-success" element={<Success status={location.search} />} />
        {loader && <Route path="*" element={<Error404Modern />} />} {/* Catch-all route for undefined paths */}
        <Route
          element={
            <Layout userProfile={userProfile} userLogOut={userLogOut} authenticationState={authenticationState} />
          }
        >
          {" "}
          <Route path="/ticket/:ticketId" element={<KycDetailsRegular userProfile={userProfile} />} />
        </Route>
        {/* <Route path="/success" element={<Success />} />  */}
      </Routes>
    )
  );
};

export default Router;
