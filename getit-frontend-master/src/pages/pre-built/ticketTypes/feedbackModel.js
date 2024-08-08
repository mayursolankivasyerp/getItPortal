import React, { useContext, useEffect, useState } from "react";
import { Icon, Button, Col, RSelect } from "../../../components/Component";
import { Modal, ModalBody, ModalHeader, Form, Label } from "reactstrap";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { createFeedBack } from "../../../reducers/ticketType.reducer";
 

const feedback = ({
  menuData,
  title,
  modal,
  closeModal,
  ticketTypeData,
  rowsPerPage,
  currentPage,
  setCurrentPage,
  dynamicData,
  menuURL,
}) => {
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
      feedBackId: 0,
      description: ticketTypeData ? ticketTypeData.description : "",
       },
  });
  // watch();
  // const softwareData = [
  //   { label: "Software", value: "SW" },
  //   { label: "Hardware", value: "HW" },
  // ];

useEffect(() => {
  if (ticketTypeData) {
    setValue("feedBackId", ticketTypeData.feedBackId); // Assuming the correct property name is 'projectId'
    // setValue("type", ticketTypeData.type);
    setValue("description", ticketTypeData.description);
    // Set other form fields as needed
  } else {
    reset();
  }
}, [ticketTypeData, modal]);
  useEffect(() => {
    if(!modal) {
     
      reset();
    }
  }, [modal, reset]);
  
  const onSubmit = handleSubmit((data) => {
    // console.log(data,"dattttt")
    if (ticketTypeData) {
      data.feedBackId = ticketTypeData.feedBackId;
      dispatch(createFeedBack({ ...data, rowsPerPage, currentPage, setCurrentPage, token: token, menuUrl:menuURL }));
    } else {
      dispatch(createFeedBack({ ...data, rowsPerPage, currentPage, setCurrentPage, token: token, menuUrl:menuURL }));
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
          <h5 className="title">Add feedback</h5>
          <div className="mt-4">
            <Form noValidate method="POST" className="row gy-4" onSubmit={onSubmit}>
              {/* <Col md="6">
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
              </Col> */}
              <Col md="12">
                <div className="form-group">
                  <label className="form-label">Feedback</label>
                  <span className="allLabels">*</span>
                  <input
                    type="text"
                    {...register("description", {
                      required: "description is required",
                      maxLength: {
                        value: 50,
                        message: "Max 50 length exceeded",
                      },

                      pattern: {
                        value: /^[a-zA-Z0-9_ ]*$/,
                        message: "description is required",
                      },
                    })}
                    placeholder="Enter Feedback"
                    name="Feedback"
                    maxlength="50"
                    id="Feedback"
                    onChange={(e) =>
                      setValue("description", e.target.value.trimStart(), { shouldValidate: true, shouldTouch: true })
                    }
                    className="form-control"
                    value={getValues("description")}
                  />
                  {errors.description && <span className="invalid">{errors.description.message}</span>}
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
                      {/* {menuData.title} */}
                      Add Feedback 
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

export default feedback;