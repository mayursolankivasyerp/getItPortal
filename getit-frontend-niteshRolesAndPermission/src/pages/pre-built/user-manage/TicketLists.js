import React, { useContext, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Block,
  BlockBetween,
  BlockDes,
  BlockHead,
  BlockHeadContent,
  BlockTitle,
  Icon,
  Button,
  PreviewCard,
  ReactDataTable,
  RSelect,
} from "../../../components/Component";
import Content from "../../../layout/content/Content";
import Head from "../../../layout/head/Head";
import { filterStatus, userData } from "./UserData";
import { findUpper } from "../../../utils/Utils";
import { Link } from "react-router-dom";
//import { UserContext } from "./UserContext";
import EditModal from "./EditModal";
import TicketModule from "./AddModal";
import ViewRequest from "./ViewAllRequest";
import classnames from "classnames";
import { getAllTickets, fetchAllTicketRecord, myTeamTicketRecord } from "../../../reducers/ticketRequest.reducer";
import { Nav, NavItem, NavLink, Row, Col, TabContent, TabPane } from "reactstrap";
import { getPermission, permissionSelector } from "../../../reducers/rolePermission.reducer";
const TicketLists = () => {
  // const { contextData } = useContext(UserContext);
  const dispatch = useDispatch();
  // const [data, setData] = contextData;
  // const [token, setToken] = useState(getCookie("token"));
  function getCookie(name) {
    return document.cookie.match("(^|;)\\s*" + name + "\\s*=\\s*([^;]+)")?.pop() || null;
  }
  const token = getCookie("token");
  const [sm, updateSm] = useState(false);
  const [onSearchText] = useState("");
  const [modal, setModal] = useState(false);
  const [editId, setEditedId] = useState();
  const [files, setFiles] = useState([]);
  const [selectedType, setSelectedType] = useState("HW");

  const [itemPerPage] = useState(10);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const {
    ticketRequest: { fetchAllTicketList },
  } = useSelector((state) => state);
  const {
    ticketRequest: { myTeamTickets },
  } = useSelector((state) => state);
  const ticketRequest = useSelector((state) => state);
  const [selectedData, setSelectedData] = useState(null);
  const [dynamicData, setDynamicData] = useState([]);
  const [myTeamData, setMyteamData] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [typeValue, setTypeValue] = useState("");
  const [priorityValue, setPriorityValue] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [qsearchValue, setQSearchValue] = useState("");
  const [qtypeOptions, setQTypeOptions] = useState([]);
  const [qFilteredData, setQFilteredData] = useState([]);
  const [totalTickets, setTotalTickets] = useState();
  const [totalTeamTickets, setTotalTeamTickets] = useState();
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);

  const [activeTab, setActiveTab] = useState("1");
  const [typeOfTable, setTypeOfTable] = useState("1");
  const [activeIconTab, setActiveIconTab] = useState("5");
  const [activeAltTab, setActiveAltTab] = useState("9");
  const [verticalTab, setVerticalTab] = useState("1");
  const [verticalIconTab, setVerticalIconTab] = useState("1");

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

  const {
    permission: { permissionList },
  } = useSelector((state) => state);

  useEffect(() => {
    if (fetchAllTicketList?.response) {
      setDynamicData(fetchAllTicketList?.response.data);

      setTotalTickets(fetchAllTicketList?.response.dataTableMetaDTO.total);
    }
  }, [fetchAllTicketList]);

  const response = permissionList?.response;
  function checkActionIsNotEmpty(response) {
    for (const menu of response) {
      if (menu.subMenu) {
        for (const subMenu of menu.subMenu) {
          if (!subMenu.action || subMenu.action.length === 0) {
            return true;
          }
        }
      }
    }
    return false;
  }

  const isActionNotEmpty = checkActionIsNotEmpty(response);

  useEffect(() => {
    if (myTeamTickets?.response) {
      setMyteamData(myTeamTickets?.response.data);
      setTotalTeamTickets(myTeamTickets?.response.dataTableMetaDTO.total);
    }
  }, [myTeamTickets]);

  const closeModal = () => {
    setModal(false);
    setModalOpen(false);
  };

  const datapreview = (id) => {
    setSelectedId(id);
    setModalOpen(true);

    if (isActionNotEmpty) {
      const selectedRequest = dynamicData.find((request) => request.ticketId === id);
      setSelectedData(selectedRequest);
    } else {
      const selectedRequestDynamic = dynamicData.find((request) => request.ticketId === id);
      const selectedRequestMyTeam = myTeamData.find((request) => request.ticketId === id);
      setSelectedData(selectedRequestDynamic || selectedRequestMyTeam);
    }
  };

  const statusData = {
    Approve: { class: "success", text: "Approve" },
    Pending: { class: "info", text: "Pending" },
    Reject: { class: "warning", text: "Rejected" },
    Cancel: { class: "danger", text: "Cancel" },
  };
  const requestColumns = [
    {
      name: "S.No",
      selector: (row, index) => index + 1 + (currentPage - 1) * rowsPerPage,
    },

    {
      name: "TicketId",
      selector: (row) => row.ticketId,
      hide: "lg",
      sortable: true,
      cell: (row) => <span>{row.ticketId}</span>,
      minWidth: "120px",
    },
    {
      name: "Title",
      selector: (row) => row.title,
      compact: true,

      cell: (row) => <span>{row.title} </span>,
      sortable: true,
    },
    {
      name: "Type",
      selector: (row) => row.type,
      minWidth: "140px",
      cell: (row) => <span>{row.type === "HW" ? "Hardware" : "Software"} </span>,
      sortable: true,
    },

    {
      name: "Priority",
      selector: (row) => row.priority,
      sortable: true,
      cell: (row) => <span>{row.priority}</span>,
    },
    {
      name: "Created At",
      selector: (row) => row.createdOn,
      sortable: true,

      minWidth: "180px",
      cell: (row) => <span>{row.createdOn}</span>,
      hide: "md",
    },

    {
      name: "Created By",
      selector: (row) => row.createdBy,
      sortable: true,
      minWidth: "140px",
      cell: (row) => <span>{row.createdBy}</span>,
      hide: "lg",
    },

    // {
    //   name: "Completed By",
    //   //selector: (row) => row.completedBy,
    //   sortable: true,
    //   cell: (row) => <span>{"nitesh"} </span>,
    //   hide: "lg",
    //   minWidth: "140px",
    // },

    // {
    //   name: "Reporting Head",
    //   selector: (row) => row.reportingManager,
    //   sortable: true,
    //   cell: (row) => <span>{row.reportingManager}</span>,
    //   hide: "lg",
    //   minWidth: "150px",
    // },
    {
      name: "Status",
      selector: (row) => row.status,
      sortable: true,
      hide: "lg",
      minWidth: "140px",
      // cell: ({ status }) => {
      //   console.log("statusstatusstatusstatusstatus", status);

      //   const { class: statusClass, text: statusText } = [status] || {};
      //   return (
      //     <div>
      //       <span className={`tb-status ms-1 text-${statusClass}`}>{statusText}</span>
      //      { console.log("statusTextstatusText")};
      //     </div>
      //   );
      // },
    },

    {
      name: "Action",
      selector: (row) => row.ticketId,

      cell: (row) => {
        return (
          <>
            <Icon name="eye" onClick={() => datapreview(row.ticketId)} className="ms-2 me-1" />
            {row.status === "Pending" && typeOfTable == "1" && (
              <Icon
                name="edit"
                className="ms-2"
                onClick={() => {
                  setModal(true);
                  setSelectedData(row);
                }}
              />
            )}
          </>
        );
      },
      sortable: true,
    },
  ];

  const handleAPIFetch = (tab) => {
    if (tab === "1") {
      return myTeamTickets;
    } else if (tab === "2") {
      return fetchAllTicketRecord;
    }
  };

  const handleSearch = (e) => {
    const newSearchValue = e ? e.target.value : "";
    setSearchValue(newSearchValue);

    if (isActionNotEmpty) {
      dispatch(
        fetchAllTicketRecord({
          searchValue: newSearchValue,
          length: parseInt(rowsPerPage),
          start: currentPage - 1,
          draw: 0,
          token: token,
        })
      );
    } else {
      if (activeTab === "1") {
        dispatch(
          fetchAllTicketRecord({
            searchValue: newSearchValue,
            length: parseInt(rowsPerPage),
            start: currentPage - 1,
            draw: 0,
            token: token,
          })
        );
      } else if (activeTab === "2") {
        dispatch(
          myTeamTicketRecord({
            searchValue: newSearchValue,
            length: parseInt(rowsPerPage),
            start: currentPage - 1,
            draw: 0,
            token: token,
          })
        );
      }
    }

    if (newSearchValue === "") {
      setCurrentPage(1);
    }
  };

  useEffect(() => {
    handleSearch();
    setSearchValue("");
  }, [rowsPerPage, activeTab]);

  const handleSelectChange = (selectedOption) => {
    setQSearchValue(selectedOption?.value || "");
    if (selectedOption) {
      const filteredData = dynamicData.filter((item) => item.title === selectedOption.value);
      setQFilteredData(filteredData);
    } else {
      setQFilteredData([]);
    }
  };
  return (
    <React.Fragment>
      <Head title="Ticket Lists"></Head>
      <Content>
        <BlockHead size="sm">
          <BlockBetween>
            <BlockHeadContent>
              <BlockTitle tag="h3" page>
                Ticket Lists
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
                <div className="toggle-expand-content" style={{ display: sm ? "block" : "none" }}>
                  <ul className="nk-block-tools g-3">
                    <li className="nk-block-tools-opt">
                      <Button
                        className="toggle d-none d-md-inline-flex"
                        color="primary"
                        onClick={() => {
                          setModal(true);
                          setSelectedData(undefined);
                        }}
                      >
                        <Icon name="plus"></Icon>
                        <span>Add Ticket</span>
                      </Button>
                    </li>
                  </ul>
                </div>
              </div>
            </BlockHeadContent>
          </BlockBetween>
        </BlockHead>
        <ViewRequest
          closeModal={closeModal}
          modal={modalOpen}
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
        <TicketModule
          title={selectedData ? "Update Ticket" : "Add Ticket"}
          modal={modal}
          closeModal={() => setModal(!modal)}
          setSelectedType={setSelectedType}
          selectedType={selectedType}
          ticketData={selectedData}
          rowsPerPage={rowsPerPage}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
        />

        <PreviewCard>
          {isActionNotEmpty === true && (
            <ReactDataTable
              data={dynamicData}
              columns={requestColumns}
              pagination
              className="nk-tb-list"
              value={searchValue}
              handleSearch={handleSearch}
              priorityValue={priorityValue}
              createdAtValue={startDate}
              createdByValue={endDate}
              typeOption={qtypeOptions}
              typeValue={qsearchValue}
              typeSearch={handleSelectChange}
              totalRecords={totalTickets}
              setTotalRecords={setTotalTickets}
              fetchAllList={fetchAllTicketRecord}
              rowsPerPage={rowsPerPage}
              setRowsPerPage={setRowsPerPage}
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
            />
          )}

          {isActionNotEmpty === false && (
            <Nav tabs className="mt-n3">
              <NavItem>
                <NavLink
                  tag="a"
                  href="#tab"
                  className={classnames({ active: activeTab === "1" })}
                  onClick={(ev) => {
                    ev.preventDefault();
                    toggle("1");
                  }}
                >
                  Me
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink
                  tag="a"
                  href="#tab"
                  className={classnames({ active: activeTab === "2" })}
                  onClick={(ev) => {
                    ev.preventDefault();
                    toggle("2");
                  }}
                >
                  My Team
                </NavLink>
              </NavItem>
            </Nav>
          )}

          {isActionNotEmpty === false && (
            <TabContent activeTab={activeTab}>
              <TabPane tabId="1">
                <Block size="lg">
                  <PreviewCard>
                    <ReactDataTable
                      data={dynamicData}
                      columns={requestColumns}
                      pagination
                      className="nk-tb-list"
                      value={searchValue}
                      handleSearch={handleSearch}
                      priorityValue={priorityValue}
                      createdAtValue={startDate}
                      createdByValue={endDate}
                      typeOption={qtypeOptions}
                      typeValue={qsearchValue}
                      typeSearch={handleSelectChange}
                      totalRecords={totalTeamTickets}
                      setTotalRecords={setTotalTeamTickets}
                      fetchAllList={myTeamTicketRecord}
                      rowsPerPage={rowsPerPage}
                      setRowsPerPage={setRowsPerPage}
                      currentPage={currentPage}
                      setCurrentPage={setCurrentPage}
                    />
                  </PreviewCard>
                </Block>
              </TabPane>
              <TabPane tabId="2">
                <Block size="lg">
                  <PreviewCard>
                    <ReactDataTable
                      data={myTeamData}
                      columns={requestColumns}
                      pagination
                      className="nk-tb-list"
                      value={searchValue}
                      handleSearch={handleSearch}
                      priorityValue={priorityValue}
                      createdAtValue={startDate}
                      createdByValue={endDate}
                      typeOption={qtypeOptions}
                      typeValue={qsearchValue}
                      typeSearch={handleSelectChange}
                      totalRecords={totalTickets}
                      setTotalRecords={setTotalTickets}
                      fetchAllList={fetchAllTicketRecord}
                      rowsPerPage={rowsPerPage}
                      setRowsPerPage={setRowsPerPage}
                      currentPage={currentPage}
                      setCurrentPage={setCurrentPage}
                    />
                  </PreviewCard>
                </Block>
              </TabPane>
            </TabContent>
          )}
        </PreviewCard>
      </Content>
    </React.Fragment>
  );
};
export default TicketLists;
