import React from "react";
// import LogoLight2x from "../../images/logo2x.png";
// import LogoDark2x from "../../images/logo-dark2x.png";
// import LogoSmall from "../../images/logo-small.png";
import {Link} from "react-router-dom";
import LogoSmall from "../../images/vasyLogo.png";
 
const handleRefresh = () =>{
  localStorage.removeItem("searchValueGetIt");
  localStorage.removeItem("currentPageGetIT");
  localStorage.removeItem("SelectedStatusGetIT");
  localStorage.removeItem("FilterCreateByGetIT");
  localStorage.removeItem("FilterTicketTypeGetIT");
  localStorage.removeItem("FilterStatusGetIT");
  localStorage.removeItem("FilterPriorityGetIT");
  localStorage.removeItem("FiltercreateOnGetIT");
  localStorage.removeItem("FiltercreateOnGetIT");
  localStorage.removeItem("FilterStatusInputGetIT");
  localStorage.removeItem("FilterPriorityInputGetIT");
  localStorage.removeItem("FilterCreateByInputGetIT");
  localStorage.removeItem("FilterTicketTypeInputGetIT");
}
 


const Logo = () => {
  return (
    <Link to={`${process.env.PUBLIC_URL}/`} className="logo-link">
      {/* <img className="logo-light logo-img" src={LogoLight2x} alt="logo" />
      <img className="logo-dark logo-img" src={LogoDark2x} alt="logo" />
      <img className="logo-small logo-img logo-img-small" src={LogoSmall} alt="logo" /> */}



      <img className="logo-light logo-img" src={LogoSmall} alt="logo" />
      <img className="logo-dark logo-img" src={LogoSmall} alt="logo" />
      <img className="logo-small logo-img logo-img-small" src={LogoSmall} alt="logo"  onClick={()=>{handleRefresh()}}/>
    </Link>
  );
};

export default Logo;
