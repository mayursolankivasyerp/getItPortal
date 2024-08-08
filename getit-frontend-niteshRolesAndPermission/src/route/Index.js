import React, { useLayoutEffect, useContext, useEffect, useState } from "react";
import { Routes, Route, useLocation } from "react-router-dom";

import { useDispatch, useSelector } from "react-redux";
import { CustomerProvider } from "../pages/panel/e-commerce/customer/CustomerContext";
import { ProductContextProvider } from "../pages/pre-built/products/ProductContext";
import { UserContextProvider } from "../pages/pre-built/user-manage/UserContext";

import Homepage from "../pages/Homepage";
import Sales from "../pages/Sales";
import Analytics from "../pages/Analytics";

import EcomOrder from "../pages/panel/e-commerce/order/OrderDefault";
import EcomSupport from "../pages/panel/e-commerce/support/Messages";
import EcomProducts from "../pages/panel/e-commerce/product/ProductList";
import EcomCustomer from "../pages/panel/e-commerce/customer/CustomerList";
import EcomCustomerDetails from "../pages/panel/e-commerce/customer/CustomerDetails";
import EcomIntegration from "../pages/panel/e-commerce/integration/Integration";
import EcomSettings from "../pages/panel/e-commerce/settings/Settings";
import EcomDashboard from "../pages/panel/e-commerce/index";

import Component from "../pages/components/Index";
import Accordian from "../pages/components/Accordions";
import Alerts from "../pages/components/Alerts";
import Avatar from "../pages/components/Avatar";
import Badges from "../pages/components/Badges";
import Breadcrumbs from "../pages/components/Breadcrumbs";
import ButtonGroup from "../pages/components/ButtonGroup";
import Buttons from "../pages/components/Buttons";
import Cards from "../pages/components/Cards";
import Carousel from "../pages/components/Carousel";
import Dropdowns from "../pages/components/Dropdowns";
import FormElements from "../pages/components/forms/FormElements";
import FormLayouts from "../pages/components/forms/FormLayouts";
import FormValidation from "../pages/components/forms/FormValidation";
import DataTablePage from "../pages/components/table/DataTable";
import DateTimePicker from "../pages/components/forms/DateTimePicker";
import CardWidgets from "../pages/components/widgets/CardWidgets";
import ChartWidgets from "../pages/components/widgets/ChartWidgets";
import RatingWidgets from "../pages/components/widgets/RatingWidgets";
import SlickPage from "../pages/components/misc/Slick";
import SweetAlertPage from "../pages/components/misc/SweetAlert";
import BeautifulDnd from "../pages/components/misc/BeautifulDnd";
import DualListPage from "../pages/components/misc/DualListbox";
import GoogleMapPage from "../pages/components/misc/GoogleMap";
import Modals from "../pages/components/Modals";
import Pagination from "../pages/components/Pagination";
import Popovers from "../pages/components/Popovers";
import Progress from "../pages/components/Progress";
//import Spinner from "../pages/components/Spinner";
import Tabs from "../pages/components/Tabs";
import Toast from "../pages/components/Toast";
import Tooltips from "../pages/components/Tooltips";
import Typography from "../pages/components/Typography";
import CheckboxRadio from "../pages/components/forms/CheckboxRadio";
import AdvancedControls from "../pages/components/forms/AdvancedControls";
import InputGroup from "../pages/components/forms/InputGroup";
import FormUpload from "../pages/components/forms/FormUpload";
import NumberSpinner from "../pages/components/forms/NumberSpinner";
import NouiSlider from "../pages/components/forms/nouislider";
import WizardForm from "../pages/components/forms/WizardForm";
import UtilBorder from "../pages/components/UtilBorder";
import UtilColors from "../pages/components/UtilColors";
import UtilDisplay from "../pages/components/UtilDisplay";
import UtilEmbeded from "../pages/components/UtilEmbeded";
import UtilFlex from "../pages/components/UtilFlex";
import UtilOthers from "../pages/components/UtilOthers";
import UtilSizing from "../pages/components/UtilSizing";
import UtilSpacing from "../pages/components/UtilSpacing";
import UtilText from "../pages/components/UtilText";

import Blank from "../pages/others/Blank";
import Faq from "../pages/others/Faq";
import Regularv1 from "../pages/others/Regular-1";
import Regularv2 from "../pages/others/Regular-2";
import Terms from "../pages/others/Terms";
import BasicTable from "../pages/components/table/BasicTable";
import SpecialTablePage from "../pages/components/table/SpecialTable";
import ChartPage from "../pages/components/charts/Charts";
import EmailTemplate from "../pages/components/email-template/Email";
import NioIconPage from "../pages/components/crafted-icons/NioIcon";
import SVGIconPage from "../pages/components/crafted-icons/SvgIcons";

import ProjectCardPage from "../pages/pre-built/projects/ProjectCard";
import ProjectListPage from "../pages/pre-built/projects/ProjectList";
import TicketTypeList from "../pages/pre-built/ticketTypes/TicketTypeList";

import TicketLists from "../pages/pre-built/user-manage/TicketLists";
import UserListRegular from "../pages/pre-built/user-manage/UserListRegular";
import UserContactCard from "../pages/pre-built/user-manage/UserContactCard";
import UserDetails from "../pages/pre-built/user-manage/UserDetailsRegular";
import UserListCompact from "../pages/pre-built/user-manage/UserListCompact";
import UserProfileRegular from "../pages/pre-built/user-manage/UserProfileRegular";
import UserProfileSetting from "../pages/pre-built/user-manage/UserProfileSetting";
import UserProfileNotification from "../pages/pre-built/user-manage/UserProfileNotification";
import UserProfileActivity from "../pages/pre-built/user-manage/UserProfileActivity";
import OrderDefault from "../pages/pre-built/orders/OrderDefault";
import OrderRegular from "../pages/pre-built/orders/OrderRegular";
import OrderSales from "../pages/pre-built/orders/OrderSales";
import KycListRegular from "../pages/pre-built/kyc-list-regular/KycListRegular";
import KycDetailsRegular from "../pages/pre-built/kyc-list-regular/kycDetailsRegular";
import ProductCard from "../pages/pre-built/products/ProductCard";
import ProductList from "../pages/pre-built/products/ProductList";
import ProductDetails from "../pages/pre-built/products/ProductDetails";
import InvoiceList from "../pages/pre-built/invoice/InvoiceList";
import InvoiceDetails from "../pages/pre-built/invoice/InvoiceDetails";
import InvoicePrint from "../pages/pre-built/invoice/InvoicePrint";
import PricingTable from "../pages/pre-built/pricing-table/PricingTable";
import GalleryPreview from "../pages/pre-built/gallery/GalleryCardPreview";
import ReactToastify from "../pages/components/misc/ReactToastify";

import AppMessages from "../pages/app/messages/Messages";
import Chat from "../pages/app/chat/ChatContainer";
import Kanban from "../pages/app/kanban/Kanban";
import FileManager from "../pages/app/file-manager/FileManager";
import FileManagerFiles from "../pages/app/file-manager/FileManagerFiles";
import FileManagerShared from "../pages/app/file-manager/FileManagerShared";
import FileManagerStarred from "../pages/app/file-manager/FileManagerStarred";
import FileManagerRecovery from "../pages/app/file-manager/FileManagerRecovery";
import FileManagerSettings from "../pages/app/file-manager/FileManagerSettings";
import Inbox from "../pages/app/inbox/Inbox";
import Calender from "../pages/app/calender/Calender";
import JsTreePreview from "../pages/components/misc/JsTree";
import QuillPreview from "../pages/components/forms/rich-editor/QuillPreview";
import TinymcePreview from "../pages/components/forms/rich-editor/TinymcePreview";
import KnobPreview from "../pages/components/charts/KnobPreview";

import Error404Classic from "../pages/error/404-classic";
import Error404Modern from "../pages/error/404-modern";
import Error504Modern from "../pages/error/504-modern";
import Error504Classic from "../pages/error/504-classic";

import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import ForgotPassword from "../pages/auth/ForgotPassword";
import Success from "../pages/auth/Success";

import Layout from "../layout/Index";
import LayoutNoSidebar from "../layout/Index-nosidebar";
import { getPermission, permissionSelector } from "../reducers/rolePermission.reducer";
import { AzureAD, AuthenticationState } from "react-aad-msal";

import { Badge, DropdownItem, DropdownMenu, DropdownToggle, Spinner, UncontrolledDropdown } from "reactstrap";
const Router = ({ userProfile, userLogOut, authenticationState }) => {
  const dispatch = useDispatch();

  const location = useLocation();
  useLayoutEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

  const {
    permission: { permissionList, loading },
  } = useSelector((state) => state);

  const [loader, setLoader] = useState(true);

  useEffect(() => {
    if (!loading && permissionList?.response && permissionList.response) {
      setLoader(false);
    }
  }, [permissionList, loading]);

  return (
    <React.Fragment>
      {loader ? (
        
        <div style={{height:'100vh', width:"100%", display:'flex', justifyContent:'center', alignItems:'center'}}>
          <Spinner size="m"  style={{
      height: '3rem',
      width: '3rem'
    }} color="primary" className="text-center" />
        </div>
      ) : (
        <React.Fragment>
          <Routes>
            <Route
              element={
                <Layout userProfile={userProfile} userLogOut={userLogOut} authenticationState={authenticationState} />
              }
            >
              {permissionList?.response?.map((item, index) => {
                let menuPath;
                let menuComponent;
                if (item.title == "Dashboard") {
                  menuPath = item.menuURL;
                  menuComponent = <EcomDashboard />;
                } else if (item.title == "Ticket Management") {
                  menuPath = "/ticket";
                  menuComponent = <TicketLists />;
                } else if (item.title == "Ticket Type") {
                  menuPath = "/ticketTypeList";
                  menuComponent = <TicketTypeList />;
                }
                return (
                  <React.Fragment key={index}>
                    {permissionList?.response.find((item) => item.status === "active") && (
                      <Route path="/" element={menuComponent} />
                    )}
                    {item.status === "active" && <Route path={menuPath} element={menuComponent} />}
                  </React.Fragment>
                );
              })}
            </Route>

            <Route path="*" element={<Error404Modern />}></Route>
          </Routes>
        </React.Fragment>
      )}
    </React.Fragment>
  );
};
export default Router;
