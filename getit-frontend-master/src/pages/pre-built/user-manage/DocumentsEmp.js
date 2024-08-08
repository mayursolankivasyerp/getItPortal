import React, { useEffect, useState } from "react";
import { APIKEY, AccessControlOrigin, AgentName, ApiUrl } from "../../../utils/Constant";
import axios from "axios";
import { BlockHead, BlockHeadContent, BlockTitle, Icon } from "../../../components/Component";
import FeedBackSidebar from "./FeedBackSideBar";

const DocumentsEmp = ({ menuURL, typeData }) => {
  //   console.log("menuURL-->", typeData);
  const [typeDynamicData, setTypeDyamicData] = useState([]);
  function getCookie(name) {
    return document.cookie.match("(^|;)\\s*" + name + "\\s*=\\s*([^;]+)")?.pop() || null;
  }
  const token = getCookie("GetItToken");
  const getAllFeedBack = async () => {
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

      const apiUrlPath = `${ApiUrl}${menuURL}`;
      const response = await axios.get(apiUrlPath, {
        headers: commonHeaders,
      });
      setTypeDyamicData(response?.data?.response);
    } catch (error) {
      throw error;
    }
  };

  useEffect(() => {
    getAllFeedBack(token);
  }, [menuURL]);
  // console.log("typeee---->", typeDynamicData);
  return (
    <>
      <section style={{ marginTop: "100px" }}>
        <h3 style={{ marginLeft: "59px", marginBottom: "20px" }}>{typeData.title}</h3>
        <div className="container">
          <div className="row">
            {typeDynamicData.length === 0 ? (
              <div className="col-lg-12">
                <p>No data available</p>
              </div>
            ) : (
              typeDynamicData.map((item, index) => (
                <div className="col-lg-6" key={index}>
                  <div
                    className="content d-flex"
                    style={{
                      boxShadow: "-1px 1px 2px 2px lightgray",
                      padding: "10px",
                      borderRadius: "10px",
                      marginBottom: "10px",
                    }}
                  >
                    <div className="icon" style={{ width: "8%", marginRight: "20px", height: "20px" }}>
                      {item.iconUrl !== null ? (
                        <img src={item.iconUrl} alt={""} style={{ width: "50px", height: "30px" }} />
                      ) : (
                        <Icon className="icon ni ni-file-docs" style={{ width: "100px", height: "300px" }}></Icon>
                      )}
                    </div>

                    <div className="data">
                      <a href={item.fileUrl} target="_blank" rel="noopener noreferrer">
                        {item.fileUrlName}
                      </a>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
        <FeedBackSidebar />
      </section>
    </>
  );
};

export default DocumentsEmp;
