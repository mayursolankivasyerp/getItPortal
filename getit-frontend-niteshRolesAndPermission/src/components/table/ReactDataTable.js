import React, { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import exportFromJSON from "export-from-json";
import CopyToClipboard from "react-copy-to-clipboard";
import { DataTablePagination, RSelect } from "../Component";
import "../../../src/style.css";
import { Icon } from "../Component";
import { Modal, ModalBody, Button, Col, Input, Row } from "reactstrap";
import { useDispatch, useSelector } from "react-redux";
const Export = ({ data }) => {
  const [modal, setModal] = useState(false);
  useEffect(() => {
    if (modal === true) {
      setTimeout(() => setModal(false), 2000);
    }
  }, [modal]);
  const fileName = "user-data";
  const exportCSV = () => {
    const exportType = exportFromJSON.types.csv;
    exportFromJSON({ data, fileName, exportType });
  };
  const exportExcel = () => {
    const exportType = exportFromJSON.types.xls;
    exportFromJSON({ data, fileName, exportType });
  };
  const copyToClipboard = () => {
    setModal(true);
  };
  return (
    <React.Fragment>
      <div className="dt-export-buttons d-flex align-center">
        <div className="dt-export-title d-none d-md-inline-block">Export</div>
        <div className="dt-buttons btn-group flex-wrap">
          <CopyToClipboard text={JSON.stringify(data)}>
            <Button className="buttons-copy buttons-html5" onClick={() => copyToClipboard()}>
              <span>Copy</span>
            </Button>
          </CopyToClipboard>{" "}
          <button className="btn btn-secondary buttons-csv buttons-html5" type="button" onClick={() => exportCSV()}>
            <span>CSV</span>
          </button>{" "}
          <button className="btn btn-secondary buttons-excel buttons-html5" type="button" onClick={() => exportExcel()}>
            <span>Excel</span>
          </button>{" "}
        </div>
      </div>
      <Modal isOpen={modal} className="modal-dialog-centered text-center" size="sm">
        <ModalBody className="text-center m-2">
          <h5>Copied to clipboard</h5>
        </ModalBody>
        <div className="p-3 bg-light">
          <div className="text-center">Copied {data.length} rows to clipboard</div>
        </div>
      </Modal>
    </React.Fragment>
  );
};

const ExpandableRowComponent = ({ data }) => {
  return (
    <ul className="dtr-details p-2 border-bottom ms-1">
      <li className="d-block d-sm-none">
        <span className="dtr-title">Company</span> <span className="dtr-data">{data.company}</span>
      </li>
      <li className="d-block d-sm-none">
        <span className="dtr-title ">Gender</span> <span className="dtr-data">{data.gender}</span>
      </li>
      <li>
        <span className="dtr-title">Start Date</span> <span className="dtr-data">{data.startDate}</span>
      </li>
      <li>
        <span className="dtr-title">Salary</span> <span className="dtr-data">{data.salary}</span>
      </li>
    </ul>
  );
};
const CustomCheckbox = React.forwardRef(({ onClick, ...rest }, ref) => (
  <div className="custom-control custom-control-sm custom-checkbox notext">
    <input id={rest.name} type="checkbox" className="custom-control-input" ref={ref} onClick={onClick} {...rest} />
    <label className="custom-control-label" htmlFor={rest.name} />
  </div>
));

const ReactDataTable = ({
  data,
  columns,
  pagination,
  actions,
  className,
  selectableRows,
  expandableRows,
  filterButtonShow,
  value,
  handleSearch,
  typeValue,
  typeSearch,
  typeOption,
  priorityValue,
  prioritySearch,
  createdAtValue,
  createdAtSearch,
  createdByValue,
  createdBySearch,
  totalRecords,
  setTotalRecords,
  fetchAllList,
  rowsPerPage,
  setRowsPerPage,
  currentPage,
  setCurrentPage,
}) => {
  const dispatch = useDispatch();
  const [tableData, setTableData] = useState(data);
  const [searchText, setSearchText] = useState("");
  const [mobileView, setMobileView] = useState();
  const [showFilterDiv, setShowFilterDiv] = useState(false);
  //  const [token, setToken] = useState(getCookie("token"));
  function getCookie(name) {
    return document.cookie.match("(^|;)\\s*" + name + "\\s*=\\s*([^;]+)")?.pop() || null;
  }
  const token = getCookie("token");
  useEffect(() => {
    dispatch(
      fetchAllList({
        searchValue: "",
        length: parseInt(rowsPerPage),
        start: (currentPage - 1) * rowsPerPage,
        draw: 0,
        token: token,
      })
    );
  }, [currentPage, rowsPerPage]);
  useEffect(() => {
    setTableData(data);
  }, [data]);

  const viewChange = () => {
    if (window.innerWidth < 960 && expandableRows) {
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

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
    const start = (pageNumber - 1) * rowsPerPage;
    setTableData(data.slice(start, start + rowsPerPage));
  };
  const handleRowsPerPageChange = (e) => {
    const value = parseInt(e.target.value);
    setRowsPerPage(value);
    //  paginate(0);
    setCurrentPage(1);
    paginate(1);
  };

  return (
    <div className={columns.length > 6 ? "table-responsive custom_res" : ""}>
      <div className={` mb-1 dataTables_wrapper dt-bootstrap4 no-footer ${className ? className : ""}`}>
        <Row className={`justify-between g-2 ${actions ? "with-export" : ""} ${filterButtonShow ? "with-filter" : ""}`}>
          <Col className="col-4 text-start" sm="2">
            <div id="DataTables_Table_0_filter" className="dataTables_filter">
              <input
                type="search"
                className="form-control form-control-sm"
                placeholder="Search by name"
                value={value}
                onChange={handleSearch}
                // onChange={(e) => handleSearch(e)}
              />
            </div>
          </Col>

          <Col className="col-3 text-start" sm="2">
            <div id="DataTables_Table_0_filter" className="dataTables_filter d-flex justify-content-between">
              {filterButtonShow && (
                <Button onClick={handleFilterBtn} className="toggle d-none d-md-inline-flex" color="primary">
                  <Icon name="filter-alt"></Icon>
                  <span>Filter</span>
                </Button>
              )}
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
                      {/* <option value={2}>2</option> */}
                      <option value={5}>5</option>
                      <option value={10}>10</option>
                      <option value={15}>15</option>
                    </select>{" "}
                  </div>
                </label>
              </div>
            </div>
          </Col>

          <Col className="col-5 text-end" sm="8">
            <div className="datatable-filter">
              <div className="d-flex justify-content-end g-2">{actions && <Export data={data} />}</div>
            </div>
          </Col>
        </Row>

        {showFilterDiv && (
          <Row className="gy-4 mt-0">
            <Col sm="6" lg="3">
              <div className="form-group">
                <label className="tableFilterSearching">Type</label>
                {/* <RSelect
                    options={typeOption}
                      value={typeOption.find((option) => option.value === typeValue)}
                    onChange={typeSearch}
                  /> */}
              </div>
            </Col>
            <Col sm="6" lg="3">
              <div className="form-group">
                <label className="font-weight-bold">Priority</label>
                {/* <input
                  type="search"
                  className="form-control form-control-sm"
                  id="searchByName2"
                  placeholder="Search by name"
                  value={priorityValue}
                  onChange={prioritySearch}
                /> */}

                {/* <RSelect
                  options={}
                 
                  value={priorityValue}
                  onChange={prioritySearch}
                /> */}
              </div>
            </Col>
            <Col sm="6" lg="3">
              <div className="form-group">
                <label className="font-weight-bold">Created At </label>
                {/* <input
                  type="data"
                  className="form-control form-control-sm"
                  id="searchByName2"
                  placeholder="Search by name"
                 // value={createdAtValue}
                  //onChange={createdAtSearch}
                /> */}
                {/* value={createdAtValue} onChange={createdAtSearch} */}

                <Input type="date" name="date" />
              </div>
            </Col>
            <Col sm="6" lg="3">
              <div className="form-group">
                <label className="font-weight-bold">Created By</label>
                <input
                  type="data"
                  className="form-control form-control-sm"
                  id="searchByName2"
                  placeholder="Search by name"
                  // value={createdByValue}
                  // onChange={createdBySearch}
                />
                {/* <Input bsSize="lg" type="date" name="date" value={createdByValue} onChange={createdBySearch} /> */}
              </div>
            </Col>
          </Row>
        )}

        <DataTable
          data={tableData}
          columns={columns}
          className={className}
          selectableRows={selectableRows}
          selectableRowsComponent={CustomCheckbox}
          expandableRowsComponent={ExpandableRowComponent}
          expandableRows={mobileView}
          noDataComponent={<div className="p-2">There are no records found</div>}
          value={value}
          handleSearch={handleSearch}
          typeValue={typeValue}
          typeSearch={typeSearch}
          typeOption={typeOption}
          priorityValue={priorityValue}
          prioritySearch={prioritySearch}
          createdAtValue={createdAtValue}
          createdAtSearch={createdAtSearch}
          createdByValue={createdByValue}
          createdBySearch={createdBySearch}
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
