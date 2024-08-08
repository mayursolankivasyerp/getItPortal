import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import "react-toastify/dist/ReactToastify.css";
import { ApiUrl, AgentName, APIKEY, AccessControlOrigin } from "../utils/Constant";

// Create Comment for ticket
export const createComment = createAsyncThunk(
  "ticket/create",
  
  async (
    { token, formData, ticketId, setItem },

    {dispatch, rejectWithValue }
    
  ) => {
    // debugger
    try {
      const commonHeaders = {
        Accept: "application/json",
        "Content-Type": "multipart/form-data",
        "X-APIKEY": APIKEY,
        AgentName: AgentName,
        Authorization: token,
      };
      const response = await axios.post(`${ApiUrl}/comments/create`, formData, {
        headers: commonHeaders,
      });
      if (response.data.status) {
        dispatch(commentDetails({ticketId, token, setItem}))
      }
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.responseData);
    }
  }
);

export const commentDetails = createAsyncThunk(
  "comments/details",
  async (
    { ticketId, token, setItem },

    { rejectWithValue }
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
      // Include the ticketId in the URL
      const apiUrlPath = `${ApiUrl}/comments/details/${ticketId}`;
      const response = await axios.get(apiUrlPath, {
        headers: commonHeaders,
      });
  
      setItem(response.data.response);
    } catch (error) {
      throw error;
    }
  }
);

// Get Ticket Details Data from the Database
// Update commentDetails to accept ticketId as an argument
// export const commentDetails = async (ticketId, token, setItem) => {
//   try {
//     const commonHeaders = {
//       Accept: "*/*",
//       "Content-Type": "application/json",
//       "Access-Control-Allow-Origin": AccessControlOrigin,
//       "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,PATCH,OPTIONS",
//       "X-APIKEY": APIKEY,
//       AgentName: AgentName,
//       Authorization: token,
//     };

//     // Include the ticketId in the URL
//     const apiUrlPath = `${ApiUrl}/comments/details/${ticketId}`;
//     const response = await axios.get(apiUrlPath, {
//       headers: commonHeaders,
//     });

//     setItem(response.data.response);
//   } catch (error) {
//     throw error;
//   }
// };

