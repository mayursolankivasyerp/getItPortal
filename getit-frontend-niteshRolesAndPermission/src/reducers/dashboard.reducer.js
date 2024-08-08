import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Cookies from "js-cookie";
import { ApiUrl, AgentName, token, APIKEY , AccessControlOrigin} from "../utils/Constant";

export const getTotalDashboardActivity = createAsyncThunk("/dashboard/", async (token, { rejectWithValue }) => {
  try {
    const commonHeaders = {
      Accept: "*/*",
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": AccessControlOrigin,
      "X-APIKEY": APIKEY,
      AgentName: AgentName,
      Authorization: token,
    };
    const response = await axios.get(`${ApiUrl}/dashboard/`, {
      headers: commonHeaders,
    });

    return response.data;
  } catch (error) {
    return rejectWithValue(error.response.responseData);
  }
});

export const totalDashboardTicketCategories = createAsyncThunk(
  "/dashboard/categories",
  async ({ status, token }, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${ApiUrl}/dashboard/categories?status=${status}`,

        {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            "X-APIKEY": APIKEY,
            "Access-Control-Allow-Origin": AccessControlOrigin,
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
  totalDashboardActivityList: [],
  totalDashboardCategoriesList: [],
  loading: false,
  error: undefined,
};

const dashboardSlice = createSlice({
  name: "dashboard",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder

      .addCase(getTotalDashboardActivity.fulfilled, (state, action) => {
        if (action.payload) {
          return { ...state, loading: false, totalDashboardActivityList: action.payload };
        } else {
          return { ...state, loading: false, totalDashboardActivityList: initialState.totalDashboardActivityList };
        }
      })
      .addCase(getTotalDashboardActivity.pending, (state) => {
        return { ...state, loading: true };
      })

      .addCase(totalDashboardTicketCategories.fulfilled, (state, action) => {
        if (action.payload) {
          return { ...state, loading: false, totalDashboardCategoriesList: action.payload };
        } else {
          return { ...state, loading: false, totalDashboardCategoriesList: initialState.totalDashboardCategoriesList };
        }
      })
      .addCase(totalDashboardTicketCategories.pending, (state) => {
        return { ...state, loading: true };
      });
  },
});
export const dashboardReducer = dashboardSlice.reducer;
export const dashboardSelector = (state) => state.dashboard;
//export const { ticketTypeData } = ticketTypeSlice.actions;
