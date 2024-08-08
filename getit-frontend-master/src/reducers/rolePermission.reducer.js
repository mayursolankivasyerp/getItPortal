import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ApiUrl, AgentName, token, APIKEY, AccessControlOrigin } from "../utils/Constant";

export const getPermission = createAsyncThunk("menu/getpermission", async (token, { rejectWithValue }) => {
  try {
    const commonHeaders = {
      Accept: "*/*",
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": AccessControlOrigin,
      "X-APIKEY": APIKEY,
      AgentName: AgentName,
      Authorization: token,
    };
    const response = await axios.get(`${ApiUrl}/menu/getpermission`, {
      headers: commonHeaders,
    });

    return response.data;
  } catch (error) {
    return rejectWithValue(error.response.responseData);
  }
});

export const ClearData = () => {};

const initialState = {
  permissionList: [],
  loading: false,
  error: undefined,
};

const permissionSlice = createSlice({
  name: "permission",
  initialState,

  reducers: {
    permissionList: (state, action) => {
      return { ...state, permissionList: action.payload };
    },
    clearPermissionList: (state) => {
      return { ...state, permissionList: [] };
    },
  },
  extraReducers: (builder) => {
    builder

      .addCase(getPermission.fulfilled, (state, action) => {
        if (action.payload) {
          return { ...state, loading: false, permissionList: action.payload };
        } else {
          return { ...state,  loading: true, permissionList: initialState.permissionList };
        }
      })
      .addCase(getPermission.pending, (state) => {
        return { ...state, loading: true };
      });
  },
});
export const permissionReducer = permissionSlice.reducer;
export const permissionSelector = (state) => state.permission;
export const { permissionList, clearPermissionList } = permissionSlice.actions;
