import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Cookies from "js-cookie";
import { ApiUrl, AgentName, token, APIKEY, AccessControlOrigin } from "../utils/Constant";
import { fetchAllTicketRecord } from "./ticketRequest.reducer";

export const getAllTicketType = createAsyncThunk("subtype/typelist", async (token, { rejectWithValue }) => {
  try {
    const response = await axios.get(
      `${ApiUrl}/subtype/typelist`,

      {
        headers: {
          Accept: "*/*",
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": AccessControlOrigin,
          "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,PATCH,OPTIONS",
          "X-APIKEY": APIKEY,
          AgentName: AgentName,
          Authorization: token,
        },
      }
    );

    return response.data;
  } catch (error) {
    return rejectWithValue(error.response.responseData);
  }
});

export const fetchTicketTypes = createAsyncThunk(
  "subtype/list",
  async ({ searchValue, length, start, draw, token }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${ApiUrl}/subtype/list`,
        {
          searchValue: searchValue,
          length: length,
          start: start,
          draw: draw,
        },
        {
          headers: {
            Accept: "*/*",
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": AccessControlOrigin,
            "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,PATCH,OPTIONS",
            "X-APIKEY": APIKEY,
            AgentName: AgentName,
            Authorization: token,
          },
        }
      );

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.responseData);
    }
  }
);

export const createTicketType = createAsyncThunk(
  "subtype/create",
  async (
    { subTypeId, type, subType, approvalRequired, rowsPerPage, currentPage, setCurrentPage, token, menuUrl },
    { dispatch, rejectWithValue }
  ) => {
    try {
      const apiUrlPath = `${ApiUrl}/subtype/create`;
      const response = await axios.post(
        apiUrlPath,
        {
          subTypeId,
          type,
          subType,
          approvalRequired,
        },
        {
          headers: {
            Accept: "*/*",
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": AccessControlOrigin,
            "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,PATCH,OPTIONS",
            "X-APIKEY": APIKEY,
            AgentName: AgentName,
            Authorization: token,
          },
        }
      );

      dispatch(
        fetchAllTicketRecord({
          menuUrl,
          searchValue: localStorage.getItem("newSearchValueGetIt") || "",
          length: parseInt(rowsPerPage),
          start: subTypeId === 0 ? 0 : (currentPage - 1) * rowsPerPage,
          draw: 0,
          token,
        })
      );

      if (subTypeId === 0) {
        // setCurrentPage(1);
      } else {
        // setCurrentPage(currentPage);
      }
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.responseData);
    }
  }
);

export const deleteTicketTypeById = createAsyncThunk(
  "/subtype/delete",
  async ({ menuUrl, subTypeId, token, rowsPerPage, currentPage, totalTicketType }, { dispatch, rejectWithValue }) => {
    try {
      if (subTypeId) {
        const response = await axios.post(
          `${ApiUrl}/subtype/delete/${subTypeId}`,
          {},
          {
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
              "X-APIKEY": APIKEY,
              AgentName: AgentName,
              Authorization: token,
            },
          }
        );
        const newTotalTicketType = totalTicketType - 1;
        const totalPages = Math.ceil(newTotalTicketType / rowsPerPage);
        let newCurrentPage = currentPage;
        if (newTotalTicketType === 0) {
          newCurrentPage = 1;
        } else if (currentPage > totalPages) {
          newCurrentPage = totalPages;
        }
        dispatch(
          fetchAllTicketRecord({
            menuUrl,
            searchValue: localStorage.getItem("newSearchValueGetIt") || "",
            length: parseInt(rowsPerPage),
            start: (newCurrentPage - 1) * rowsPerPage,
            draw: 0,
            token,
          })
        );
        setCurrentPage(newCurrentPage);
        return response.data;
      }
    } catch (error) {
      rejectWithValue(error.response.responseData);
    }
  }
);
export const deleteDocumentsById = createAsyncThunk(

  "/Documents/delete",
  async ({ menuUrl, documentId, token, rowsPerPage, currentPage, totalTicketType }, { dispatch, rejectWithValue }) => {
    // debugger
    try {
      if (documentId) {
        const response = await axios.post(
          `${ApiUrl}/document/delete/${documentId}`,
          {},
          {
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
              "X-APIKEY": APIKEY,
              AgentName: AgentName,
              Authorization: token,
            },
          }
        );
        // const newTotalTicketType = totalTicketType - 1;
        // const totalPages = Math.ceil(newTotalTicketType / rowsPerPage);
        // let newCurrentPage = currentPage;
        // if (newTotalTicketType === 0) {
        //   newCurrentPage = 1;
        // } else if (currentPage > totalPages) {
        //   newCurrentPage = totalPages;
        // }
        dispatch(
          fetchAllTicketRecord({
            menuUrl,
            searchValue:"",
            length: parseInt(rowsPerPage),
            start: (currentPage - 1) * rowsPerPage,
            draw: 0,
            token,
          })
        );
        // setCurrentPage(newCurrentPage);
        return response.data;
      }
    } catch (error) {
      rejectWithValue(error.response.responseData);
    }
  }
);
export const createFeedBack = createAsyncThunk(
  "Feedback/create",
  async (
    { feedBackId, description, rowsPerPage, currentPage, setCurrentPage, token, menuUrl, status },
    { dispatch, rejectWithValue }
  ) => {
    try {
      const apiUrlPath = `${ApiUrl}/feedback/save`;
      const response = await axios.post(
        apiUrlPath,
        {
          feedBackId,
          description,
        },
        {
          headers: {
            Accept: "*/*",
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": AccessControlOrigin,
            "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,PATCH,OPTIONS",
            "X-APIKEY": APIKEY,
            AgentName: AgentName,
            Authorization: token,
          },
        }
      );

      dispatch(
        fetchAllTicketRecord({
          menuUrl,
          searchValue: "",
          length: parseInt(rowsPerPage),
          start: (currentPage - 1) * rowsPerPage,
          draw: 0,
          token,
          status,
        })
      );

      // if (subTypeId === 0) {
      //   // setCurrentPage(1);
      // } else {
      //   // setCurrentPage(currentPage);
      // }
      return response.data;
    } catch (error) {
      // console.log(error,"error")
      // debugger
      return rejectWithValue(error.response.responseData);
    }
  }
);
export const getAllFeedBackList = createAsyncThunk(
  "FeedBackList",
  async ({ searchValue, length, start, draw, token }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${ApiUrl}/feedback/list`,
        {
          searchValue: searchValue,
          length: length,
          start: start,
          draw: draw,
        },
        {
          headers: {
            Accept: "*/*",
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": AccessControlOrigin,
            "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,PATCH,OPTIONS",
            "X-APIKEY": APIKEY,
            AgentName: AgentName,
            Authorization: token,
          },
        }
      );

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.responseData);
    }
  }
);
 
//   "documents/create",
//   async (
    
//     { documentId, title, icon,  file, type, rowsPerPage, currentPage, setCurrentPage, token, menuUrl, status },

//     { dispatch, rejectWithValue }
//   ) => {
//     // debugger
//     try {
    
//       const apiUrlPath = `${ApiUrl}/document/save`;
//       const response = await axios.post(
//         apiUrlPath,
//         {
//           documentId,
//           title,
//           icon,
//           file,
//           type,
//         },
//         {
//           headers: {
//             Accept: "*/*",
//             "Content-Type": "application/json",
//             "Access-Control-Allow-Origin": AccessControlOrigin,
//             "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,PATCH,OPTIONS",
//             "X-APIKEY": APIKEY,
//             AgentName: AgentName,
//             Authorization: token,
//           },
//         }
//       );

//       dispatch(
//         fetchAllTicketRecord({
//           menuUrl,
//           searchValue: "",
//           length: parseInt(rowsPerPage),
//           start: (currentPage - 1) * rowsPerPage,
//           draw: 0,
//           token,
//           status,
//         })
//       );

//       // if (subTypeId === 0) {
//       //   // setCurrentPage(1);
//       // } else {
//       //   // setCurrentPage(currentPage);
//       // }
//       return response.data;
//     } catch (error) {
//       // console.log(error,"error")
//       // debugger
//       return rejectWithValue(error.response.responseData);
//     }
//   }
// );
export const createDocuments = createAsyncThunk(
  "documents/create",
  async (
    {
      documentId,
      title,
      type,
      files,
      icon,
      menuUrl,
      rowsPerPage,
      currentPage,
      token,
    },

    { dispatch, rejectWithValue }
  ) => {
    try {
      const commonHeaders = {
        Accept: "application/json",
        "Content-Type": "multipart/form-data",
        "X-APIKEY": APIKEY,
        AgentName: AgentName,
        Authorization: token,
      };
      const payloadData = {
        documentId,
        title,
        type,
        icon,
        files: files,
      };

      const response = await axios.post(`${ApiUrl}/document/save`, payloadData, {
        headers: commonHeaders,
      });
      dispatch(
        fetchAllTicketRecord({
          menuUrl,
          searchValue: "",
          length: parseInt(rowsPerPage),
          start: (currentPage - 1) * rowsPerPage,
          draw: 0,
          token,
          
        })
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.responseData);
    }
  }
);
// export const deleteDocumentsById = createAsyncThunk(
//   "/documents/delete",
//   async ({ menuUrl, documentId, token, rowsPerPage, currentPage, totalTicketType }, { dispatch, rejectWithValue }) => {
//     debugger
//     try {
//       if (documentId) {
//         const response = await axios.delete(
//           `${ApiUrl}/document/delete/${documentId}`,
//           {},
//           {
//             headers: {
//               Accept: "application/json",
//               "Content-Type": "application/json",
//               "X-APIKEY": APIKEY,
//               AgentName: AgentName,
//               Authorization: token,
//             },
//           }
//         );
//         const newTotalTicketType = totalTicketType - 1;
//         const totalPages = Math.ceil(newTotalTicketType / rowsPerPage);
//         let newCurrentPage = currentPage;
//         if (newTotalTicketType === 0) {
//           newCurrentPage = 1;
//         } else if (currentPage > totalPages) {
//           newCurrentPage = totalPages;
//         }
//         dispatch(
//           fetchAllTicketRecord({
//             menuUrl,
//             searchValue: localStorage.getItem("newSearchValueGetIt") || "",
//             length: parseInt(rowsPerPage),
//             start: (newCurrentPage - 1) * rowsPerPage,
//             draw: 0,
//             token,
//           })
//         );
//         setCurrentPage(newCurrentPage);
//         return response.data;
//       }
//     } catch (error) {
//       rejectWithValue(error.response.responseData);
//     }
//   }
// );

export const getAllCreateDocumentsList = createAsyncThunk(
  "DocumentsList",
  async ({ searchValue, length, start, draw, token }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${ApiUrl}/document/list`,
        {
          searchValue: searchValue,
          length: length,
          start: start,
          draw: draw,
        },
        {
          headers: {
            Accept: "*/*",
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": AccessControlOrigin,
            "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,PATCH,OPTIONS",
            "X-APIKEY": APIKEY,
            AgentName: AgentName,
            Authorization: token,
          },
        }
      );

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.responseData);
    }
  }
);

const initialState = {
  ticketTypeList: [],
  ticketTypeData: [],
  fetchList: [],
  FeedBackList: [],
  DocumentsList: [],
  loading: false,
  error: undefined,
};

const ticketTypeSlice = createSlice({
  name: "ticketType",
  initialState,
  reducers: {
    ticketTypeData: (state, action) => {
      return { ...state, ticketTypeData: action.payload };
    },
  },
  extraReducers: (builder) => {
    builder

      .addCase(getAllTicketType.fulfilled, (state, action) => {
        if (action.payload) {
          return { ...state, loading: false, ticketTypeList: action.payload };
        } else {
          return { ...state, loading: false, ticketTypeList: initialState.ticketTypeList };
        }
      })
      .addCase(getAllTicketType.pending, (state) => {
        return { ...state, loading: true };
      })

      .addCase(fetchTicketTypes.fulfilled, (state, action) => {
        if (action.payload) {
          return { ...state, loading: false, fetchList: action.payload };
        } else {
          return { ...state, loading: false, fetchList: initialState.fetchList };
        }
      })
      .addCase(createFeedBack.fulfilled, (state, action) => {
        // debugger
        if (action.payload.status) {
          if (action.payload.message === "Success") {
            toast.success("FeedBack Created successfully.");
          } else {
            toast.warning("FeedBack already exists.");
          }
          return { ...state, loading: false, FeedBackList: action.payload };
        } else {
          toast.error("Something went wrong");
          return { ...state, loading: false, FeedBackList: initialState.FeedBackList };
        }
      })
      .addCase(createFeedBack.pending, (state) => {
        return { ...state, loading: true };
      })
      .addCase(getAllFeedBackList.fulfilled, (state, action) => {
        if (action.payload) {
          return { ...state, loading: false, FeedBackList: action.payload };
        } else {
          return { ...state, loading: false, FeedBackList: initialState.FeedBackList };
        }
      })
      .addCase(getAllFeedBackList.pending, (state) => {
        return { ...state, loading: true };
      })
      .addCase(createDocuments.fulfilled, (state, action) => {
        // debugger
        if (action.payload.status) {
          if (action.payload.message === "Success") {
            toast.success("Documents Created successfully.");
          } else {
            toast.warning("Documents already exists.");
          }
          return { ...state, loading: false, FeedBackList: action.payload };
        } else {
          toast.error("Something went wrong");
          return { ...state, loading: false, FeedBackList: initialState.FeedBackList };
        }
      })
      .addCase(createDocuments.pending, (state) => {
        return { ...state, loading: true };
      })
      .addCase(getAllCreateDocumentsList.fulfilled, (state, action) => {
        if (action.payload) {
          return { ...state, loading: false, FeedBackList: action.payload };
        } else {
          return { ...state, loading: false, FeedBackList: initialState.FeedBackList };
        }
      })
      .addCase(getAllCreateDocumentsList.pending, (state) => {
        return { ...state, loading: true };
      })
      .addCase(fetchTicketTypes.pending, (state) => {
        return { ...state, loading: true };
      })

      .addCase(createTicketType.fulfilled, (state, action) => {
        if (action.payload.status) {
          if (action.payload.message.toLowerCase() === "success") {
            toast.success("TicketType updated successfully.");
          } else {
            toast.warning("TicketType already exists.");
          }

          return { ...state, loading: false, ticketTypeData: action.payload };
        } else {
          toast.error("Something went wrong");
          return { ...state, loading: false, ticketTypeData: initialState.ticketTypeData };
        }
      })
      .addCase(createTicketType.pending, (state) => {
        return { ...state, loading: true };
      })

      .addCase(deleteTicketTypeById.fulfilled, (state, action) => {
        if (action.payload.status) {
          toast.success("TicketType deleted sucessfully");
          return { ...state, loading: false };
        } else {
          toast.error("Something went wrong");
          return { ...state, loading: false, specificTicketTypeId: initialState.fetchList };
        }
      })

      .addCase(deleteTicketTypeById.pending, (state) => {
        return { ...state, loading: true };
      });
  },
});
export const ticketTypeReducer = ticketTypeSlice.reducer;
export const ticketTypeSelector = (state) => state.ticketType;
export const { ticketTypeData } = ticketTypeSlice.actions;
