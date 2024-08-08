import React, { useEffect, useState } from "react";
import { DataTablePagination, RSelect } from "../Component";
import exportFromJSON from "export-from-json";
import CopyToClipboard from "react-copy-to-clipboard";
import "../../../src/style.css";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { Icon } from "../Component";
import {
  Modal,
  ModalBody,
  Button,
  Col,
  Input,
  Row,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Label,
} from "reactstrap";
import { useDispatch } from "react-redux";
import DataTable from "react-data-table-component";
import { fetchAllTicketRecord, myTeamTicketRecord } from "../../reducers/ticketRequest.reducer";
import { filterRole } from "../../pages/pre-built/user-manage/UserData";
import { filterStatusdata } from "../../pages/pre-built/kyc-list-regular/KycData";
// import { fetchAllTicket } from "../globalApiRequest";
import DatePicker from "react-datepicker";
import { APIKEY, AccessControlOrigin, AgentName, ApiUrl } from "../../utils/Constant";
import axios from "axios";
import Logo from "../../images/vasy_logo_jpg.jpg";
// import exportFromJSON from 'export-from-json';

// import FilteredBy from "./FilteredBy"; // Import your missing component here

// import React, { useState, useEffect } from 'react';
// import { Button, Modal, ModalBody } from 'reactstrap';
// import { CopyToClipboard } from 'react-copy-to-clipboard';
// import exportFromJSON from 'export-from-json';

const Export = ({ data }) => {
  const [modal, setModal] = useState(false);
  // console.log(data, "data");
  useEffect(() => {
    if (modal === true) {
      setTimeout(() => setModal(false), 2000);
    }
  }, [modal]);

  const fileName = "VasyGetIT_Tickets";

  const columns = [
    { header: "Ticket ID", dataKey: "ticketId" },
    { header: "Title", dataKey: "title" },
    // { header: "description", dataKey: "description" },
    { header: "Created By", dataKey: "createdBy" },
    { header: "Created On", dataKey: "createdOn" },
    { header: "Priority", dataKey: "priority" },
    // { header: "Priority", dataKey: "priority" },
    { header: "Status", dataKey: "status" },
    { header: "Type", dataKey: "type" },
  ];

  const convertDataForExport = (originalData, columns) => {
    return originalData.map((item) => {
      const rowData = {};
      columns.forEach((column) => {
        rowData[column.dataKey] = item[column.dataKey];
      });
      return rowData;
    });
  };

  const exportCSV = () => {
    // Assuming data is an array of objects
    const modifiedData = data.map(item => {
      // Create a copy of the item without the unwanted properties
      const modifiedItem = { ...item };
      delete modifiedItem.ticketPreffix;
      delete modifiedItem.mangedById;
      delete modifiedItem.submittedOn;
      delete modifiedItem.files;
      delete modifiedItem.submittedBy;
      return modifiedItem;
    });

    const exportType = exportFromJSON.types.csv;
    exportFromJSON({ data: modifiedData, fileName, exportType });
  };

  // const exportCSV = () => {
  //   // console.log("data---->@@",data)
  //   const exportType = exportFromJSON.types.csv;
  //   const exportData = convertDataForExport(data);
  //   exportFromJSON({ data: exportData, fileName, exportType });
  // };

  // const exportPDF = () => {
  //   const doc = new jsPDF();

  //   // Define the columns and rows for the table

  //   const rows = data.map((item) => ({
  //     ticketId: item.ticketId,
  //     title: item.title,
  //     description: item.description,
  //     createdBy: item.createdBy,
  //     createdOn: item.createdOn,
  //     priority: item.priority,
  //     status: item.status,
  //     type: item.type,
  //   }));
  //   // Add the table to the document
  //   doc.autoTable({ columns, body: rows });

  //   // Save the PDF
  //   doc.save(`${fileName}.pdf`);
  // };
  const exportPDF = () => {
    const doc = new jsPDF();

    // Add logo to the header
    const logo = Logo; // Replace with the path to your logo image
    doc.addImage(logo, "JPEG", 15, 15, 0, 0);

    const rows = data.map((item) => ({
      ticketId: item.ticketId,
      title: item.title,
      description: item.description,
      createdBy: item.createdBy,
      createdOn: item.createdOn,
      priority: item.priority,
      status: item.status,
      type: item.type,
    }));

    const pageWidth = doc.internal.pageSize.getWidth();

    // Add the table to the document with a custom header
    doc.autoTable({
      columns,
      body: rows,
      startY: 30, // Adjust the starting position to leave space for the logo and header
      beforePageContent: () => {
        const name = "VasyERP";
        const textWidth = (doc.getStringUnitWidth(name) * doc.internal.getFontSize()) / doc.internal.scaleFactor;
        const xPos = pageWidth;
        doc.text(name, xPos, 50);
      },
    });

    // Save the PDF
    doc.save(`${fileName}.pdf`);
  };

  const copyToClipboard = () => {
    setModal(true);
  };

  return (
    <React.Fragment>
      <div className="dt-export-buttons d-flex align-center">
        <div className="dt-export-title d-md-inline-block">Export</div>
        <div className="dt-buttons btn-group">
          {/* <CopyToClipboard text={JSON.stringify(data)}>
            <Button className="buttons-copy buttons-html5" onClick={() => copyToClipboard()}>
              <span>Copy</span>
            </Button>
          </CopyToClipboard>{' '} */}
          <button
            className="btn btn-secondary buttons-excel buttons-html5"
            type="button"
            onClick={exportCSV}
            title="Export to Excle"
          >
            {/* <span>CSV</span> */}
          </button>
          <button
            className="btn btn-secondary buttons-pdf buttons-html5"
            type="button"
            onClick={exportPDF}
            title="Export to PDF"
          >
            {/* <span>Excel</span> */}
          </button>
        </div>
      </div>
      <Modal isOpen={modal} className="modal-dialog-centered text-center" size="sm">
        {/* <ModalBody className="text-center m-2">
          <h5>Copied to clipboard</h5>
        </ModalBody> */}
        <div className="p-3 bg-light">
          <div className="text-center">Copied {data?.length} rows to clipboard</div>
        </div>
      </Modal>
    </React.Fragment>
  );
};
// console.log("data",data)
const ExpandableRowComponent = ({ data }) => {
  // console.log("data",data)

  return (
    <ul className="dtr-details p-2 border-bottom ms-1">
      {data.map((item, index) => (
        <React.Fragment key={index}>
          <li className="d-block d-sm-none">
            <span className="dtr-title">Ticket ID</span> <span className="dtr-data">{item.ticketId}</span>
          </li>
          <li className="d-block d-sm-none">
            <span className="dtr-title">Created By</span> <span className="dtr-data">{item.createdBy}</span>
          </li>
          <li className="d-block d-sm-none">
            <span className="dtr-title">Created On</span> <span className="dtr-data">{item.createdOn}</span>
          </li>
          <li className="d-block d-sm-none">
            <span className="dtr-title">Priority</span> <span className="dtr-data">{item.priority}</span>
          </li>
          <li>
            <span className="dtr-title">Status</span> <span className="dtr-data">{item.status}</span>
          </li>
          <li>
            <span className="dtr-title">Type</span> <span className="dtr-data">{item.type}</span>
          </li>
        </React.Fragment>
      ))}
    </ul>
  );
};

export { Export, ExpandableRowComponent };

const CustomCheckbox = React.forwardRef(({ onClick, ...rest }, ref) => (
  <div className="custom-control custom-control-sm custom-checkbox notext">
    <input id={rest.name} type="checkbox" className="custom-control-input" ref={ref} onClick={onClick} {...rest} />
    <label className="custom-control-label" htmlFor={rest.name} />
  </div>
));
import moment from "moment";
const ReactDataTable = ({
  data,
  modal,
  columns,
  pagination,
  className,
  value,
  handleSearch,
  menuURL,
  typeValue,
  typeSearch,
  totalRecords,
  rowsPerPage,
  setRowsPerPage,
  currentPage,
  isDropdownOpen,
  setIsDropdownOpen,
  setSelectedStatus,
  selectedStatus,
  handleStatusChange,
  statusBtn,
  setStatusBtn,
  toggleDropdown,
  setCurrentPage,
  newSearchValue,
  // paginate,
  // handleRowsPerPageChange
}) => {
  const dispatch = useDispatch();
  const [mobileView, setMobileView] = useState();
  const [showFilterDiv, setShowFilterDiv] = useState(false);
  const [filterData, setFilterData] = useState([]);
  const [filterStatus, setFilterStatus] = useState(JSON.parse(localStorage.getItem("FilterStatusInputGetIT")));
  const [filterCreatedBy, setFilterCreateBy] = useState(JSON.parse(localStorage.getItem("FilterCreateByInputGetIT")));
  const [filterTypeList, setFilterTypeList] = useState(JSON.parse(localStorage.getItem("FilterTicketTypeInputGetIT")));
  const [filterPriority, setFilterPrioritys] = useState(JSON.parse(localStorage.getItem("FilterPriorityInputGetIT")));
  const [filterCreatedOn, setFilterCreateOn] = useState(JSON.parse(localStorage.getItem("FiltercreateOnGetIT")));
  const [rangeDate, setRangeDate] = useState({});
  const [resetFilters, setResetFilters] = useState(false);
  function getCookie(name) {
    return document.cookie.match("(^|;)\\s*" + name + "\\s*=\\s*([^;]+)")?.pop() || null;
  }

  const token = getCookie("GetItToken");
  selectedStatus, "selectedStatus";
  // useEffect(() => {
  // dispatch(
  //   fetchAllTicketRecord({
  //     menuUrl: menuURL,
  //     searchValue: "",
  //     length: parseInt(rowsPerPage),
  //     start: (currentPage - 1) * rowsPerPage,
  //     draw: 0,
  //     token: getCookie("GetItToken"),
  //     status: localStorage.getItem("SelectedStatus") || null,
  //   })
  // );
  // }, [menuURL,modal,currentPage, rowsPerPage, fetchAllTicketRecord]);

  useEffect(() => {
    if (menuURL === "/report/list")
      dispatch(
        fetchAllTicketRecord({
          menuUrl: menuURL,
          searchValue: newSearchValue,
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
    else {
      dispatch(
        fetchAllTicketRecord({
          menuUrl: menuURL,
          searchValue: newSearchValue,
          length: parseInt(rowsPerPage),
          start: (currentPage - 1) * rowsPerPage,
          draw: 0,
          token: getCookie("GetItToken"),
          status: localStorage.getItem("SelectedStatusGetIT") || "All Ticket",
        })
      );
    }
  }, [
    menuURL,
    modal,
    currentPage,
    rowsPerPage,
    fetchAllTicketRecord,
    filterStatus,
    filterTypeList,
    filterCreatedOn,
    filterCreatedBy,
    filterPriority,
  ]);

  const viewChange = () => {
    if (window.innerWidth < 960) {
      setMobileView(true);
    } else {
      setMobileView(false);
    }
  };

  useEffect(() => {
    window.addEventListener("load", viewChange);
    window.addEventListener("resize", viewChange);
    return () => {
      window.removeEventListener("resize", viewChange);
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleFilterBtn = () => {
    setShowFilterDiv(!showFilterDiv);
  };

  // useEffect(() => {
  //   // localStorage.setItem('currentPage', currentPage.toString());
  // }, [currentPage]);

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
    localStorage.setItem("currentPageGetIT", pageNumber.toString());
  };

  const getAdminFilterData = async () => {
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

      const apiUrlPath = `${ApiUrl}/report/filter`;
      const response = await axios.get(apiUrlPath, {
        headers: commonHeaders,
      });
      setFilterData(response.data.response);
    } catch (error) {
      // console.log("User Logout...",error.response.status);

      throw error; // This is assuming that error.response.responseData is not a valid property.
    }
  };

  useEffect(() => {
    getAdminFilterData();
  }, []);

  const handleFilterStatus = (filterStatus) => {
    setFilterStatus(filterStatus);
    // localStorage.removeItem("currentPage");
    setCurrentPage(1);
    const valuesOnlyArray = filterStatus.map((statusObject) => statusObject.value);
    const valuesOnlyArrays = filterStatus.map((statusObject) => statusObject);
    localStorage.setItem("FilterStatusInputGetIT", JSON.stringify(valuesOnlyArrays));
    localStorage.setItem("FilterStatusGetIT", JSON.stringify(valuesOnlyArray));
    dispatch(
      fetchAllTicketRecord({
        menuUrl: menuURL,
        searchValue: newSearchValue,
        length: parseInt(rowsPerPage),
        start: (currentPage - 1) * rowsPerPage,
        draw: 0,
        token: token,
        createdByIds: JSON.parse(localStorage.getItem("FilterCreateByGetIT")) || [],
        priority: JSON.parse(localStorage.getItem("FilterPriorityGetIT")) || [],
        status: JSON.parse(localStorage.getItem("FilterStatusGetIT")) || [],
        typeIds: JSON.parse(localStorage.getItem("FilterTicketTypeGetIT")) || [],
        dateRange: JSON.parse(localStorage.getItem("FiltercreateOnGetIT")) || "",
      })
    );
  };

  // console.log(filterTypeList, "filterTypeList--->");
  const handleFilterTicketList = (FilterTicketType) => {
    setFilterTypeList(FilterTicketType);

    setCurrentPage(1);
    const valuesOnlyArray = FilterTicketType.map((statusObject) => statusObject.value);
    localStorage.setItem("FilterTicketTypeGetIT", JSON.stringify(valuesOnlyArray));
    const valuesOnlyArrays = FilterTicketType.map((statusObject) => statusObject);
    localStorage.setItem("FilterTicketTypeInputGetIT", JSON.stringify(valuesOnlyArrays));
    dispatch(
      fetchAllTicketRecord({
        menuUrl: menuURL,
        searchValue: newSearchValue,
        length: parseInt(rowsPerPage),
        start: (currentPage - 1) * rowsPerPage,
        draw: 0,
        token: token,
        createdByIds: JSON.parse(localStorage.getItem("FilterCreateByGetIT")) || [],
        priority: JSON.parse(localStorage.getItem("FilterPriorityGetIT")) || [],
        status: JSON.parse(localStorage.getItem("FilterStatusGetIT")) || [],
        typeIds: JSON.parse(localStorage.getItem("FilterTicketTypeGetIT")) || [],
        dateRange: JSON.parse(localStorage.getItem("FiltercreateOnGetIT")) || "",
      })
    );
  };

  const handleFilterCreateBy = (FilterCreateBy) => {
    setFilterCreateBy(FilterCreateBy);
    // localStorage.removeItem("currentPage");
    setCurrentPage(1);
    const valuesOnlyArray = FilterCreateBy.map((statusObject) => statusObject.value);
    localStorage.setItem("FilterCreateByGetIT", JSON.stringify(valuesOnlyArray));
    const valuesOnlyArrays = FilterCreateBy.map((statusObject) => statusObject);
    localStorage.setItem("FilterCreateByInputGetIT", JSON.stringify(valuesOnlyArrays));
    dispatch(
      fetchAllTicketRecord({
        menuUrl: menuURL,
        searchValue: newSearchValue,
        length: parseInt(rowsPerPage),
        start: (currentPage - 1) * rowsPerPage,
        draw: 0,
        token: token,
        createdByIds: JSON.parse(localStorage.getItem("FilterCreateByGetIT")) || [],
        priority: JSON.parse(localStorage.getItem("FilterPriorityGetIT")) || [],
        status: JSON.parse(localStorage.getItem("FilterStatusGetIT")) || [],
        typeIds: JSON.parse(localStorage.getItem("FilterTicketTypeGetIT")) || [],
        dateRange: JSON.parse(localStorage.getItem("FiltercreateOnGetIT")) || "",
      })
    );
  };

  const handleFilterPriority = (FilterPriority) => {
    setFilterPrioritys(FilterPriority);
    // localStorage.removeItem("currentPage");
    setCurrentPage(1);
    const valuesOnlyArray = FilterPriority.map((statusObject) => statusObject.value);
    localStorage.setItem("FilterPriorityGetIT", JSON.stringify(valuesOnlyArray));
    const valuesOnlyArrays = FilterPriority.map((statusObject) => statusObject);
    localStorage.setItem("FilterPriorityInputGetIT", JSON.stringify(valuesOnlyArrays));
    dispatch(
      fetchAllTicketRecord({
        menuUrl: menuURL,
        searchValue: newSearchValue,
        length: parseInt(rowsPerPage),
        start: (currentPage - 1) * rowsPerPage,
        draw: 0,
        token: token,
        createdByIds: JSON.parse(localStorage.getItem("FilterCreateByGetIT")) || [],
        priority: JSON.parse(localStorage.getItem("FilterPriorityGetIT")) || [],
        status: JSON.parse(localStorage.getItem("FilterStatusGetIT")) || [],
        typeIds: JSON.parse(localStorage.getItem("FilterTicketTypeGetIT")) || [],
        dateRange: JSON.parse(localStorage.getItem("FiltercreateOnGetIT")) || "",
      })
    );
  };
  const handleRowsPerPageChange = (e) => {
    const value = parseInt(e.target.value);

    setRowsPerPage(value);
    paginate(0);
    setCurrentPage(1);
    paginate(1);
    if (menuURL === "/report/list") {
      dispatch(
        fetchAllTicketRecord({
          menuUrl: menuURL,
          searchValue: newSearchValue,
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
          menuUrl: menuURL,
          searchValue: newSearchValue,
          length: parseInt(rowsPerPage),
          start: (currentPage - 1) * rowsPerPage,
          draw: 0,
          token: getCookie("GetItToken"),
          status: selectedStatus,
        })
      );
    }
  };
  const onRangeChange = (dates) => {
    const [start, end] = dates;

    new Date(start), new Date(end);
    setRangeDate({
      start: start,
      end: end,
    });
    const formattedDates = dates?.map((date) =>
      date?.toLocaleDateString("en-US", { year: "numeric", month: "2-digit", day: "2-digit" })
    );
    setFilterCreateOn(formattedDates);
    const formattedDatesString = formattedDates.join(",");
    localStorage.setItem("FiltercreateOnGetIT", JSON.stringify(formattedDatesString));
    // console.log(formattedDatesString,"formattedDatesString")

    dispatch(
      fetchAllTicketRecord({
        menuUrl: menuURL,
        searchValue: newSearchValue,
        length: parseInt(rowsPerPage),
        start: (currentPage - 1) * rowsPerPage,
        draw: 0,
        token: token,
        createdByIds: JSON.parse(localStorage.getItem("FilterCreateByGetIT")) || [],
        priority: JSON.parse(localStorage.getItem("FilterPriorityGetIT")) || [],
        status: JSON.parse(localStorage.getItem("FilterStatusGetIT")) || [],
        typeIds: JSON.parse(localStorage.getItem("FilterTicketTypeGetIT")) || [],
        dateRange: JSON.parse(localStorage.getItem("FiltercreateOnGetIT")) || "",
      })
    );
  };
  // console.log("aaaa",)
  // console.log(menuURL, "menu")
  const handleResetFilter = () => {
    // localStorage.removeItem("SelectedStatus");
    // localStorage.removeItem("currentPage");
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
    setResetFilters(true);
    // setFilterStatus([])
  };
  useEffect(() => {
    // console.log("menuURL----->",menuURL)
    if (menuURL !== "/report/list") {
      // localStorage.removeItem("SelectedStatus");
      // // localStorage.removeItem("currentPage");
      setFilterStatus([]);
      setFilterTypeList([]);
      setFilterCreateOn("");
      setFilterCreateBy([]);
      setFilterPrioritys([]);
      localStorage.removeItem("FilterCreateByGetIT");
      localStorage.removeItem("FilterTicketTypeGetIT");
      localStorage.removeItem("FilterStatusGetIT");
      localStorage.removeItem("FilterPriorityGetIT");
      localStorage.removeItem("FiltercreateOnGetIT");
      localStorage.removeItem("FilterStatusInputGetIT");
      localStorage.removeItem("FilterPriorityInputGetIT");
      localStorage.removeItem("FilterCreateByInputGetIT");
      localStorage.removeItem("FilterTicketTypeInputGetIT");
    }
  }, [menuURL, modal]);

  useEffect(() => {
    if (resetFilters) {
      setFilterStatus([]);
      setFilterTypeList([]);
      setFilterCreateOn("");
      setFilterCreateBy([]);
      setFilterPrioritys([]);
      setResetFilters(false);
    }
  }, [resetFilters]);
  return (
    <div
      style={{ minHeight: statusBtn ? "500px" : "auto" }}
      className={columns.length > 6 ? "table-responsive custom_res" : ""}
      id="mobile-table"
    >
      <div className={` mb-1 dataTables_wrapper dt-bootstrap4 no-footer ${className ? className : ""}`}>
        <Row className={`justify-start g-2 with-export with-filter`}>
          <Col className="col-4 text-start" sm="2">
            <div id="DataTables_Table_0_filter" className="dataTables_filter">
              <input
                type="search"
                className="form-control form-control-sm"
                placeholder="Search by name"
                value={value}
                onChange={handleSearch}
              />
            </div>
          </Col>
          <Col className="col-3 text-start mb-1 w-auto" sm="2">
            <div id="DataTables_Table_0_filter" className="dataTables_filter d-flex justify-content-between">
              <div className="dataTables_length" id="DataTables_Table_0_length">
                <label>
                  <span className="d-none d-sm-inline-block">Show</span>
                  <div className="form-control-select">
                    {" "}
                    <select
                      name="DataTables_Table_0_length"
                      className="custom-select custom-select-sm form-control form-control-sm"
                      onChange={handleRowsPerPageChange}
                      value={rowsPerPage}
                    >
                      {/* <option value={5}>5</option>
                      <option value={10}>10</option> */}
                      <option value={20}>20</option>
                      <option value={35}>35</option>
                      <option value={50}>50</option>
                    </select>
                  </div>
                </label>
              </div>
            </div>
          </Col>
          {/* 
          <UncontrolledDropdown isOpen={isDropdownOpen} toggle={toggleDropdown}>
            <DropdownToggle
              color="transparent"
              className="dropdown-toggle dropdown-indicator btn btn-outline-light btn-white"
              onClick={() => setStatusBtn(true)}
            >
              Status
            </DropdownToggle>

            <DropdownMenu end>
              <ul className="link-list-opt no-bdr">
                {filterStatus.map((status) => {
                    return (
                    <li key={status.value}>
                      <DropdownItem tag="a" href="#dropdownitem" onClick={(ev) => ev.preventDefault()}>
                        <span>{status.value}</span>
                      </DropdownItem>
                    </li>
                  );
                })}
              </ul>
            </DropdownMenu>
          </UncontrolledDropdown> */}
          <Col className="col-1 text-start" sm="2">
            {menuURL == "/report/list" && (
              <UncontrolledDropdown>
                <DropdownToggle className="btn-primary">
                  {/* <div className="dot dot-primary"></div> */}
                  <Icon name="filter"></Icon>
                  <span className="px-0 mx-0 ">Filtered</span>
                </DropdownToggle>
                <DropdownMenu end className="filter-wg dropdown-menu-xl" style={{ overflow: "visible" }}>
                  <div className="dropdown-head">
                    <span className="sub-title dropdown-title">Filter Tickets</span>
                  </div>
                  <div className="dropdown-body dropdown-body-rg">
                    <Col className="gx-6 gy-3 col-12 d-flex flex-wrap">
                      {/* <Col sm={6}>
            <div className="custom-control custom-control-sm custom-checkbox">
              <input type="checkbox" className="custom-control-input" id="hasBalance" />
              <label className="custom-control-label" htmlFor="hasBalance">
                {" "}
                Have Balance
              </label>
            </div>
          </Col>
          <Col sm={6}>
            <div className="custom-control custom-control-sm custom-checkbox">
              <input type="checkbox" className="custom-control-input" id="hasKYC" />
              <label className="custom-control-label" htmlFor="hasKYC">
                {" "}
                KYC Verified
              </label>
            </div>
          </Col> */}
                      <Col sm={6}>
                        <div className="form-group pe-1">
                          <label className="overline-title overline-title-alt">Status</label>
                          <RSelect
                            options={filterData?.statusList}
                            placeholder={"Select Status"}
                            onChange={handleFilterStatus}
                            isMulti={true} // Set isMulti to true for multi-select
                            value={filterStatus}
                          />
                        </div>
                      </Col>

                      <Col sm={6}>
                        <div className="form-group pe-1">
                          <label className="overline-title overline-title-alt">Priority</label>
                          <RSelect
                            options={filterData?.priorityList}
                            placeholder="select Priority"
                            onChange={handleFilterPriority}
                            isMulti={true}
                            value={filterPriority}
                          />
                        </div>
                      </Col>
                      <Col sm={6}>
                        <div className="form-group pe-1">
                          <label className="overline-title overline-title-alt">Created By</label>
                          <RSelect
                            options={filterData?.createdByList}
                            placeholder="select Created By"
                            onChange={handleFilterCreateBy}
                            isMulti={true}
                            value={filterCreatedBy}
                          />
                        </div>
                      </Col>
                      <Col sm={6}>
                        <div className="form-group pe-1">
                          <label className="overline-title overline-title-alt">Type List</label>
                          <RSelect
                            options={filterData?.typeList}
                            placeholder="select typeList"
                            onChange={handleFilterTicketList}
                            isMulti={true}
                            value={filterTypeList}
                          />
                        </div>
                      </Col>
                      <Col sm={6}>
                        <div className="form-group">
                          {/* <Label>Datepicker Range Single Input</Label> */}
                          <label className="overline-title overline-title-alt">Created On</label>
                          <div className="form-control-wrap">
                            <DatePicker
                              selected={rangeDate.start}
                              startDate={rangeDate.start}
                              onChange={onRangeChange}
                              endDate={rangeDate.end}
                              selectsRange
                              className="form-control date-picker"
                              placeholderText="Select Date"
                              value={filterCreatedOn}
                            />
                          </div>
                        </div>
                      </Col>
                      <Col sm={12} style={{ paddingTop: "10px" }}>
                        <div className="form-group d-flex justify-between align-center">
                          <Button onClick={() => handleResetFilter()} className="clickable btn-primary">
                            Reset Filter
                          </Button>
                        </div>
                      </Col>
                    </Col>
                  </div>
                  {/* <div className="dropdown-foot between">
        <a
          href="#reset"
          onClick={(ev) => {
            ev.preventDefault();
          }}
          className="clickable"
        >
          Reset Filter
        </a>
        <a
          href="#save"
          onClick={(ev) => {
            ev.preventDefault();
          }}
        >
          Save Filter
        </a>
      </div> */}
                </DropdownMenu>
              </UncontrolledDropdown>
            )}
            <UncontrolledDropdown isOpen={isDropdownOpen} toggle={toggleDropdown}>
              {menuURL !== "/subtype/list" && menuURL !== "/report/list" && menuURL !== "/feedback/list" && menuURL !== "/document/list" && (
                <DropdownToggle
                  color="transparent"
                  className="dropdown-toggle dropdown-indicator btn btn-outline-light btn-white"
                >
                  {selectedStatus}
                </DropdownToggle>
              )}

              <DropdownMenu end>
                <ul className="link-list-opt no-bdr">
                  <li>
                    <DropdownItem
                      tag="a"
                      href="#dropdownitem"
                      onClick={(ev) => {
                        ev.preventDefault();
                        handleStatusChange();
                      }}
                    ></DropdownItem>
                  </li>
                  {filterStatusdata.map((status) => {
                    return (
                      <li key={status.value}>
                        <DropdownItem
                          tag="a"
                          href="#dropdownitem"
                          onClick={(ev) => {
                            ev.preventDefault();
                            handleStatusChange(status.value);
                          }}
                        >
                          <span>{status.value}</span>
                        </DropdownItem>
                      </li>
                    );
                  })}
                </ul>
              </DropdownMenu>
            </UncontrolledDropdown>
          </Col>
          <Col className="col-1 d-flex justify-content-end pdf" sm="2" style={{ marginLeft: "400px", marginTop: "0px" }}>
            {menuURL === "/report/list" && <Export data={data} />}
          </Col>
        </Row>

        {showFilterDiv && (
          <Row className="gy-4 mt-0">
            <Col sm="6" lg="3">
              <div className="form-group">
                <label className="tableFilterSearching">Type</label>
              </div>
            </Col>
            <Col sm="6" lg="3">
              <div className="form-group">
                <label className="font-weight-bold">Priority</label>
              </div>
            </Col>
            <Col sm="6" lg="3">
              <div className="form-group">
                <label className="font-weight-bold">Created At</label>
                <Input type="date" name="date" />
              </div>
            </Col>
          </Row>
        )}
        <DataTable
          data={data}
          columns={columns}
          className={className}
          menuURL={menuURL}
          selectableRowsComponent={CustomCheckbox}
          expandableRows={mobileView}
          expandableRowsComponent={ExpandableRowComponent}
          noDataComponent={<div className="p-2">There are no records found</div>}
          value={value}
          handleSearch={handleSearch}
          typeValue={typeValue}
          typeSearch={typeSearch}
          sortIcon={
            <div>
              <span>&darr;</span>
              <span>&uarr;</span>
            </div>
          }
          pagination={pagination}
          paginationComponent={({ onChangeRowsPerPage }) => (
            <DataTablePagination
              customItemPerPage={rowsPerPage}
              itemPerPage={rowsPerPage}
              totalItems={totalRecords}
              paginate={paginate}
              currentPage={currentPage}
              onChangeRowsPerPage={onChangeRowsPerPage}
              setRowsPerPage={setRowsPerPage}
              setCurrentPage={setCurrentPage}
            />
          )}
        ></DataTable>
      </div>
    </div>
  );
};

export default ReactDataTable;
