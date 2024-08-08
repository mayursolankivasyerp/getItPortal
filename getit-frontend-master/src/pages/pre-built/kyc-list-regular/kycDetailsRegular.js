import React, { useEffect, useState } from "react";
import classnames from "classnames";
import { useDispatch, useSelector } from "react-redux";
import Content from "../../../layout/content/Content";
import { TabContent, TabPane } from "reactstrap";
import Head from "../../../layout/head/Head";
import { Nav, NavItem, NavLink } from "reactstrap";
import {
  Button,
  Block,
  BlockBetween,
  BlockDes,
  BlockHead,
  BlockHeadContent,
  BlockTitle,
  Icon,
  Row,
  Col,
  PreviewCard,
  Sidebar,
} from "../../../components/Component";
import { useParams, useNavigate } from "react-router-dom";
import { APIKEY, AccessControlOrigin, AgentName, ApiUrl } from "../../../utils/Constant";
import axios from "axios";
import TicketDetailsContent from "./TicketDetailsContent";
// import { formatDate } from "@fullcalendar/common";
// import TicketPipeLine from "./TicketPipeLine";
import CommentBox from "./CommentBox";
import { formatDate } from "../../../utils/Utils";
import Header from "../../../layout/header/Header";
import Error504Classic from "../../error/504-classic";

const KycDetailsRegular = ({userProfile}) => {
  
  const navigate = useNavigate();
  const { ticketId } = useParams();
  const [ticket, setTicket] = useState({});
 
  const [activeTab, setActiveTab] = useState("ticket");
  const [accessDenied, setAccessDenied] = useState("")
 
  function getCookie(name) {
    return document.cookie.match("(^|;)\\s*" + name + "\\s*=\\s*([^;]+)")?.pop() || null;
  }
  const token = getCookie("GetItToken");
 

  const toggle = (tab) => {
    if (activeTab !== tab) setActiveTab(tab);
  };
  //  console.log(ticket,"tickett")
  useEffect(() => {
    ticketDetails(ticketId);
  }, []);

  // Get Ticket Details Data from the Database
  const ticketDetails = async (ticketId) => {
 
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
      const apiUrlPath = `${ApiUrl}/ticket/details/${ticketId}`;
 
      const response = await axios.get(apiUrlPath, {
        headers: commonHeaders,
      });

      setAccessDenied(response.data.message)
 
      setTicket(response.data.response);
      

    } catch (error) {
      throw error; // This is assuming that error.response.responseData is not a valid property.
    }
  };
 
  const handleGoBack = () => {
    navigate(-1);
  };

  
  // console.log("accessDenied",accessDenied )

  return (
    <>
  
    <React.Fragment>
    {
      accessDenied === "Access Denied" && (
          // <h1 style={{fontSize:"100px"}}>Access Denied</h1>
          <Error504Classic/>
         
      )
    }
 
     
      <Head title="KYC Details - Regular"></Head>
      {ticket && (
        <Content>
          <BlockHead size="sm">
            <BlockBetween className="g-3">
              {/* <BlockHeadContent>
                <BlockTitle page>
                  Ticket/<strong className="text-primary small">{ticket.title}</strong>
                </BlockTitle>
                <BlockDes className="text-soft">
                  <ul className="list-inline">
                    <li>
                      Ticket ID: <span className="text-base">{ticketId}</span>
                    </li>
                    <li>
                      Submitted At: <span className="text-base">{ticket.createdOn}</span>
                    </li>
                  </ul>
                </BlockDes>
              </BlockHeadContent> */}
                <BlockHeadContent>
        <BlockTitle page>
          Ticket /<strong className="text-primary small">{ticket[0]?.title}</strong>
        </BlockTitle>
        <BlockDes className="text-soft">
          <ul className="list-inline">
            <li>
              Ticket ID: <span className="text-base">{ticket[0]?.ticketId}</span>
            </li>
            <li>
              Submitted At: <span className="text-base">{ticket[0]?.createdOn}</span>
            </li>
          </ul>
          <Button color="light" onClick={handleGoBack} outline className="bg-white d-none d-sm-inline-flex mt-3">
                  <Icon name="arrow-left"></Icon>
                  <span>Back</span>
                </Button>
                <Button color="light" outline className="btn-icon bg-white d-inline-flex d-sm-none">
                  <Icon name="arrow-left"></Icon>
                </Button>
        </BlockDes>
      </BlockHeadContent>
              <BlockHeadContent>
                {/* <Link to={`${process.env.PUBLIC_URL}/kyc-list-regular`}> */}
                {/* <Button color="light" onClick={handleGoBack} outline className="bg-white d-none d-sm-inline-flex">
                  <Icon name="arrow-left"></Icon>
                  <span>Back</span>
                </Button>
                <Button color="light" outline className="btn-icon bg-white d-inline-flex d-sm-none">
                  <Icon name="arrow-left"></Icon>
                </Button> */}
                {/* </Link> */}
              </BlockHeadContent>
            </BlockBetween>
          </BlockHead>
          <PreviewCard>
            <Nav tabs className="mt-n3">
              <NavItem>
                <NavLink
                  tag="a"
                  href="#tab"
                  className={classnames({ active: activeTab === "ticket" })}
                  onClick={(ev) => {
                    ev.preventDefault();
                    toggle("ticket");
                  }}
                >
                  Ticket info
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink
                  tag="a"
                  href="#tab"
                  className={classnames({ active: activeTab === "comments" })}
                  onClick={(ev) => {
                    ev.preventDefault();
                    toggle("comments");
                  }}
                >
                  Comments
                </NavLink>
              </NavItem>
            </Nav>
            <TabContent activeTab={activeTab}>
            {activeTab === "ticket" && <TabPane tabId="ticket">
                <Block>
                  <Row className="gy-5">
                    <TicketDetailsContent ticket={ticket} />
                  </Row>
                </Block>
              </TabPane>
            }
              {activeTab === "comments" && <TabPane tabId="comments">
                <Block>
                  <Row className="gy-5">
                  <Col lg="12" className={"comment-view"}>
                    <CommentBox userProfile={userProfile} ticket={ticket} ticketId={ticketId}/>
                  </Col>
                  {/* <Col lg="6">
                    <TicketPipeLine ticketId={ticketId}/>
                  </Col> */}
                  </Row>
                </Block>
              </TabPane>}
            </TabContent>
          </PreviewCard>
        </Content>
      )}
 
    </React.Fragment>
    </>
  );
};
export default KycDetailsRegular;