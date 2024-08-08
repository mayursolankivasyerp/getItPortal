import React, { useEffect, useState } from "react";
import { DropdownToggle, DropdownMenu, UncontrolledDropdown } from "reactstrap";
// import  useHistory  from "react-router-dom";
import { useDispatch,useSelector } from "react-redux";
import Icon from "../../../../components/icon/Icon";
import data from "./NotificationData";
import { APIKEY, AccessControlOrigin, AgentName, ApiUrl } from "../../../../utils/Constant";
import axios from "axios";
import { useNavigate } from "react-router";
import { Link } from "react-router-dom";
import { profileLogin } from "../../../../reducers/loginProfile.reducer"
import "./Notification.css"
const NotificationItem = (props) => {
  const { icon, iconStyle, text, time, id, notificationUrl, notificationMsg } = props;
  // const history = useHistory();
  const navigate = useNavigate();

  const handleNotificationClick = () => {
    // e.preventDefault();
    const ticketId = notificationUrl.split("/")[1];
    // navigate(`/ticket/${ticketId}`);
  };
  useEffect(() => {
    handleNotificationClick();
  }, [notificationUrl]);
 
  return (
    <>
      <div className="nk-notification-item" key={id} id={id}>
        <div className="nk-notification-icon">{icon ? <div className="icon-circle">{icon}</div> : null}</div>
        <div className="nk-notification-content">
          <a href={`/ticket/${notificationUrl.split("/")[1]}`} onClick={(e) => handleNotificationClick(e)}>
            <div className="nk-notification-text">{text}</div>
            <div className="nk-notification-time">{time}</div>
          </a>
        </div>
      </div>
    </>
  );
};

const Notification = ({userLogOut,userProfile}) => {
  const [notificationMsg, setNotificationMsg] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(true);
  const dispatch = useDispatch();
  // const [notificationMsg, setNotificationMsg] = useState([]);
  function getCookie(name) {
    return document.cookie.match("(^|;)\\s*" + name + "\\s*=\\s*([^;]+)")?.pop() || null;
  }
  let token = getCookie("GetItToken");
  function setCookie(name, value) {
    document.cookie = `${name}=${value};path=/`;
  }
  const getAllNotifications = async () => {
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

      const apiUrlPath = `${ApiUrl}/notication/`;
      const response = await axios.get(apiUrlPath, {
        headers: commonHeaders,
      });
      setNotificationMsg(response.data.response);
    } catch (error) {
    
      if(error.response.status == 401){
        //navigate("/", { replace: true });
        //userLogOut();
        setCookie("GetItToken", null);
  
        dispatch(profileLogin({ userName: userProfile?.name, email: userProfile?.userName }))
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
        //dispatch(clearPermissionList());
      }
      throw error; // This is assuming that error.response.responseData is not a valid property.
    }
  };
  const ClearAllNotification = async () => {
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

      const apiUrlPath = `${ApiUrl}/notication/clear-all`;
      const response = await axios.get(apiUrlPath, {
        headers: commonHeaders,
      });
      setNotificationMsg(response.data.response);
    } catch (error) {
      throw error; // This is assuming that error.response.responseData is not a valid property.
    }
  };
 

  const handleClearAll = async () => {
    try {
      await ClearAllNotification();
      setNotificationMsg([]);
      getAllNotifications();
    } catch (error) {
      console.error("Error clearing notifications:", error);
    }
  };
  const handleApiCall = () =>{
     getAllNotifications((token))
  
  }
  useEffect(()=>{
      handleApiCall()
  },[NotificationItem])
  
 
 
  return (
    <UncontrolledDropdown className="user-dropdown">
      <DropdownToggle tag="a" className="dropdown-toggle nk-quick-nav-icon" onClick={(e) => handleApiCall(e)}>
      {
      notificationMsg.length == 0 ?(
    <Icon name="bell" />

    ) : (
      <div className="icon-status icon-status-info"> 
      <Icon name="bell" />
      </div> 
  )
}
      </DropdownToggle>
      <DropdownMenu end className="dropdown-menu-xl dropdown-menu-s1">
        <div className="dropdown-head">
          <span className="sub-title nk-dropdown-title">{data.title}</span>
          <a
            onClick={(ev) => handleClearAll(ev)}
            style={{ cursor: "pointer" }} // Set the cursor property to 'pointer'
          >
            Clear All
          </a>
        </div>
        <div className="dropdown-body">
          <div className="nk-notification">
            {notificationMsg.length == 0 ? (
               <div className="center-text">
                <div className="nk-notification-text">No Notification found</div>
                </div>
            ) : (
              notificationMsg.map((item) => (
                <NotificationItem
                  key={item.id}
                  id={item.id}
                  icon={item.createdBy[0]}
                  text={item.notificationDescription}
                  time={item.createdOn}
                  notificationUrl={item.notificationUrl}
                />
              ))
            )}
          </div>
        </div>
        {/* <div className="dropdown-foot center">
          <a href="#viewall" onClick={(ev) => ev.preventDefault()}>
            View All
          </a>
        </div> */}
      </DropdownMenu>
    </UncontrolledDropdown>
  );
};

export default Notification;
