// import React from "react";
// import Icon from "../../components/icon/Icon";

// const Toggle = ({ className, click,setHide, icon }) => {
//   return (
//     <a
//       href="#toggle"
//       className={className ? className : ""}
//       onClick={(ev) => {
//         ev.preventDefault();
//         click(ev);
//         setHide(true)
//       }}
//     >
//       <Icon name={icon} />
//     </a>
//   );
// };
// export default Toggle;


import React from "react";
import Icon from "../../components/icon/Icon";

const Toggle = ({ className, click, icon }) => {
  return (
    <a
      href="#toggle"
      className={className ? className : ""}
      onClick={(ev) => {
        ev.preventDefault();
        click(ev);
      }}
    >
      <Icon name={icon} />
    </a>
  );
};
export default Toggle;