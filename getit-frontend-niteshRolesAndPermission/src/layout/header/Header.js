import React from "react";
import classNames from "classnames";
import Toggle from "../sidebar/Toggle";
import Logo from "../logo/Logo";
import User from "./dropdown/user/User";
import Notification from "./dropdown/notification/Notification";
import HeaderSearch from "../header-search/HeaderSearch";
import ChatDropdown from "./dropdown/chat/Chat";

import { useTheme, useThemeUpdate } from "../provider/Theme";

const Header = ({ fixed, className, userProfile, userLogOut, authenticationState }) => {
  const theme = useTheme();
  const themeUpdate = useThemeUpdate();

  const headerClass = classNames({
    "nk-header": true,
    "nk-header-fixed": fixed,
    [`is-light`]: theme.header === "white",
    [`is-${theme.header}`]: theme.header !== "white" && theme.header !== "light",
    [`${className}`]: className,
  });
  return (
    <div className={headerClass}>
      <div className="container-fluid">
        <div className="nk-header-wrap">
          <div className="nk-menu-trigger d-xl-none ms-n1">
            <Toggle
              className="nk-nav-toggle nk-quick-nav-icon d-xl-none ms-n1"
              icon="menu"
              click={themeUpdate.sidebarVisibility}
            />
          </div>
          <div className="nk-header-brand d-xl-none">
            <Logo />
          </div>

          <div className="nk-header-tools">
            <ul className="nk-quick-nav">
              <li className="user-dropdown" onClick={themeUpdate.sidebarHide}>
                <User userProfile={userProfile} userLogOut={userLogOut} authenticationState={authenticationState} />
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Header;


















// ---------------------------------  Old code  ---------------------------
// import React from "react";
// import classNames from "classnames";
// import Toggle from "../sidebar/Toggle";
// import Logo from "../logo/Logo";
// import User from "./dropdown/user/User";
// import Notification from "./dropdown/notification/Notification";
// import HeaderSearch from "../header-search/HeaderSearch";
// import ChatDropdown from "./dropdown/chat/Chat";

// import { useTheme, useThemeUpdate } from '../provider/Theme';

// // const Header = ({ fixed, className, ...props , userProfile,userLogOut}) => {
//   const Header = ({ fixed, className,userProfile,userLogOut, authenticationState}) => {

//   const theme = useTheme();
//   const themeUpdate = useThemeUpdate();

//   const headerClass = classNames({
//     "nk-header": true,
//     "nk-header-fixed": fixed,
//     [`is-light`]: theme.header === "white",
//     [`is-${theme.header}`]: theme.header !== "white" && theme.header !== "light",
//     [`${className}`]: className,
//   });
//   return (
//     <div className={headerClass}>
//       <div className="container-fluid">
//         <div className="nk-header-wrap">
//           <div className="nk-menu-trigger d-xl-none ms-n1">
//             <Toggle
//               className="nk-nav-toggle nk-quick-nav-icon d-xl-none ms-n1"
//               icon="menu"
//               click={themeUpdate.sidebarVisibility}
//             />
//           </div>
//           <div className="nk-header-brand d-xl-none">
//             <Logo />
//           </div>
//           {/* <div className="nk-header-search ms-3 ms-xl-0">
//             <HeaderSearch />
//           </div> */}
//           <div className="nk-header-tools">
//             <ul className="nk-quick-nav">
//               {/* <li className="chats-dropdown hide-mb-xs"  onClick={themeUpdate.sidebarHide}>
//                 <ChatDropdown />
//               </li>
//               <li className="notification-dropdown me-n1"  onClick={themeUpdate.sidebarHide}>
//                 <Notification />
//               </li> */}
//               <li className="user-dropdown"  onClick={themeUpdate.sidebarHide}>
//               <User userProfile={userProfile} userLogOut={userLogOut}  authenticationState ={authenticationState}/>
//               </li>
//             </ul>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };
// export default Header;
// -------------------------------------  old code    end  ----------------------------
