import React, { useContext, useEffect, useState } from "react";
import Content from "../../../layout/content/Content";
import Head from "../../../layout/head/Head";
import { Block, BlockBetween, BlockHead, BlockHeadContent, BlockTitle, Col, Row } from "../../../components/Component";
import RecentOrders from "../../../components/partials/default/recent-orders/RecentOrders";
import TopProducts from "../../../components/partials/default/top-products/TopProducts";
import AverageOrder from "../../../components/partials/e-commerce/average-order/AverageOrder";
import Customer from "../../../components/partials/e-commerce/customers/Customer";
import Orders from "../../../components/partials/e-commerce/orders/Orders";
import TotalSales from "../../../components/partials/e-commerce/total-sales/TotalSales";
import StoreStatistics from "../../../components/partials/default/StoreStatistics";
import TrafficSources from "../../../components/partials/e-commerce/traffic-sources/TrafficSources";
import StoreVisitors from "../../../components/partials/e-commerce/store-visitors/StoreVisitors";
import DataCard from "../../../components/partials/default/DataCard";
import { TrafficSourcesChart, Agents } from "../../../components/partials/charts/e-commerce/EcomCharts";
import { getTotalDashboardActivity, totalDashboardTicketCategories } from "../../../reducers/dashboard.reducer";
import { Doughnut } from "react-chartjs-2";
import { useDispatch, useSelector } from "react-redux";

const Dashboard = () => {
  const dispatch = useDispatch();
  const [selectedButton, setSelectedButton] = useState("All");
  //const [token, setToken] = useState(getCookie("token"));
  function getCookie(name) {
    return document.cookie.match("(^|;)\\s*" + name + "\\s*=\\s*([^;]+)")?.pop() || null;
  }
  const token = getCookie("token");

  const {
    dashboard: { totalDashboardActivityList },
  } = useSelector((state) => state);

  const {
    dashboard: { totalDashboardCategoriesList },
  } = useSelector((state) => state);
  useEffect(() => {
    dispatch(getTotalDashboardActivity(token));
    dispatch(totalDashboardTicketCategories({ status: "All", token: token }));
  }, []);

  const fetchDataForSelectedButton = (status) => {
    dispatch(totalDashboardTicketCategories({ status, token: token }));
  };
  const top100Films = [
    { color: "#F44336" },
    { color: "#E91E63" },
    { color: "#9C27B0" },
    { color: "#673AB7" },
    { color: "#3F51B5" },
    { color: "#FF0000" },
    { color: "#FF5555" },
    { color: "#FFFFFF" },
  ];
  // const generateRandomColor = () => {
  //   const initialArray = [];
  //   const letters = "0123456789ABCDEF";
  //   let color = "#";

  //   for (let i = 0; i < 6; i++) {
  //     color += letters[Math.floor(Math.random() * 16)];
  //   }
  //   initialArray.push(color);

  //   return color;
  // };

  // // Use the data from totalDashboardCategoriesList?.response to generate legendItems
  // const legendItems =
  //   totalDashboardCategoriesList?.response?.map((item) => ({
  //     label: item.sub_type,
  //     color: generateRandomColor(), // Use the dynamic color generator function
  //     data: item.ticket_count.toString(), // Convert data to string if necessary
  //   })) || [];

  const generateColorFromLabel = (label) => {
    let hash = 0;
    for (let i = 0; i < label.length; i++) {
      hash = label.charCodeAt(i) + ((hash << 5) - hash);
    }

    const color = "#" + ((hash & 0xffffff) << 0).toString(16).padStart(6, "0");
    return color;
  };

  const legendItems =
    totalDashboardCategoriesList?.response?.map((item) => ({
      label: item.sub_type,
      color: generateColorFromLabel(item.sub_type),
      data: item.ticket_count.toString(),
    })) || [];
  return (
    <React.Fragment>
      <Head title="Dashboard"></Head>
      <Content>
        <BlockHead size="sm">
          <BlockBetween>
            <BlockHeadContent>
              <BlockTitle page>Dashboard</BlockTitle>
            </BlockHeadContent>
          </BlockBetween>
        </BlockHead>

        <Block>
          <Row className="g-gs">
            <Col xxl="4">
              <Row className="g-gs">
                <Col xxl="12" md="3" sm="6">
                  <DataCard
                    title="Total Agents"
                    percentChange={"4.63"}
                    up={true}
                    icon={"users-fill"}
                    amount={totalDashboardActivityList?.response?.totalAgents || 0}
                    color={"bg-info"}
                  />
                </Col>
                <Col xxl="12" md="3" sm="6">
                  <DataCard
                    title="Total Categories"
                    percentChange={"4.63"}
                    up={true}
                    icon={"view-list-wd"}
                    amount={totalDashboardActivityList?.response?.totalCategories || 0}
                    color={"bg-warning"}
                  />
                </Col>

                <Col xxl="12" md="3" sm="6">
                  <DataCard
                    title="Open Tickets"
                    percentChange={"4.63"}
                    up={true}
                    icon={"ticket-alt-fill"}
                    amount={totalDashboardActivityList?.response?.openTickets || 0}
                    color={"bg-success"}
                  />
                </Col>
                <Col xxl="12" md="3" sm="6">
                  <DataCard
                    title="Close Entries"
                    percentChange={"4.63"}
                    up={true}
                    icon={"cross-fill-c"}
                    amount={totalDashboardActivityList?.response?.closeEntries || 0}
                    color={"bg-danger"}
                  />
                </Col>
              </Row>
            </Col>
            <Col xxl="6" lg="6">
              <TrafficSources
                title="Entries by agents"
                attribute=""
                componentType={<Agents />}
                legendItems={[
                  { label: "Vishal Mevada", color: "#FF0000", data: 500 },
                  { label: "Anirudh Chavda", color: "#00FF00", data: 200 },
                  { label: "Other", color: "#0000FF", data: 200 },
                ]}
                openTickets="Open Tickets"
                closedEntries="Closed Entries"
                All="All Tickets"
              />
            </Col>
            <Col xxl="6" lg="6">
              <TrafficSources
                title="Ticket by categories"
                attribute=""
                componentType={<TrafficSourcesChart dynamica={legendItems} />}
                legendItems={legendItems}
                openTickets="Open Tickets"
                closedEntries="Closed Entries"
                All="All Tickets"
                onAllClick={() => {
                  setSelectedButton("All");
                  fetchDataForSelectedButton("All");
                }}
                onOpenTicketsClick={() => {
                  setSelectedButton("open");
                  fetchDataForSelectedButton("Pending");
                }}
                onClosedEntriesClick={() => {
                  setSelectedButton("closed");
                  fetchDataForSelectedButton("Closed");
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
