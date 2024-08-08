import React, { useState } from "react";
import { Card, UncontrolledDropdown, DropdownMenu, DropdownItem, DropdownToggle } from "reactstrap";
import { Icon } from "../../../Component";
import { Button, Modal, ModalBody, Badge } from "reactstrap";

const TrafficSources = ({
  title,
  attribute,
  componentType,
  categoriesItems,
  openTickets,
  closedEntries,
  All,
  onAllClick,
  onOpenTicketsClick,
  onClosedEntriesClick,
}) => {
  const [data, setData] = useState("7");
  return (
    <Card className="card-full overflow-hidden">
      <div className="nk-ecwg nk-ecwg4 h-100">
        <div className="card-inner flex-grow-1">
          <div className="card-title-group mb-4">
            <div className="card-title">
              <h6 className="title">{title}</h6>
            </div>

            <div className="">
              <Button color="info" className="btn-sm rounded-pill me-1" onClick={onAllClick}>
                {All}
              </Button>
              <Button color="success" className="btn-sm rounded-pill me-1" onClick={onOpenTicketsClick}>
                {openTickets}
              </Button>
              <Button color="warning" className="btn-sms rounded-pill" onClick={onClosedEntriesClick}>
                {closedEntries}
              </Button>
            </div>
          </div>
          <div className="data-group">
            <div className="nk-ecwg4-ck">{componentType}</div>
            {categoriesItems.length > 0 ? (
              <ul className="nk-ecwg4-legends">
                {categoriesItems.map((item, index) => (
                  <li key={index}>
                    <div className="title">
                      <span className="dot dot-lg sq" style={{ background: item.color }}></span>
                      <span>{item.label}</span>
                    </div>
                    <div className="amount amount-xs">{item.data}</div>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No items available</p>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
};

export default TrafficSources;
