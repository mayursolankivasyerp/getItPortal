import React, { useState, useEffect } from "react";
import { DropdownToggle, DropdownMenu, Dropdown } from "reactstrap";
import { Icon } from "../../../../components/Component";
import { LinkList, LinkItem } from "../../../../components/links/Links";
import UserAvatar from "../../../../components/user/UserAvatar";
import { useDispatch, useSelector } from "react-redux";
import { authProvider, checkUserAuthentication, logout } from "../../../../utils/authProvider";
import { AzureAD, AuthenticationState } from "react-aad-msal";
import { useNavigate } from "react-router-dom";
import { profileLogin } from "../../../../reducers/loginProfile.reducer";
import { clearPermissionList } from "../../../../reducers/rolePermission.reducer";

const User = ({ userProfile, userLogOut, authenticationState }) => {
  const [open, setOpen] = useState(false);
  const [userDataFetch, setUserDataFetch] = useState(null);
  const toggle = () => setOpen((prevState) => !prevState);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const getInitials = (fullName) => {
    const names = fullName.split(" ");

    if (names.length > 0) {
      return names
        .map((name) => name.charAt(0))
        .join("")
        .toUpperCase();
    } else {
      return "";
    }
  };

  const userInitials = getInitials(userProfile.name);
  function getCookie(name) {
    return document.cookie.match("(^|;)\\s*" + name + "\\s*=\\s*([^;]+)")?.pop() || null;
  }
  const token = getCookie("token");

  function setCookie(name, value) {
    document.cookie = `${name}=${value};path=/`;
  }
  return (
    <>
      <Dropdown isOpen={open} className="user-dropdown" toggle={toggle}>
        <DropdownToggle
          tag="a"
          href="#toggle"
          className="dropdown-toggle"
          onClick={(ev) => {
            ev.preventDefault();
          }}
        >
          <div className="user-toggle">
            <UserAvatar icon="user-alt" className="sm" />

            <div className="user-name dropdown-indicator">Welcome {userProfile.name}</div>
          </div>
        </DropdownToggle>
        <DropdownMenu end className="dropdown-menu-md dropdown-menu-s1">
          <div className="dropdown-inner user-card-wrap bg-lighter d-none d-md-block">
            <div className="user-card sm">
              <div className="user-avatar">
                <span>{userInitials}</span>
              </div>
              <div className="user-info">
                <span className="lead-text">{userProfile.name}</span>
                <span className="sub-text">{userProfile.userName}</span>
              </div>
            </div>
          </div>
          <div className="dropdown-inner">
            <LinkList>
              <LinkItem
                link="/"
                icon="signout"
                onClick={() => {
                  navigate("/", { replace: true });
                  userLogOut();
                  setCookie("token", null);
                  dispatch(clearPermissionList());
                }}
              >
                Sign Out
              </LinkItem>
            </LinkList>
          </div>
        </DropdownMenu>
      </Dropdown>
    </>
  );
};

export default User;
