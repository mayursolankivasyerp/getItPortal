import { combineReducers } from "redux";
import { ticketTypeReducer } from "./ticketType.reducer";
import { ticketRequestReducer } from "./ticketRequest.reducer";
import { dashboardReducer } from "./dashboard.reducer";
import { profileReducer } from "./loginProfile.reducer";
import { permissionReducer } from "./rolePermission.reducer";
const rootReducer = combineReducers({
  ticketType: ticketTypeReducer,
  ticketRequest: ticketRequestReducer,
  dashboard: dashboardReducer,
  profile: profileReducer,
  permission: permissionReducer,
});

export default rootReducer;
