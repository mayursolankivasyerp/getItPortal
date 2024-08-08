import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Cookies from "js-cookie";
import { confirmationSwalFunction, swalSuccessToasterFunction, swalErrorToasterFunction } from "../utils/globalSwal";
import { ApiUrl, AgentName, token, APIKEY, AccessControlOrigin } from "../utils/Constant";

export const getAllTickets = createAsyncThunk("subtype/typelist", async (token, { rejectWithValue }) => {
  try {
    const response = await axios.get(
      `${ApiUrl}/subtype/typelist`,

      {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",

          "Access-Control-Allow-Origin": AccessControlOrigin,

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

export const fetchAllTicketRecord = createAsyncThunk(
  "ticket/list",
  async ({ searchValue, length, start, draw, token }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${ApiUrl}/ticket/mytickets`,
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
export const myTeamTicketRecord = createAsyncThunk(
  "ticket/myteamtickets",
  async ({ searchValue, length, start, draw, token }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${ApiUrl}/ticket/myteamtickets`,
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
export const createTickets = createAsyncThunk(
  "ticket/create",
  async (
    {
      ticketId,
      title,
      description,
      type,
      // subType,
      subTypeId,
      priority,
      reportingManager,
      status,
      files,
      rowsPerPage,
      currentPage,
      setCurrentPage,
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
        ticketId,
        title,
        description,
        type,

        // subType,
        subTypeId,
        priority,
        reportingManager,
        status,
        createdBy: "nitesh",
        files,
      };

      const response = await axios.post(`${ApiUrl}/ticket/create`, payloadData, {
        headers: commonHeaders,
      });

      dispatch(
        fetchAllTicketRecord({
          searchValue: "",
          length: parseInt(rowsPerPage),
          start: ticketId === 0 ? 0 : (currentPage - 1) * rowsPerPage,
          draw: 0,
          token,
        })
      );
      if (ticketId === 0) {
        setCurrentPage(1);
      } else {
        setCurrentPage(currentPage);
      }
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.responseData);
    }
  }
);

export const statusUpdate = createAsyncThunk(
  "status/cancel",
  async ({ ticketId, status, uId, rowsPerPage, currentPage, setCurrentPage, token }, { dispatch, rejectWithValue }) => {
    try {
      const commonHeaders = {
        Accept: "*/*",

        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": AccessControlOrigin,
        "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,PATCH,OPTIONS",

        "X-APIKEY": APIKEY,
        AgentName: AgentName,
        Authorization: token,
      };
      const apiUrlPath = `${ApiUrl}/status/cancel`;
      const response = await axios.post(
        apiUrlPath,
        {
          ticketId,
          status,
          uId,
        },
        {
          headers: commonHeaders,
        }
      );

      dispatch(
        fetchAllTicketRecord({
          searchValue: "",
          length: parseInt(rowsPerPage),
          start: (currentPage - 1) * rowsPerPage,
          draw: 0,
          token,
        })
      );

      dispatch(
        myTeamTicketRecord({
          searchValue: "",
          length: parseInt(rowsPerPage),
          start: (currentPage - 1) * rowsPerPage,
          draw: 0,
          token,
        })
      );

      setCurrentPage(currentPage);

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.responseData);
    }
  }
);

export const statusChange = createAsyncThunk(
  "status/update",
  async ({ ticketId, status, uId, rowsPerPage, currentPage, setCurrentPage, token }, { dispatch, rejectWithValue }) => {
    try {
      const commonHeaders = {
        Accept: "*/*",

        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": AccessControlOrigin,
        "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,PATCH,OPTIONS",

        "X-APIKEY": APIKEY,
        AgentName: AgentName,
        Authorization: token,
      };
      const apiUrlPath = `${ApiUrl}/status/update`;
      const response = await axios.post(
        apiUrlPath,
        {
          ticketId,
          status,
          uId,
        },
        {
          headers: commonHeaders,
        }
      );

      dispatch(
        fetchAllTicketRecord({
          searchValue: "",
          length: parseInt(rowsPerPage),
          start: (currentPage - 1) * rowsPerPage,
          draw: 0,
          token,
        })
      );

      dispatch(
        myTeamTicketRecord({
          searchValue: "",
          length: parseInt(rowsPerPage),
          start: (currentPage - 1) * rowsPerPage,
          draw: 0,
          token,
        })
      );
      setCurrentPage(currentPage);

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.responseData);
    }
  }
);

export const statusReject = createAsyncThunk(
  "status/reject",
  async (
    { ticketId, rejectReason, status, uId, rowsPerPage, currentPage, setCurrentPage, token },
    { dispatch, rejectWithValue }
  ) => {
    try {
      const commonHeaders = {
        Accept: "*/*",
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": AccessControlOrigin,
        "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,PATCH,OPTIONS",

        "X-APIKEY": APIKEY,
        AgentName: AgentName,
        Authorization: token,
      };
      const apiUrlPath = `${ApiUrl}/status/reject`;
      const response = await axios.post(
        apiUrlPath,
        {
          ticketId,
          rejectReason,
        },
        {
          headers: commonHeaders,
        }
      );

      dispatch(
        fetchAllTicketRecord({
          searchValue: "",
          length: parseInt(rowsPerPage),
          start: (currentPage - 1) * rowsPerPage,
          draw: 0,
          token,
        })
      );

      dispatch(
        myTeamTicketRecord({
          searchValue: "",
          length: parseInt(rowsPerPage),
          start: (currentPage - 1) * rowsPerPage,
          draw: 0,
          token,
        })
      );

      setCurrentPage(currentPage);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.responseData);
    }
  }
);

//   MY Team All Records  //

const initialState = {
  ticketList: [],
  ticketData: [],
  ticketUpdata: [],
  fetchAllTicketList: [],
  statusCheck: [],
  statusChanges: [],
  statusReject: [],
  myTeamTickets: [],
  loading: false,
  error: undefined,
};

const ticketRequestSlice = createSlice({
  name: "ticketRequest",
  initialState,
  reducers: {
    ticketData: (state, action) => {
      return { ...state, ticketData: action.payload };
    },
    ticketUpdata: (state, action) => {
      return { ...state, ticketUpdata: action.payload };
    },
  },
  extraReducers: (builder) => {
    builder

      .addCase(getAllTickets.fulfilled, (state, action) => {
        if (action.payload.status) {
          return { ...state, loading: false, ticketList: action.payload };
        } else {
          return { ...state, loading: false, ticketList: initialState.ticketList };
        }
      })
      .addCase(getAllTickets.pending, (state) => {
        return { ...state, loading: true };
      })
      .addCase(fetchAllTicketRecord.fulfilled, (state, action) => {
        if (action.payload) {
          return { ...state, loading: false, fetchAllTicketList: action.payload };
        } else {
          return { ...state, loading: false, fetchAllTicketList: initialState.fetchAllTicketList };
        }
      })
      .addCase(fetchAllTicketRecord.pending, (state) => {
        return { ...state, loading: true };
      })

      .addCase(createTickets.fulfilled, (state, action) => {
        if (action.payload.status == true) {
          if (action.payload.message.toLowerCase() == "success") {
            toast.success("Ticket updated successfully.");
          } else {
            toast.warning("Ticket already exists.");
          }
          return { ...state, loading: false, ticketData: action.payload };
        } else {
          toast.error("Something went wrong");
          return { ...state, loading: false, ticketData: initialState.ticketData };
        }
      })
      .addCase(createTickets.pending, (state) => {
        return { ...state, loading: true };
      })

      .addCase(statusUpdate.fulfilled, (state, action) => {
        if (action.payload.status == true) {
          if (action.payload.message.toLowerCase() == "success") {
            toast.success("Ticket status updated successfully.");
          }
          return { ...state, loading: false, statusCheck: action.payload };
        } else {
          toast.error("Something went wrong");
          return { ...state, loading: false, statusCheck: initialState.statusCheck };
        }
      })
      .addCase(statusUpdate.pending, (state) => {
        return { ...state, loading: true };
      })

      .addCase(statusChange.fulfilled, (state, action) => {
        if (action.payload.status == true) {
          if (action.payload.message.toLowerCase() == "success") {
            toast.success("Ticket status updated successfully.");
          }
          return { ...state, loading: false, statusChanges: action.payload };
        } else {
          toast.error("Something went wrong");
          return { ...state, loading: false, statusChanges: initialState.statusChanges };
        }
      })
      .addCase(statusChange.pending, (state) => {
        return { ...state, loading: true };
      })

      .addCase(statusReject.fulfilled, (state, action) => {
        if (action.payload.status == true) {
          if (action.payload.message.toLowerCase() == "success") {
            toast.success("Ticket status updated successfully.");
          }
          return { ...state, loading: false, statusChanges: action.payload };
        } else {
          toast.error("Something went wrong");
          return { ...state, loading: false, statusChanges: initialState.statusChanges };
        }
      })
      .addCase(statusReject.pending, (state) => {
        return { ...state, loading: true };
      })

      .addCase(myTeamTicketRecord.fulfilled, (state, action) => {
        if (action.payload) {
          return { ...state, loading: false, myTeamTickets: action.payload };
        } else {
          return { ...state, loading: false, myTeamTickets: initialState.myTeamTickets };
        }
      })
      .addCase(myTeamTicketRecord.pending, (state) => {
        return { ...state, loading: true };
      });
  },
});
export const ticketRequestReducer = ticketRequestSlice.reducer;
export const ticketRequestSelector = (state) => state.ticketRequest;
export const { ticketTypeData, ticketUpdata } = ticketRequestSlice.actions;
