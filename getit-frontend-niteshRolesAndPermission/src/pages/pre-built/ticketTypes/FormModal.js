import React, { useContext, useEffect, useState } from "react";
import { Icon, Button, Col, RSelect } from "../../../components/Component";
import { Modal, ModalBody, ModalHeader, Form, Label } from "reactstrap";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import {
  fetchTicketTypes,
  getAllTicketType,
  createTicketType,
  ticketTypeSelector,
} from "../../../reducers/ticketType.reducer";

const TicketTypeModal = ({
  title,
  modal,
  closeModal,
  ticketTypeData,
  rowsPerPage,
  currentPage,
  setCurrentPage,
  dynamicData,
}) => {
  const dispatch = useDispatch();
  // const [token, setToken] = useState(getCookie("token"));
  function getCookie(name) {
    return document.cookie.match("(^|;)\\s*" + name + "\\s*=\\s*([^;]+)")?.pop() || null;
  }
  const token = getCookie("token");

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
      subTypeId: 0,
      type: ticketTypeData ? ticketTypeData.type : "",
      subType: ticketTypeData ? ticketTypeData.subType : "",
      uId: 1,

      //approvalRequired:  ticketTypeData ? ticketTypeData.subType : "",
    },
  });
  watch();
  const softwareData = [
    { label: "Software", value: "SW" },
    { label: "Hardware", value: "HW" },
  ];

  useEffect(() => {
    if (ticketTypeData) {
      setValue("type", ticketTypeData && ticketTypeData.type);
      setValue("subType", ticketTypeData && ticketTypeData.subType);
    } else {
      reset();
    }
  }, [ticketTypeData, modal]);
  useEffect(() => {
    if (!modal) {
      reset();
    }
  }, [modal, reset]);

  const onSubmit = handleSubmit((data) => {
    if (ticketTypeData) {
      data.subTypeId = ticketTypeData.subTypeId;
      dispatch(createTicketType({ ...data, rowsPerPage, currentPage, setCurrentPage, token: token }));
    } else {
      dispatch(createTicketType({ ...data, rowsPerPage, currentPage, setCurrentPage, token: token }));
    }

    reset();
    closeModal();
  });

  return (
    <Modal
      isOpen={modal}
      toggle={() => {
        closeModal(false);
        reset();
      }}
      className="modal-dialog-centered"
      size="md"
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
          <h5 className="title">{title}</h5>
          <div className="mt-4">
            <Form noValidate method="POST" className="row gy-4" onSubmit={onSubmit}>
              <Col md="6">
                <div className="form-group">
                  <label className="form-label">Type</label>
                  <span className="allLabels">*</span>
                  <RSelect
                    {...register("type", { required: "Type is required" })}
                    options={softwareData}
                    value={softwareData.find((option) => option.value === getValues("type"))}
                    onChange={(value) => {
                      setValue("type", value.value, { shouldTouch: true, shouldValidate: true });
                    }}
                  />

                  {errors.type && <span className="error-message">{errors.type.message}</span>}
                </div>
              </Col>
              <Col md="6">
                <div className="form-group">
                  <label className="form-label">SubType</label>
                  <span className="allLabels">*</span>
                  <input
                    type="text"
                    {...register("subType", {
                      required: "SubType is required",
                      maxLength: {
                        value: 20,
                        message: "Max length exceeded",
                      },

                      pattern: {
                        value: /^[a-zA-Z0-9_ ]*$/,
                        message: "SubType is required",
                      },
                    })}
                    placeholder="Enter SubType"
                    name="subType"
                    maxlength="20"
                    id="subType"
                    onChange={(e) =>
                      setValue("subType", e.target.value.trimStart(), { shouldValidate: true, shouldTouch: true })
                    }
                    className="form-control"
                    value={getValues("subType")}
                  />
                  {errors.subType && <span className="invalid">{errors.subType.message}</span>}
                </div>
              </Col>

              {/* <Col sm="6">
                <div className="custom-control custom-checkbox">
                  <input
                    type="checkbox"
                    {...register("approvalRequired", {
                     required: "  Enable Approval Cycle is required",
                    })}
                    defaultChecked
                    className="custom-control-input"
                    id="customCheck1"
                  />

                  <Label className="custom-control-label" htmlFor={"customCheck1"}>
                  
                    Approval Cycle
                  </Label>
                  <span className="allLabels">*</span>
                  {errors.enableApprovalCycle && <span className="invalid">{errors.enableApprovalCycle.message}</span>}
                </div>
              </Col> */}

              <Col size="12">
                <ul className="align-center flex-wrap flex-sm-nowrap gx-4 gy-2">
                  <li>
                    <Button color="primary" size="md" type="submit">
                      {title}
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

export default TicketTypeModal;
