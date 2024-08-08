import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Block,
  BlockBetween,
  BlockHead,
  BlockHeadContent,
  BlockTitle,
  Icon,
  Button,
  PreviewCard,
  ReactDataTable,
  RSelect,
  DataTableRow,
} from "../../../components/Component";
import Content from "../../../layout/content/Content";
import Head from "../../../layout/head/Head";
import AddModal from "./AddModal";
import ViewRequest from "./ViewAllRequest";
import classnames from "classnames";
import {
  cancleTicket,
  fetchAllTicketRecord,
  myTeamTicketRecord,
  statusChange,
  statusReject,
} from "../../../reducers/ticketRequest.reducer";
import {
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Nav,
  NavItem,
  NavLink,
  TabContent,
  TabPane,
  UncontrolledDropdown,
} from "reactstrap";
import { APIKEY, AccessControlOrigin, AgentName, ApiUrl } from "../../../utils/Constant";
import axios from "axios";
import "./ticketLists.css";
import { Navigate, useLocation, useNavigate } from "react-router";
import TicketTypeModal from "../ticketTypes/FormModal";
import { deleteDocumentsById, deleteTicketTypeById, getAllTicketType } from "../../../reducers/ticketType.reducer";
import RejectModal from "./RejectModal";
import FeedBackSidebar from "./FeedBackSideBar";
import DocumentModel from "../ticketTypes/DocumentsModel";

const TicketLists = ({ menuData }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  function getCookie(name) {
    return document.cookie.match("(^|;)\\s*" + name + "\\s*=\\s*([^;]+)")?.pop() || null;
  }
  const token = getCookie("GetItToken");

  const [sm, updateSm] = useState(false);
  const [modal, setModal] = useState(false);
  const [selectedType, setSelectedType] = useState("General");

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedId, setSelectedId] = useState("");
  const {
    ticketRequest: { fetchAllTicketList },
  } = useSelector((state) => state);
  const {
    ticketRequest: { myTeamTickets },
  } = useSelector((state) => state);
  const [selectedData, setSelectedData] = useState(null);
  const [dynamicData, setDynamicData] = useState([]);
  const [myTeamData, setMyteamData] = useState([]);

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [qsearchValue, setQSearchValue] = useState("");
  const [qtypeOptions, setQTypeOptions] = useState([]);
  const [totalTickets, setTotalTickets] = useState();
  const [totalTeamTickets, setTotalTeamTickets] = useState();
  const [rowsPerPage, setRowsPerPage] = useState(20);
  const [searchValue, setSearchValue] = useState(localStorage.getItem("searchValueGetIt") || "");
  const storedPageNumber = localStorage.getItem("currentPageGetIT");
  const [currentPage, setCurrentPage] = useState(storedPageNumber ? parseInt(storedPageNumber, 10) : 1);
  const [activeTab, setActiveTab] = useState("1");
  const [typeOfTable, setTypeOfTable] = useState("1");
  const [activeIconTab, setActiveIconTab] = useState("5");
  const [activeAltTab, setActiveAltTab] = useState("9");
  const [verticalTab, setVerticalTab] = useState("1");
  const [rejectAction, setRejectAction] = useState("1");
  const [ticketDetailData, setTicketDetailData] = useState({});
  const [selectedStatus, setSelectedStatus] = useState(localStorage.getItem("SelectedStatusGetIT") || "All Ticket");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [rows, setRows] = useState([]);
  const [statusBtn, setStatusBtn] = useState(false);
  const {
    ticketType: { fetchList },
  } = useSelector((state) => state);
  const location = useLocation();
  const toggle = (tab) => {
    if (activeTab !== tab) setActiveTab(tab);
    if (typeOfTable !== tab) setTypeOfTable(tab);
  };
  const toggleIconTab = (icontab) => {
    if (activeIconTab !== icontab) setActiveIconTab(icontab);
  };
  const toggleAltTab = (alttab) => {
    if (activeAltTab !== alttab) setActiveAltTab(alttab);
  };
  const [totalTicketType, setTotalTicketType] = useState();
  useEffect(() => {
    if (fetchList?.response) {
      setDynamicData(fetchList?.response.data);
      setTotalTicketType(fetchList?.response.dataTableMetaDTO.total);
      dispatch(getAllTicketType(token));
    }
  }, [fetchList]);

  const {
    permission: { permissionList },
  } = useSelector((state) => state);

  useEffect(() => {
    if (fetchAllTicketList?.response) {
      setDynamicData(fetchAllTicketList?.response.data);

      setTotalTickets(fetchAllTicketList?.response.dataTableMetaDTO.total);
    }
  }, [fetchAllTicketList]);

  useEffect(() => {
    dispatch(getAllTicketType(token));
    // dispatch(myTeamTicketRecord(token));
  }, []);

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
      setTicketDetailData(response.data.response);
    } catch (error) {
      throw error; // This is assuming that error.response.responseData is not a valid property.
    }
  };

  const response = permissionList?.response;
  function getActionsForEmptySubMenu(response) {
    const actions = [];

    for (let i = 0; i < response.length; i++) {
      const menu = response[i];
      if (menu.subMenu) {
        for (let j = 0; j < menu.subMenu.length; j++) {
          const subMenu = menu.subMenu[j];
          if (subMenu.action || subMenu.action.length === 0) {
            if (subMenu.menuURL == menuData.menuURL) actions.push({ menuURL: subMenu.menuURL, action: subMenu.action });
          }
        }
      }
    }

    return actions;
  }

  function checkActionIsNotEmpty(response) {
    for (let i = 0; i < response.length; i++) {
      const menu = response[i];
      if (menu.subMenu) {
        for (let j = 0; j < menu.subMenu.length; j++) {
          const subMenu = menu.subMenu[j];
          if (subMenu.action || subMenu.action.length === 0) {
            return true;
          }
        }
      }
    }
    return false;
  }

  const isActionNotEmpty = checkActionIsNotEmpty(response);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectModal, setRejectModal] = useState(false);

  useEffect(() => {
    if (myTeamTickets?.response) {
      setMyteamData(myTeamTickets?.response.data);
      setTotalTeamTickets(myTeamTickets?.response.dataTableMetaDTO.total);
    }
  }, [myTeamTickets]);

  const closeModal = () => {
    setModal(false);
    setModalOpen(false);
    setShowRejectModal(false);
  };

  // const datapreview = (id) => {

  //   ticketDetails(id);
  //   setSelectedId(id);
  //   setModalOpen(true);
  //   if (isActionNotEmpty) {
  //     const selectedRequest = dynamicData.find((request) => request.ticketId === id);
  //     setSelectedData(selectedRequest);
  //   } else {
  //     const selectedRequestDynamic = dynamicData.find((request) => request.ticketId === id);
  //     const selectedRequestMyTeam = myTeamData.find((request) => request.ticketId === id);
  //     setSelectedData(selectedRequestDynamic || selectedRequestMyTeam);
  //   }
  // };
  const datapreview = (id) => {
    ticketDetails(id);
    setSelectedId(id);
    setModalOpen(true);
    navigate(`/ticket/${id}`);
    if (isActionNotEmpty) {
      const selectedRequest = dynamicData.find((request) => request.ticketId === id);
      setSelectedData(selectedRequest);
    } else {
      const selectedRequestDynamic = dynamicData.find((request) => request.ticketId === id);
      const selectedRequestMyTeam = myTeamData.find((request) => request.ticketId === id);
      setSelectedData(selectedRequestDynamic || selectedRequestMyTeam);
    }
  };
  const rejectView = (id, action) => {
    // ticketDetails(id)
    setSelectedId(id);
    setRejectAction(action);
    setShowRejectModal(true);
  };

  const statusData = {
    Approve: { class: "success", text: "Approve" },
    Pending: { class: "info", text: "Pending" },
    Reject: { class: "warning", text: "Rejected" },
    Cancel: { class: "danger", text: "Cancel" },
  };

  const statusColors = {
    InProgress: "ebebeb",
    Success: "#30f558",
    Pending: "#f5c330",
    Cancel: "#a1a1a1",
    Approve: "#00cb6c",
    Rejected: "#ff0000",
    "L1 Approved": "#4de0b7",
    "L2 Approved": "#8da0ff",
  };
  const dynamicDataKeys = dynamicData.length > 0 ? Object.keys(dynamicData[0]) : [];

  const commonActionFunc = (row, action) => {
    // console.log("rowwww",row.projectId)
    if (action == "Edit") {
      setModal(true);
      setSelectedData(row);
    } else if (action == "Delete") {
      if (menuData.menuURL === "/subtype/list") {
        dispatch(
          deleteTicketTypeById({
            menuUrl: menuData.menuURL,
            subTypeId: row.subTypeId,
            token,
            rowsPerPage,
            currentPage,
            totalTicketType,
          })
        );
      } else {
        dispatch(
          deleteDocumentsById({
            menuUrl: menuData.menuURL,
            documentId: row.documentId,
            token,
            rowsPerPage,
            currentPage,
            totalTicketType,
          })
        );
      }
    } else if (action == "Reject") {
      setShowRejectModal(true);
      setRejectModal(true);
      rejectView(row.ticketId, action);
    } else {
      dispatch(
        statusChange({
          action,
          menuUrl: menuData.menuURL,
          ticketId: row.ticketId,
          token,
          rowsPerPage,
          currentPage,
          totalTicketType,
          status: selectedStatus,
        })
      );
    }
  };
  const [showAction, setShowAction] = useState(true);
  const requestColumns = [
    {
      name: "S.No",
      selector: (row, index) => index + 1 + (currentPage - 1) * rowsPerPage,
      minWidth: "20px",
      maxWidth: "80px",
    },
  ];

  const createdByColumn = {
    name: "Created By",
    selector: (row) => row.createdBy,
    sortable: true,
    minWidth: "140px",
    cell: (row) => <span>{row.createdBy}</span>,
    // hide: "lg",
  };
  const reportindHead = {
    name: "Reporting Head",
    selector: (row) => row.reportingManager,
    sortable: true,
    cell: (row) => <span>{row.reportingManager}</span>,
    // hide: "lg",
    minWidth: "150px",
  };
  const TicketId = {
    name: "TicketId",
    selector: (row) => row.ticketId,
    hide: "lg",
    sortable: true,
    cell: (row) => (
      <span
        onClick={() => {
          datapreview(row.ticketId);
        }}
        style={{ color: "#0083b9", cursor: "pointer" }}
      >
        {row.ticketPreffix}
        {row.ticketId}
      </span>
    ),
    minWidth: "100px",
  };
  const subTypeId = {
    name: "Subtype ID",
    selector: (row) => row.subTypeId,
    // hide: "lg",
    sortable: true,
    cell: (row) => (
      <span
        onClick={() => {
          datapreview(row.subTypeId);
        }}
        style={{ color: "#0083b9", cursor: "pointer" }}
      >
        {row.type}-{row.subTypeId}
      </span>
    ),
    minWidth: "100px",
    maxWidth: "150px",
  };
  const subType = {
    name: "Subtype",
    selector: (row) => row.subType,
    // hide: "lg",
    sortable: true,
    cell: (row) => <span>{row.subType}</span>,
    minWidth: "100px",
  };
  const Title = {
    name: "Title",
    selector: (row) => row.title,
    compact: true,
    cell: (row) => <span>{row.title} </span>,
    sortable: true,
    minWidth: "150px",
  };
  const createdTime = {
    name: "Created At",
    selector: (row) => row.createdOn,
    sortable: true,
    minWidth: "170px",
    cell: (row) => <span>{row.createdOn}</span>,
    // hide: "md",
  };
  const Status = {
    name: "Status",
    selector: (row) => row.status,
    sortable: true,
    // hide: "lg",
    minWidth: "125px",
    cell: (row) => (
      <span
        style={{
          color: statusColors[row.status],
        }}
        className="status-cell"
        data-status={row.status}
      >
        {row.status}
      </span>
    ),
  };
  const feedBackId = {
    name: "feedBackId",
    selector: (row) => row.feedBackId,
    // hide: "lg",
    sortable: true,
    cell: (row) => (
      <span
        // onClick={() => {
        //   datapreview(row.subTypeId);
        // }}
        style={{ color: "#0083b9", cursor: "pointer" }}
      >
        {"FD-"}
        {row.feedBackId}
      </span>
    ),
    minWidth: "100px",
  };
  const FeedBack = {
    name: "Description",
    selector: (row) => row.description,
    compact: true,
    cell: (row) => {
      const [showMore, setShowMore] = useState(false);
      const maxLength = 50;

      const handleShowMore = () => {
        setShowMore(!showMore);
      };

      const truncatedDescription = row.description?.slice(0, maxLength);
      const remainingDescription = row.description?.slice(maxLength);

      return (
        <div>
          <span>
            {showMore ? row.description : truncatedDescription}
            {row.description?.length > maxLength && (
              <span onClick={handleShowMore} style={{ color: "blue", cursor: "pointer" }}>
                {showMore ? " .....Show Less" : " ....... Show More"}
              </span>
            )}
          </span>
        </div>
      );
    },
    sortable: true,
    minWidth: "150px",
  };
  const documentId = {
    name: "documentId",
    selector: (row) => row.documentId,
    // hide: "lg",
    sortable: true,
    cell: (row) => (
      <span
        // onClick={() => {
        //   datapreview(row.subTypeId);
        // }}
        style={{ color: "#0083b9", cursor: "pointer" }}
      >
        {"DC-"}
        {row.documentId}
      </span>
    ),
    minWidth: "100px",
  };
  const iconColumn = {
    name: "Icon",
    selector: (row) => row.iconUrl,
    sortable: true,
    minWidth: "140px",
    cell: (row) => <img src={row.iconUrl} alt={row.iconUrlName} style={{ maxWidth: "45%", maxHeight: "45%" }} />,
    // hide: "lg",
  };
  const imgLinkColumn = {
    name: "Attachment",
    selector: (row) => row.fileUrl,
    sortable: true,
    minWidth: "140px",
    cell: (row) => (
      <span>
        <a href={row.fileUrl} download={row.fileUrlName}>
          {row.fileUrlName}
        </a>
      </span>
    ),
  };

  const action = {
    name: "Action",
    selector: (row) => row.ticketId,
    minWidth: "auto",
    cell: (row) => {
      const filteredActions = menuData.action.filter(
        (action) =>
          action !== "New" &&
          action !== "View" &&
          !(
            row.status === "Closed" &&
            (action === "In-Progress" ||
              action === "Bussiness-Approval" ||
              action === "L1-Reject" ||
              action === "L2-Approve" ||
              action === "L1-Approve" ||
              action === "L2-Reject" ||
              action === "Reject" ||
              action === "Approve" ||
              action === "Close" ||
              action === "Edit" ||
              action === "Cancel")
          ) &&
          !(
            row.status === "Pending" &&
            (action === "Close" ||
              action === "Approve" ||
              action === "L2-Approve" ||
              action === "L2-Reject" ||
              action === "ReOpen")
          ) &&
          !(
            row.status === "L2 Approved" &&
            (action === "Close" ||
              action === "L2-Approve" ||
              action === "L1-Approve" ||
              // action === "Reject" ||
              action === "L1-Reject" ||
              action === "L2-Reject" ||
              action === "Edit" ||
              action === "Cancel" ||
              action === "Approve" ||
              action === "ReOpen")
          ) &&
          !(
            row.status === "L1 Approved" &&
            (action === "Close" ||
              action === "In-Progress" ||
              action === "L1-Approve" ||
              action === "L1-Reject" ||
              action === "Edit" ||
              action === "Reject" ||
              action === "Approve" ||
              action === "Cancel" ||
              action === "ReOpen")
          ) &&
          !(
            row.status === "In Progress" &&
            (action === "In-Progress" ||
              action === "L1-Reject" ||
              action === "L2-Reject" ||
              action === "Bussiness-Approval" ||
              action === "L2-Approve" ||
              action === "L1-Approve" ||
              action === "Reject" ||
              action === "Edit" ||
              action === "Cancel" ||
              action === "Approve" ||
              action === "ReOpen")
          ) &&
          !(row.status === "Reopen" && (action === "Close" || action === "ReOpen")) &&
          !(
            (row.status === "Rejected" ||
              row.status === "In-Progress" ||
              row.status === "Cancel" ||
              row.status === "In-Progress") &&
            (action === "Edit" ||
              action === "Delete" ||
              action === "L1-Reject" ||
              action === "L2-Reject" ||
              action === "Close" ||
              action === "Reject" ||
              action === "Approve" ||
              action === "L2-Approve" ||
              action === "L1-Approve" ||
              action === "In-Progress" ||
              action === "Bussiness-Approval" ||
              action === "Cancel" ||
              action === "ReOpen" ||
              action === "Ceo-Approve" ||
              action === "Ceo-Reject")
          )
      );
      return (
        <>
          {menuData.menuURL != "/subtype/list" &&
            menuData.menuURL != "/document/list" &&
            menuData.menuURL != "/feedback/list" && (
              <Icon name="eye" onClick={() => datapreview(row.ticketId)} className="ms-2 me-1" />
            )}
          {/* ... Other existing actions */}
          {filteredActions.length > 0 && (
            <DataTableRow className="nk-tb-col-tools">
              <ul className="nk-tb-actions gx-1 my-n1">
                <li>
                  <UncontrolledDropdown>
                    <DropdownToggle tag="a" className="btn btn-trigger dropdown-toggle btn-icon me-n1">
                      <Icon name="more-h"></Icon>
                    </DropdownToggle>
                    <DropdownMenu end>
                      <ul className="link-list-opt no-bdr">
                        {filteredActions.map((action, index) => {
                          let icon;
                          // Add a condition to check if the action should be shown based on the status
                          if (action == "Cancel") {
                            icon = "cross";
                          } else if (action == "Delete") {
                            icon = "delete-fill";
                          } else if (action == "Edit") {
                            icon = "edit-alt";
                          } else if (action == "L1-Approve") {
                            icon = "check-round-cut";
                          } else if (action == "L1-Reject") {
                            icon = "report-fill";
                          } else if (action == "L2-Approve") {
                            icon = "done";
                          } else if (action == "L2-Reject") {
                            icon = "report-fill";
                          } else if (action == "Reject") {
                            icon = "report-fill";
                          } else if (action == "ReOpen") {
                            icon = "rewind-fill";
                          } else if (action == "In-Progress") {
                            icon = "send-alt";
                          } else if (action == "Close") {
                            icon = "cross-c";
                          } else if (action == "Ceo-Approve") {
                            icon = "user-check";
                          } else if (action == "Ceo-Reject") {
                            icon = "user-cross";
                          }
                          return (
                            <li
                              key={index}
                              style={{ cursor: "pointer" }}
                              onClick={(ev) => {
                                commonActionFunc(row, action);
                              }}
                            >
                              <DropdownItem tag="a">
                                <Icon name={icon}></Icon>
                                <span>{action}</span>
                              </DropdownItem>
                            </li>
                          );
                        })}
                      </ul>
                    </DropdownMenu>
                  </UncontrolledDropdown>
                </li>
              </ul>
            </DataTableRow>
          )}
        </>
      );
    },
    sortable: false,
  };

  if (dynamicDataKeys.includes("ticketId")) {
    const insertAtIndex = 1;
    requestColumns.splice(insertAtIndex, 0, TicketId);
  } else if (dynamicDataKeys.includes("subTypeId")) {
    const insertAtIndex = 1;
    requestColumns.splice(insertAtIndex, 0, subTypeId);
  } else if (dynamicDataKeys.includes("feedBackId")) {
    const insertAtIndex = 1;
    requestColumns.splice(insertAtIndex, 0, feedBackId);
  } else if (dynamicDataKeys.includes("documentId")) {
    const insertAtIndex = 1;
    requestColumns.splice(insertAtIndex, 0, documentId);
  }

  const insertAtIndex = 2; // Index where you want to insert the createdByColumn

  if (dynamicDataKeys.includes("subType")) {
    requestColumns.splice(insertAtIndex, 0, subType);
  } else if (dynamicDataKeys.includes("description")) {
    requestColumns.splice(insertAtIndex, 0, FeedBack);
  }
  if (dynamicDataKeys.includes("title")) {
    requestColumns.splice(insertAtIndex, 0, Title);
  }
  if (dynamicDataKeys.includes("createdOn")) {
    const insertAtIndex = 3; // Index where you want to insert the createdByColumn
    requestColumns.splice(insertAtIndex, 0, createdTime);
  }

  if (dynamicDataKeys.includes("status")) {
    const insertAtIndex = 6; // Index where you want to insert the createdByColumn
    requestColumns.splice(insertAtIndex, 0, Status);
  }

  if (dynamicDataKeys.includes("reportingManager") && menuData.menuURL !== "/ticket/mytickets") {
    const insertAtIndex = 4; // Index where you want to insert the createdByColumn
    requestColumns.splice(insertAtIndex, 0, reportindHead);
  }
  if (dynamicDataKeys.includes("createdBy") && menuData.menuURL !== "/ticket/mytickets") {
    const insertAtIndex = 5; //
    requestColumns.splice(insertAtIndex, 0, createdByColumn);
  }
  if (dynamicDataKeys.includes("iconUrl") && menuData.menuURL !== "/ticket/mytickets") {
    const insertAtIndexImgLink = 8; // Index where you want to insert the imgLink column
    requestColumns.splice(insertAtIndexImgLink, 0, imgLinkColumn);
  }

  if (dynamicDataKeys.includes("fileUrl") && menuData.menuURL !== "/ticket/mytickets") {
    const insertAtIndexIcon = 7; // Index where you want to insert the icon column
    requestColumns.splice(insertAtIndexIcon, 0, iconColumn);
  }
  if (menuData.action && menuData.menuURL !== "/feedback/list") {
    const insertAtIndex = dynamicDataKeys.length; // Index where you want to insert the createdByColumn
    requestColumns.splice(insertAtIndex, 0, action);
  }

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
    setStatusBtn(false);
    if (!isDropdownOpen) {
      setStatusBtn(true);
    }
  };

  const handleStatusChange = (status) => {
    localStorage.setItem("SelectedStatusGetIT", status);
    localStorage.removeItem("currentPageGetIT");
    setSelectedStatus(status);
    setCurrentPage(1);

    if (menuData.menuURL === "/report/list") {
      dispatch(
        fetchAllTicketRecord({
          menuUrl: menuData.menuURL,
          searchValue: searchValue,
          length: parseInt(rowsPerPage),
          start: (currentPage - 1) * rowsPerPage,
          draw: 0,
          token: getCookie("GetItToken"),
          createdByIds: JSON.parse(localStorage.getItem("FilterCreateByGetIT")) || [],
          priority: JSON.parse(localStorage.getItem("FilterPriorityGetIT")) || [],
          status: JSON.parse(localStorage.getItem("FilterStatusGetIT")) || [],
          typeIds: JSON.parse(localStorage.getItem("FilterTicketTypeGetIT")) || [],
          dateRange: JSON.parse(localStorage.getItem("FiltercreateOnGetIT")) || "",
        })
      );
    } else {
      dispatch(
        fetchAllTicketRecord({
          menuUrl: menuData.menuURL,
          searchValue: searchValue,
          length: parseInt(rowsPerPage),
          start: (currentPage - 1) * rowsPerPage,
          draw: 0,
          token: getCookie("GetItToken"),
          status: status,
        })
      );
    }
  };

  const handleSearch = (e) => {
    const searchValue = e ? e.target.value : "";
    // console.log(searchValue,"value---->>@@@")
    localStorage.setItem("searchValueGetIt", searchValue);
    setSearchValue(localStorage.getItem("searchValueGetIt") || "");

    if (menuData.menuURL === "/report/list") {
      dispatch(
        fetchAllTicketRecord({
          menuUrl: menuData.menuURL,
          searchValue: searchValue,
          length: parseInt(rowsPerPage),
          start: (currentPage - 1) * rowsPerPage,
          draw: 0,
          token: getCookie("GetItToken"),
          createdByIds: JSON.parse(localStorage.getItem("FilterCreateByGetIT")) || [],
          priority: JSON.parse(localStorage.getItem("FilterPriorityGetIT")) || [],
          status: JSON.parse(localStorage.getItem("FilterStatusGetIT")) || [],
          typeIds: JSON.parse(localStorage.getItem("FilterTicketTypeGetIT")) || [],
          dateRange: JSON.parse(localStorage.getItem("FiltercreateOnGetIT")) || "",
        })
      );
    } else {
      dispatch(
        fetchAllTicketRecord({
          menuUrl: menuData.menuURL,
          searchValue: searchValue,
          length: parseInt(rowsPerPage),
          start: (currentPage - 1) * rowsPerPage,
          draw: 0,
          token: getCookie("GetItToken"),
          status: selectedStatus,
        })
      );
    }
  };
  // useEffect(() => {
  //   // handleSearch();
  //   // setSearchValue("");
  // }, [rowsPerPage, activeTab]);
  const handleSelectChange = (selectedOption) => {
    setQSearchValue(selectedOption?.value || "");
    if (selectedOption) {
      const filteredData = dynamicData.filter((item) => item.title === selectedOption.value);
    }
  };

  return (
    <React.Fragment>
      <Head title={menuData.title}></Head>
      <Content>
        <BlockHead size="sm">
          <BlockBetween>
            <BlockHeadContent>
              <BlockTitle tag="h3" page>
                {menuData.title}
              </BlockTitle>
            </BlockHeadContent>
            <BlockHeadContent>
              <div className="toggle-wrap nk-block-tools-toggle">
                <Button
                  className={`btn-icon btn-trigger toggle-expand me-n1 ${sm ? "active" : ""}`}
                  onClick={() => updateSm(!sm)}
                >
                  <Icon name="menu-alt-r"></Icon>
                </Button>
                <div className="toggle-expand-content btn-res " style={{ display: "block" }}>
                  <ul className="nk-block-tools g-3">
                    <li className="nk-block-tools-opt">
                      {menuData?.action?.map((action) => {
                        if (action === "New") {
                          return (
                            <Button
                              key={action}
                              color="primary"
                              onClick={() => {
                                setModal(true);
                                setSelectedData(undefined);
                              }}
                            >
                              <Icon name="plus" />
                              <span>Add {menuData.title}</span>
                            </Button>
                          );
                        }
                        return null;
                      })}
                    </li>
                  </ul>
                </div>
              </div>
            </BlockHeadContent>
          </BlockBetween>
        </BlockHead>
        <ViewRequest
          closeModal={closeModal}
          actions={menuData.action}
          modal={modalOpen}
          ticketDetailData={ticketDetailData}
          selectedId={selectedId}
          selectedData={selectedData}
          setSelectedData={setSelectedData}
          rowsPerPage={rowsPerPage}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          activeTab={activeTab}
          typeOfTable={typeOfTable}
          checkAction={isActionNotEmpty}
        />

        {menuData.menuURL === "/subtype/list" && (
          <TicketTypeModal
            title={selectedData ? "Update TicketType" : "Add TicketType"}
            modal={modal}
            menuURL={menuData.menuURL}
            menuData={menuData}
            ticketTypeData={selectedData}
            closeModal={() => setModal(false)}
            rowsPerPage={rowsPerPage}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            dynamicData={dynamicData}
          />
        )}
        {/* {menuData.menuURL === "/feedback/list" && (
          // <Feedback
          //   title={selectedData ? "Update TicketType" : "Add TicketType"}
          //   modal={modal}
          //   menuURL={menuData.menuURL}
          //   menuData={menuData}
          //   ticketTypeData={selectedData}
          //   closeModal={() => setModal(false)}
          //   rowsPerPage={rowsPerPage}
          //   currentPage={currentPage}
          //   setCurrentPage={setCurrentPage}
          //   dynamicData={dynamicData}
          // />
        )} */}
        {menuData.menuURL === "/document/list" && (
          <DocumentModel
            title={selectedData ? "Update TicketType" : "Add TicketType"}
            modal={modal}
            menuURL={menuData.menuURL}
            menuData={menuData}
            ticketTypeData={selectedData}
            closeModal={() => setModal(false)}
            rowsPerPage={rowsPerPage}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            dynamicData={dynamicData}
            selectedData={selectedData}
          />
        )}
        {menuData.menuURL !== "/subtype/list" &&
          menuData.menuURL !== "/feedback/list" &&
          menuData.menuURL !== "/document/list" && (
            // <Suspense fallback={<div>Loading...</div>}>
            <AddModal
              title={selectedData ? "Update Ticket" : "Add Ticket"}
              modal={modal}
              menuURL={menuData.menuURL}
              closeModal={() => setModal(!modal)}
              setSelectedType={setSelectedType}
              selectedType={selectedType}
              selectedData={selectedData}
              rowsPerPage={rowsPerPage}
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
            />
            // </Suspense>
          )}

        {/* <PreviewCard> myticket data table */}
        {
          <ReactDataTable
            data={dynamicData}
            modal={modal}
            columns={requestColumns}
            pagination
            className="nk-tb-list"
            value={searchValue}
            handleSearch={handleSearch}
            menuURL={menuData.menuURL}
            createdByValue={endDate}
            typeOption={qtypeOptions}
            typeValue={qsearchValue}
            typeSearch={handleSelectChange}
            totalRecords={totalTickets}
            setTotalRecords={setTotalTickets}
            rowsPerPage={rowsPerPage}
            setRowsPerPage={setRowsPerPage}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            isDropdownOpen={isDropdownOpen}
            setIsDropdownOpen={setIsDropdownOpen}
            setSelectedStatus={setSelectedStatus}
            selectedStatus={selectedStatus}
            handleStatusChange={handleStatusChange}
            statusBtn={statusBtn}
            setStatusBtn={setStatusBtn}
            toggleDropdown={toggleDropdown}
            searchValue={searchValue}
          // setCurrentPage={setCurrentPage}
          // handleRowsPerPageChange={handleRowsPerPageChange}
          // paginate={paginate}
          />
        }
        {/* {showModal && <RejectModal />} */}
        <RejectModal
          title={selectedData ? "Update Ticket" : "Add Ticket"}
          modal={rejectModal}
          menuData={menuData}
          closeModal={(e) => setRejectModal(false)}
          setSelectedType={setSelectedType}
          selectedType={selectedType}
          selectedData={selectedData}
          rowsPerPage={rowsPerPage}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          selectedId={selectedId}
          rejectAction={rejectAction}
          menuURL={menuData.menuURL}
        />
        <FeedBackSidebar
          data={dynamicData}
          modal={modal}
          columns={requestColumns}
          pagination
          className="nk-tb-list"
          value={searchValue}
          handleSearch={handleSearch}
          menuURL={menuData.menuURL}
          createdByValue={endDate}
          typeOption={qtypeOptions}
          typeValue={qsearchValue}
          typeSearch={handleSelectChange}
          totalRecords={totalTickets}
          setTotalRecords={setTotalTickets}
          rowsPerPage={rowsPerPage}
          setRowsPerPage={setRowsPerPage}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          isDropdownOpen={isDropdownOpen}
          setIsDropdownOpen={setIsDropdownOpen}
          setSelectedStatus={setSelectedStatus}
          selectedStatus={selectedStatus}
          handleStatusChange={handleStatusChange}
          statusBtn={statusBtn}
          setStatusBtn={setStatusBtn}
          toggleDropdown={toggleDropdown}
          searchValue={searchValue}
          ticketTypeData={selectedData}
          closeModal={() => setModal(false)}
          menuData={menuData}
        />
      </Content>
    </React.Fragment>
  );
};
export default TicketLists;
