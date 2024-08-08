import { Button, Modal, ModalBody, Badge } from "reactstrap";
import { Icon, Row, Col } from "../../../components/Component";
import { useDispatch, useSelector } from "react-redux";
import { statusUpdate, statusChange, statusReject } from "../../../reducers/ticketRequest.reducer";
import React, { useState, useEffect } from "react";
import { Card, CardImg } from "reactstrap";
import "../../../../src/style.css";
import RejectModal from "./RejectModal";

const ViewRequest = ({
  closeModal,
  modal,
  selectedId,
  selectedData,
  setSelectedData,
  rowsPerPage,
  currentPage,
  setCurrentPage,
  activeTab,
  typeOfTable,
  checkAction,
}) => {
  const dispatch = useDispatch();
  const [isHidden, setIsHidden] = useState(false);
  const [rejectModal, setRejectModal] = useState(false);
  // const [token, setToken] = useState(getCookie("token"));
  function getCookie(name) {
    return document.cookie.match("(^|;)\\s*" + name + "\\s*=\\s*([^;]+)")?.pop() || null;
  }
  const token = getCookie("token");
  const handleStatus = () => {
    dispatch(
      statusUpdate({
        ticketId: selectedData?.ticketId,
        status: "Cancel",
        uId: 1,
        rowsPerPage,
        currentPage,
        setCurrentPage,
        token: token,
      })
    );

    setIsHidden(true);
    closeModal();
  };

  const handleApproved = () => {
    dispatch(
      statusChange({
        ticketId: selectedData?.ticketId,
        status: "Approved",
        uId: 1,
        rowsPerPage,
        currentPage,
        setCurrentPage,
        token: token,
      })
    );
    setIsHidden(true);
    closeModal();
  };

  return (
    <Modal isOpen={modal} toggle={() => closeModal()} className="modal-dialog-centered" size="xl">
      <ModalBody>
        <a
          href="#cancel"
          onClick={(ev) => {
            ev.preventDefault();

            closeModal();
          }}
          className="close"
        >
          <Icon name="cross-sm"></Icon>
        </a>

        <div className="nk-modal-head">
          <div className="d-flex align-items-center">
            {/* <h5 className="title mb-0 mr-2  me -2">Ticket Details</h5> */}
            <h5 className="title mb-0 mr-2  me -2">
              {selectedData?.ticketPreffix}
              {selectedData?.ticketId}
            </h5>
            <p className={`status-text  font-weight-bold ms-2 mb-0`}>{selectedData?.status}</p>
          </div>
        </div>
        <div className="nk-tnx-details mt-sm-3">
          <Row className="gy-3">
            <Col lg={12}>
              <span className="sub-text">Title </span>
              <span className="caption-text text-break">{selectedData?.title}</span>
            </Col>
            <Col lg={12}>
              <span className="sub-text">Description</span>
              <span className="caption-text description-text">{selectedData?.description}</span>
            </Col>
            {selectedData?.status == "Rejected" && (
              <Col lg={12}>
                <span className="sub-text">Reject Reason</span>
                <span className="caption-text description-text">{selectedData?.rejectReason}</span>
              </Col>
            )}
            <Col lg={4}>
              <span className="sub-text">Type </span>
              <span className="caption-text">{selectedData?.type === "SW" ? "Software" : "Hardware"}</span>
            </Col>

            <Col lg={4}>
              <span className="sub-text">SubType</span>
              <span className="caption-text">{selectedData?.subType}</span>
            </Col>
            <Col lg={4}>
              <span className="sub-text">Priority</span>
              <span className="caption-text">{selectedData?.priority}</span>
            </Col>
            <Col lg={4}>
              <span className="sub-text">CreatedAt</span>
              <span className="caption-text">{selectedData?.createdOn}</span>
            </Col>

            <Col lg={4}>
              <span className="sub-text">Attachment</span>
              {selectedData?.files && (
                <div className="image-zoom-container">
                  <CardImg src={selectedData?.files} alt="Preview" className="formImageUpload" />
                </div>
              )}
            </Col>
            <Col lg={4}>
              <span className="sub-text">CeatedBy</span>
              <span className="caption-text">{selectedData?.createdBy}</span>
            </Col>
            <Col lg={4}>
              <span className="sub-text">ReportingHead</span>
              <span className="caption-text">{selectedData?.reportingManager}</span>
            </Col>
          </Row>
        </div>

        <Row className="">
          <Col lg={12} className="d-flex justify-content-between ">
            <Col lg={6} className="">
              {typeOfTable == "1" && selectedData?.status === "Pending" && (
                <Button color="danger" className="mt-2 btn-sm rounded-pill" onClick={() => handleStatus()}>
                  Cancel
                </Button>
              )}
            </Col>
            <Col lg={6} className="d-flex justify-content-between">
              {typeOfTable == "2" && selectedData?.status === "Pending" && (
                <Button color="success" className="mt-2 btn-sm rounded-pill" onClick={() => handleApproved()}>
                  Approve
                </Button>
              )}

              {typeOfTable == "2" && selectedData?.status === "Pending" && (
                <Button
                  color="warning"
                  className="mt-2 btn-sms rounded-pill"
                  onClick={() => {
                    setRejectModal(true);
                  }}
                >
                  Reject
                </Button>
              )}
            </Col>
          </Col>
        </Row>

        <RejectModal
          title="Reject Status"
          modal={rejectModal}
          closeModal={() => setRejectModal(false)}
          closeViewModal={closeModal}
          data={selectedData}
          pages={rowsPerPage}
          current={currentPage}
          currentState={setCurrentPage}
        />
      </ModalBody>
    </Modal>
  );
};
export default ViewRequest;
