import React, { useEffect, useState } from "react";
import Content from "../../../layout/content/Content";
import Head from "../../../layout/head/Head";
import { Block, BlockBetween, BlockHead, BlockHeadContent, BlockTitle, Col, Icon, Row } from "../../../components/Component";
import TrafficSources from "../../../components/partials/e-commerce/traffic-sources/TrafficSources";
import DataCard from "../../../components/partials/default/DataCard";
import { TrafficSourcesChart, Agents, DynamicDonutChart } from "../../../components/partials/charts/e-commerce/EcomCharts";
import { getTotalDashboardActivity, totalDashboardTicketAgents, totalDashboardTicketCategories } from "../../../reducers/dashboard.reducer";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "reactstrap";
import { APIKEY, AccessControlOrigin, AgentName, ApiUrl } from "../../../utils/Constant";
import axios from "axios";
import { toast } from "react-toastify";
import FeedBackSidebar from "../../pre-built/user-manage/FeedBackSideBar";

const Dashboard = () => {
  const dispatch = useDispatch();
  const [selectedButton, setSelectedButton] = useState("All");
  const [sync,setSync]=useState("")
  //const [token, setToken] = useState(getCookie("GetItToken"));
  function getCookie(name) {
    return document.cookie.match("(^|;)\\s*" + name + "\\s*=\\s*([^;]+)")?.pop() || null;
  }
  const token = getCookie("GetItToken");

  const {
    dashboard: { totalDashboardActivityList },
  } = useSelector((state) => state);

  const {
    dashboard: { totalDashboardCategoriesList },
  } = useSelector((state) => state);
  const {
    dashboard: { totalDashboardAgentList },
  } = useSelector((state) => state);
  useEffect(() => {
    dispatch(getTotalDashboardActivity(token));
    dispatch(totalDashboardTicketCategories({ status: "All", token: token }));
    dispatch(totalDashboardTicketAgents({ status: "Open", token: token }));
  }, []);

  const fetchCategoriesData = (status) => {
    dispatch(totalDashboardTicketCategories({ status, token: token }));
  };
  const fetchAgentsData = (status) => {
    dispatch(totalDashboardTicketAgents({ status: status, token: token }));
  };
  // const generateColorFromLabel = (label, number) => {
  //   let hash = 0;
  //   for (let i = 0; i < label.length; i++) {
  //     hash = label.charCodeAt(i) + ((hash << 5) - hash);
  //   }
  //   const color = "#" + ((hash & 0xffffff) << 1).toString(16).padStart(6, "0");
  //   return color;
  // };
  const generateColorFromLabel = (label, colors) => {
    const index = colors.findIndex((c) => c.label === label);
    if (index !== -1) {
      return colors[index].color;
    } else {
      // If label is not found in the colors array, add it with a new color
      const newColor = colors.length % 10; // Use a modulus to cycle through colors
      colors.push({ label, color: `hsl(${newColor * 36}, 70%, 50%)` });
      return `hsl(${newColor * 36}, 70%, 50%)`;
    }
  };
  const [chartData, setChartData] = useState(null);
  useEffect(() => {
    // Simulating API response
    const apiResponse = totalDashboardCategoriesList?.response;

    setChartData(apiResponse);
    localStorage.removeItem("FilterCreateByGetIT");
    localStorage.removeItem("FilterTicketTypeGetIT");
    localStorage.removeItem("FilterStatusGetIT");
    localStorage.removeItem("FilterPriorityGetIT");
    localStorage.removeItem("FiltercreateOnGetIT");
    localStorage.removeItem("FiltercreateOnGetIT");
    localStorage.removeItem("FilterStatusInputGetIT");
    localStorage.removeItem("FilterPriorityInputGetIT");
    localStorage.removeItem("FilterCreateByInputGetIT");
    localStorage.removeItem("FilterTicketTypeInputGetIT");
  }, [totalDashboardCategoriesList]);
  const colorsArray = [];
  const categoriesItems =
    totalDashboardCategoriesList?.response?.map((item) => ({
      label: item.sub_type,
      color: generateColorFromLabel(item.sub_type, colorsArray),
      data: item.ticket_count.toString(),
    })) || [];
  const agentsItems =
  totalDashboardAgentList?.response?.map((item) => (
    
    {
      label: item.AgentName,
      color: generateColorFromLabel(item.AgentName, colorsArray),
      data: item.Count.toString(),
    }
    )) || [];
  const dashboardArray = [
    {
      title: 'totalAgents',
      value : totalDashboardActivityList?.response?.totalAgents,
      icon: "users-fill",
      color: "bg-info",
    },
    {
      title: 'Total Categories',
      value : totalDashboardActivityList?.response?.totalCategories,
      icon: "view-list-wd",
      color: "bg-warning",
    },
    {
      title: 'Open Tickets',
      value : totalDashboardActivityList?.response?.openTickets,
      icon: "ticket-alt-fill",
      color: "bg-success",
    },
    {
      title: 'Close Entries',
      value : totalDashboardActivityList?.response?.closeEntries,
      icon: "cross-fill-c",
      color: "bg-danger",
    },
  ]  

  const handleSync = async () =>{
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

      const apiUrlPath = `${ApiUrl}/users/sync`;
      const response = await axios.get(apiUrlPath, {
              headers: commonHeaders,
      });
      setSync(response?.data)
      debugger
      
      if (sync?.status === true) {
        return  toast.success(response?.data?.message);
      }  
    } catch (error) {
       toast.warning(error)
      throw error; // This is assuming that error.response.responseData is not a valid property.
    }
  }
 
  // console.log(sync,"synccc")
  return (
    <React.Fragment>
      <Head title="Dashboard"></Head>
      <Content>
        <BlockHead size="sm">
          <BlockBetween>
            <BlockHeadContent>
              <BlockTitle page>Dashboard</BlockTitle>
            </BlockHeadContent>
            <Button color="light"  outline className="bg-primary d-none d-sm-inline-flex mt-3 text-light" onClick={()=>handleSync()}>
                  
            <Icon name="update"></Icon>
                  <span>Sync</span>
                </Button>
          </BlockBetween>
        </BlockHead>

        <Block>
          <Row className="g-gs">
            <Col xxl="12" lg="12">
              <Row className="g-gs">
                {
                  dashboardArray.map((dashboardItem,index)=>{
                    return(
                    <Col key={index} xxl="3" md="3" sm="6">
                      <DataCard
                        title={dashboardItem.title}
                        percentChange={"4.63"}
                        up={true}
                        icon={dashboardItem.icon}
                        amount={dashboardItem.value || 0}
                        color={dashboardItem.color}
                      />
                    </Col>
                    )
                  })
                }
              </Row>
            </Col>
            <Col xxl="6" lg="6">
            {/* {chartData && <DynamicDonutChart data={chartData} />}  */}
              <TrafficSources
                title="Entries by agents"
                attribute=""
                componentType={<Agents categoriesItems={agentsItems}/>}
                categoriesItems={agentsItems}
                openTickets="Open Tickets"
                closedEntries="Closed Entries"
                All="All Tickets"
                onAllClick={() => {
                  setSelectedButton("All");
                  fetchAgentsData("All");
                }}
                onOpenTicketsClick={() => {
                  setSelectedButton("open");
                  fetchAgentsData("Open");
                }}
                onClosedEntriesClick={() => {
                  setSelectedButton("closed");
                  fetchAgentsData("Closed");
                }}
              />
            </Col>
            <Col xxl="6" lg="6">
              <TrafficSources
                title="Ticket by categories"
                attribute=""
                componentType={<Agents categoriesItems={categoriesItems}/>}
                categoriesItems={categoriesItems}
                openTickets="Open Tickets"
                closedEntries="Closed Entries"
                All="All Tickets"
                onAllClick={() => {
                  setSelectedButton("All");
                  fetchCategoriesData("All");
                }}
                onOpenTicketsClick={() => {
                  setSelectedButton("open");
                  fetchCategoriesData("Pending");
                }}
                onClosedEntriesClick={() => {
                  setSelectedButton("closed");
                  fetchCategoriesData("Closed");
                }}
              />
            </Col>
          </Row>
        </Block>
      </Content>
      
    </React.Fragment>
  );
};

export default Dashboard;
