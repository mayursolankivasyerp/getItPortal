import React from "react";
import { Card } from "reactstrap";
import { Icon } from "../../Component";

const DataCard = ({ title, amount, icon, color }) => {
  return (
    <Card>
      <div className="nk-ecwg nk-ecwg6">
        <div className="card-inner position-relative">
          <div>
            <div className="card-title-group">
              <div className="card-title">
                <h6 className="title">{title}</h6>
              </div>
            </div>
            <div className="data">
              <div className="data-group">
                <div className="amount">{amount}</div>
              </div>
            </div>
          </div>
          <div className="custom-i">
            <Icon className={`custom-icon ${color}`} name={icon} />
          </div>
        </div>
      </div>
    </Card>
  );
};

export default DataCard;
