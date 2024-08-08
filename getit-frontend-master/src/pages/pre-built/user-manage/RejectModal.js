import React, { useContext, useEffect, useState } from "react";
import { Icon, Button, Col, RSelect } from "../../../components/Component";
import { Modal, ModalBody, ModalHeader, Form } from "reactstrap";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { statusReject } from "../../../reducers/ticketRequest.reducer";
import { confirmationSwalFunction, globalSwalFunction } from "../../../utils/globalSwal";

const RejectModal = ({ modal, closeModal, pages, current, currentState, selectedId, menuURL, rowsPerPage,
  currentPage,
  setCurrentPage, }) => {
  const dispatch = useDispatch();

  function getCookie(name) {
    return document.cookie.match("(^|;)\\s*" + name + "\\s*=\\s*([^;]+)")?.pop() || null;
  }
  const token = getCookie("GetItToken");
  const {
    register,
    handleSubmit,
    getValues,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      status: "Reject",
      rejectReason: "",
    },
  });
  watch();

  const onSubmit = handleSubmit((datas) => {
    confirmationSwalFunction("Status ", "Are you sure you want to Reject?", "warning", "Yes").then((res) => {
      if (res.isConfirmed) {
        dispatch(
          statusReject({
            ticketId: selectedId,
            rejectReason: datas.rejectReason,
            menuUrl:menuURL, 
            rowsPerPage, 
            currentPage, 
            setCurrentPage, 
            token: token,
          })
        );
        reset();
        // closeViewModal();
        closeModal(false);
      }
    });
  });

  return (
    <Modal
      isOpen={modal}
      toggle={() => {
        closeModal(false);
        reset();
      }}
      className="modal-dialog-centered"
      size="sm"
    >
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
        <div className="p-2">
          <h5 className="title">Status</h5>
          <div className="mt-4">
            <Form noValidate method="POST" className="row gy-4" onSubmit={onSubmit}>
              <Col md="12">
                <div className="form-group">
                  <label className="form-label">
                    <div>
                      Reason
                      <span className="allLabels">*</span>
                    </div>
                  </label>
                  <div className="form-control-wrap">
                    <textarea
                      className="no-resize form-control"
                      {...register("rejectReason", {
                        required: "Reason is required",
                      })}
                      type="textarea"
                      id="textarea"
                      placeholder="Enter Reason"
                      onChange={(e) =>
                        setValue("reason", e.target.value.trimStart(), {
                          shouldValidate: true,
                          shouldTouch: true,
                        })
                      }
                      maxlength="100"
                      value={getValues("reason")}
                    />
                    {errors.reason && <span className="invalid">{errors.reason.message}</span>}
                  </div>
                </div>
              </Col>
              <Col size="12">
                <ul className="align-center flex-wrap flex-sm-nowrap gx-4 gy-2">
                  <li>
                    <Button color="warning" size="md" type="submit">
                      Reject
                    </Button>
                  </li>
                  <li>
                    <Button
                      onClick={(ev) => {
                        ev.preventDefault();
                        closeModal();
                      }}
                      className="link link-light"
                    >
                      Cancel
                    </Button>
                  </li>
                </ul>
              </Col>
            </Form>
          </div>
        </div>
      </ModalBody>
    </Modal>
  );
};

export default RejectModal;
