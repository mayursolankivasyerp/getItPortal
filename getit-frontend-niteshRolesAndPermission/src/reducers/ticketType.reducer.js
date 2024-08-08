import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Cookies from "js-cookie";
import { ApiUrl, AgentName, token, APIKEY, AccessControlOrigin } from "../utils/Constant";

export const getAllTicketType = createAsyncThunk("subtype/typelist", async (token, { rejectWithValue }) => {
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
    { subTypeId, type, subType, uId, rowsPerPage, currentPage, setCurrentPage, token },
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
      const apiUrlPath = `${ApiUrl}/subtype/create`;
      const response = await axios.post(
        apiUrlPath,
        {
          subTypeId,
          type,
          subType,
          uId,
          createdBy: "nitesh",
        },
        {
          headers: commonHeaders,
        }
      );

      dispatch(
        fetchTicketTypes({
          searchValue: "",
          length: parseInt(rowsPerPage),
          start: subTypeId === 0 ? 0 : (currentPage - 1) * rowsPerPage,
          draw: 0,
          token,
        })
      );

      if (subTypeId === 0) {
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

export const deleteTicketTypeById = createAsyncThunk(
  "/subtype/delete",
  async (
    { id, rowsPerPage, currentPage, dynamicData, totalTicketType, setCurrentPage, token },
    { dispatch, rejectWithValue }
  ) => {
    try {
      if (id) {
        const response = await axios.post(
          `${ApiUrl}/subtype/delete/${id}`,
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
          fetchTicketTypes({
            searchValue: "",
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

const initialState = {
  ticketTypeList: [],
  ticketTypeData: [],
  fetchList: [],

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
