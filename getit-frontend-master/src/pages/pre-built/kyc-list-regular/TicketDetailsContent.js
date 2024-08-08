import React from "react";
import { Card } from "reactstrap";
import {
  BlockHead,
  BlockHeadContent,
  BlockTitle,
  Col,
} from "../../../components/Component";

const TicketDetailsContent = ({ ticket }) => {
  // Define status colors
  const statusColors = {
    InProgress: "ebebeb",
    Success: "#30f558",
    Pending: "#f5c330",
    Closed: "#a1a1a1",
    Approve: "#00cb6c",
    Rejected: "#ff0000",
    "Business Approved": "#4de0b7",
    "Business Approval Pending": "#8da0ff",
  };

  // Assuming there's only one ticket in the array
  if (!ticket || ticket.length === 0) {
    return <p>No ticket data available.</p>;
  }

  // Assuming there's only one ticket in the array
  const ticketItem = ticket[0] || {};

  return (
    <Col lg="12">
      <BlockHead>
        <BlockHeadContent>
          <BlockTitle tag="h5">Ticket Info</BlockTitle>
          <p>Submission date, approve date, status, etc.</p>
        </BlockHeadContent>
      </BlockHead>

      <Card className="flex-lg-row" style={{ display: "flex !important" }}>
        <ul className="data-list is-compact col-12 d-flex flex-wrap">
          <Col lg="6">
            <li className="data-item">
              <div className="data-col">
                <div className="col-4 fw-bold">Ticket Id</div>
                <div className="data-value">{ticketItem.ticketId}</div>
              </div>
            </li>
            <li className="data-item">
              <div className="data-col">
                <div className="col-4 fw-bold">Submitted By</div>
                <div className="data-value">{ticketItem.createdBy}</div>
              </div>
            </li>
            <li className="data-item">
              <div className="data-col">
                <div className="col-4 fw-bold">Type</div>
                <div className="data-value">{ticketItem.type}</div>
              </div>
            </li>
            <li className="data-item">
              <div className="data-col">
                <div className="col-4 fw-bold">Reporting Manager</div>
                <div className="data-value text-break">
                  {ticketItem.reportingManager}
                </div>
              </div>
            </li>
            <li className="data-item">
              <div className="data-col">
                <div className="col-4 fw-bold">Submitted By</div>
                <div className="data-value">
  {ticketItem.submittedBy !== null ? ticketItem.submittedBy : '-'}
</div>
              </div>
            </li>
          </Col>
          <Col lg="6">
            <li className="data-item">
              <div className="data-col">
                <div className="col-4 fw-bold">Status</div>
                <div className="data-value d-flex">
                  <span
                    style={{
                      color: statusColors[ticketItem.status],
                    }}
                    className="status-cells"
                    data-status={ticketItem.status}
                  >
                    {ticketItem.status}
                  </span>
                </div>
              </div>
            </li>
            <li className="data-item">
              <div className="data-col">
                <div className="col-4 fw-bold">Submitted At</div>
                <div className="data-value">{ticketItem.createdOn}</div>
              </div>
            </li>
            
            <li className="data-item">
              <div className="data-col">
                <div className="col-4 fw-bold">Sub-Type</div>
                <div className="data-value">{ticketItem.subType}</div>
              </div>
            </li>
            <li className="data-item">
              <div className="data-col">
                <div className="col-4 fw-bold">Priority</div>
                <div className="data-value">{ticketItem.priority}</div>
              </div>
            </li>
            <li className="data-item">
              <div className="data-col">
                <div className="col-4 fw-bold">Close At</div>
                <div className="data-value">
  {ticketItem.submittedOn !== null ? ticketItem.submittedOn : '-'}
</div>
              </div>
            </li>
          </Col>
          {ticketItem.status === "Rejected" && (
            <Col lg="12">
              <li className="data-item">
                <div className="data-col">
                  <div style={{ width: "16%" }} className="col-4 fw-bold">
                    Reject Reason
                  </div>
                  <div className="data-value">{ticketItem.rejectReason}</div>
                </div>
              </li>
            </Col>
          )}
          <Col lg="12">
            <li className="data-item">
              <div className="data-col">
                <div style={{ width: "16%" }} className="col-2 fw-bold">
                  Description
                </div>
                <div className="data-value text-break">
                  {ticketItem.description}
                </div>
              </div>
            </li>
          </Col>
          <Col lg="12">
            <li className="data-item">
              <div className="data-col">
                <div style={{ width: "16%" }} className="col-2 fw-bold">
                  Attachment
                </div>
                {
                    ticketItem.files !== "" ?  <a href={ticketItem.files} download={"Attachment Download"}>
                    {"Attachment Download"}
                    </a>
                    :
                    <p>No Attachment</p>
                  }
              </div>
            </li>
          </Col>
        </ul>
      </Card>

      {ticketItem.attachment?.length > 0 && (
        <>
          <BlockHead>
            <BlockHeadContent>
              <BlockTitle tag="h5">Uploaded Documents</BlockTitle>
              <p>Here are user uploaded documents.</p>
            </BlockHeadContent>
          </BlockHead>

          <div
            className={`d-flex flex-wrap ${
              ticketItem.attachment.length > 4
                ? "justify-content-center align-items-center"
                : ""
            }`}
          >
            {ticketItem.attachment.map((attachment, index) => {
              const parts = attachment.url.split("?");
              const urlWithoutQuery = parts[0];
              const filenameParts = urlWithoutQuery.split("/");
              const filename = filenameParts[filenameParts.length - 1];
              return (
                <div className="col-3 p-1" key={index}>
                  <Card>
                    <ul className="data-list is-compact">
                      <li className="data-item">
                        <div className="data-col" style={{ overflow: "hidden" }}>
                          <div
                            className="data-value"
                            style={{
                              whiteSpace: "nowrap",
                              textOverflow: "ellipsis",
                              overflow: "hidden",
                            }}
                          >
                            <a href={attachment.url} target="_blank">
                              {filename ? filename : "Attachment"}
                            </a>
                          </div>
                        </div>
                      </li>
                    </ul>
                  </Card>
                </div>
              );
            })}
          </div>
        </>
      )}
    </Col>
  );
};

export default TicketDetailsContent;

 

 