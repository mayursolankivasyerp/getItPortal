import React, { useContext, useEffect, useState } from "react";
import Head from "../../../layout/head/Head";
import Content from "../../../layout/content/Content";
import {
  Block,
  BlockHead,
  BlockBetween,
  BlockHeadContent,
  BlockTitle,
  BlockDes,
  Icon,
  Button,
  PreviewCard,
  ReactDataTable,
} from "../../../components/Component";
import { projectData } from "./ProjectData";
import { findUpper, setDeadline, setDeadlineDays, calcPercentage } from "../../../utils/Utils";
import { confirmationSwalFunction } from "../../../utils/globalSwal";
import TicketTypeModal from "./FormModal";
import {
  fetchTicketTypes,
  getAllTicketType,
  createTicketType,
  ticketTypeSelector,
  deleteTicketTypeById,
} from "../../../reducers/ticketType.reducer";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const TicketTypeList = () => {
  const dispatch = useDispatch();
  const [sm, updateSm] = useState(false);
  const [modal, setModal] = useState(false);
  const [editId, setEditedId] = useState();
  const [data, setData] = useState(projectData);

  const [itemPerPage] = useState(7);
  const {
    ticketType: { fetchList },
  } = useSelector((state) => state);
  const [dynamicData, setDynamicData] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [selectedData, setSelectedData] = useState(null);
  const [totalTicketType, setTotalTicketType] = useState();

  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  // const [token, setToken] = useState(getCookie("GetItToken"));

  const {
    permission: { permissionList },
  } = useSelector((state) => state);
  function getCookie(name) {
    return document.cookie.match("(^|;)\\s*" + name + "\\s*=\\s*([^;]+)")?.pop() || null;
  }
  const token = getCookie("GetItToken");

  const response = permissionList?.response;

  function checkActionsExist(response, navMenuId, title, actions) {
    const menu = response.find((item) => item.navMenuId === navMenuId && item.title === title);

    if (menu) {
      const subMenuItem = menu.subMenu[0];
      if (subMenuItem) {
        const existingActions = subMenuItem.action;
        return actions.every((action) => existingActions.includes(action));
      }
    }

    return false;
  }

  const actionsToCheck = ["Delete", "Edit"];
  const existsInResponse = checkActionsExist(response, "3", "Ticket Type", actionsToCheck);

  useEffect(() => {
    if (fetchList?.response) {
      setDynamicData(fetchList?.response.data);
      setTotalTicketType(fetchList?.response.dataTableMetaDTO.total);
    }
  }, [fetchList]);

  const completeProject = (id) => {
    let newData = data;
    let index = newData.findIndex((item) => item.id === id);
    newData[index].deadline = setDeadline(0);
    setData([...newData]);
  };
  const selectorCheck = (e) => {
    let newData;
    newData = data.map((item) => {
      item.checked = e.currentTarget.checked;
      return item;
    });
    setData([...newData]);
  };

  const selectorDeleteProject = () => {
    let newData;
    newData = data.filter((item) => item.checked !== true);
    setData([...newData]);
  };
  const onSelectChange = (e, id) => {
    let newData = data;
    let index = newData.findIndex((item) => item.id === id);
    newData[index].checked = e.currentTarget.checked;
    setData([...newData]);
  };

  const requestColumns = [
    {
      name: "S.No",
      selector: (row, index) => index + 1 + (currentPage - 1) * rowsPerPage,
    },

    {
      name: "Type",
      selector: (row) => row.type,
      compact: true,
      sortable: true,
      cell: (row) => <span>{row.type === "HW" ? "Hardware" : "Software"} </span>,
    },
    {
      name: "SubType",
      selector: (row) => row.subType,
      compact: true,
      minWidth: "140px",
      sortable: true,
      cell: (row) => <span>{row.subType} </span>,
    },

    {
      name: "Created By",
      selector: (row) => row.createdBy,
      // sortable: true,
      // minWidth: "140px",
      compact: true,
      sortable: true,
      cell: (row) => <span>{row.createdBy}</span>,
      hide: "lg",
    },
    {
      name: "CreatedAt ",
      selector: (row) => row.createdOn,
      compact: true,
      sortable: true,
      cell: (row) => <span>{row.createdOn} </span>,
    },
    {
      name: "Action",
      selector: (row) => row.subTypeId,
      cell: (row) => {
        return (
          <>
            <Icon
              name="edit"
              className="ms-2 me-1"
              onClick={() => {
                setModal(true);
                setSelectedData(row);
              }}
            />

            {existsInResponse === true && (
              <Icon
                name="trash"
                onClick={() => {
                  confirmationSwalFunction("TicketType", "Are you sure you want to delete?", "warning", "Yes").then(
                    (res) => {
                      if (res.isConfirmed) {
                        dispatch(
                          deleteTicketTypeById({
                            id: row.subTypeId,
                            rowsPerPage,
                            currentPage,
                            dynamicData,
                            totalTicketType,
                            setCurrentPage,
                            token: token,
                          })
                        );
                      }
                    }
                  );
                }}
              />
            )}
          </>
        );
      },
    },
  ];
 
  const handleSearch = (e) => {
    const newSearchValue = e ? e.target.value : "";
    // console.log(newSearchValue); // Log the newSearchValue to the console
    localStorage.setItem('searchValue', newSearchValue);  
    dispatch(
      fetchTicketTypes({
        searchValue: newSearchValue,
        length: parseInt(rowsPerPage),
        start:(currentPage - 1) * rowsPerPage,
        draw: 0,
        token: token,
        
      })
    );
  
  };

  useEffect(() => {
    handleSearch();
    // setSearchValue("");
  }, [rowsPerPage]);

  return (
    <React.Fragment>
      <Head title="TicketType List"></Head>

      <Content>
        <BlockHead size="sm">
          <BlockBetween>
            <BlockHeadContent>
              <BlockTitle page>TicketType</BlockTitle>
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
                        color="primary"
                        onClick={() => {
                          setModal(true), setSelectedData(undefined);
                        }}
                      >
                        <Icon name="plus"></Icon>
                        <span>Add TicketType</span>
                      </Button>
                    </li>
                  </ul>
                </div>
              </div>
            </BlockHeadContent>
          </BlockBetween>
        </BlockHead>
        <Block></Block>

        <TicketTypeModal
          title={selectedData ? "Update TicketType" : "Add TicketType"}
          modal={modal}
          ticketTypeData={selectedData}
          closeModal={() => setModal(false)}
          rowsPerPage={rowsPerPage}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          dynamicData={dynamicData}
        />
        <Block size="lg">
          <PreviewCard>
            <ReactDataTable
              data={dynamicData}
              columns={requestColumns}
              value={searchValue}
              handleSearch={handleSearch}
              pagination
              className="nk-tb-list"
              totalRecords={totalTicketType}
              setTotalRecords={setTotalTicketType}
              fetchAllList={fetchTicketTypes}
              rowsPerPage={rowsPerPage}
              setRowsPerPage={setRowsPerPage}
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
            />
          </PreviewCard>
        </Block>
      </Content>
    </React.Fragment>
  );
};
export default TicketTypeList;
