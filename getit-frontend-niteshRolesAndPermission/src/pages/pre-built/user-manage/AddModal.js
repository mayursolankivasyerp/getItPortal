import React, { useContext, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Modal, ModalBody, Form, Input } from "reactstrap";
import { Icon, Col, Button, RSelect } from "../../../components/Component";
import { useForm } from "react-hook-form";
import "../../../../src/style.css";
import Dropzone from "react-dropzone";
import { ticketType, getAllTicketType } from "../../../reducers/ticketType.reducer";
import { createTickets } from "../../../reducers/ticketRequest.reducer";

const TicketModule = ({
  title,
  modal,
  closeModal,
  setSelectedType,
  selectedType,
  ticketData,
  rowsPerPage,
  currentPage,
  setCurrentPage,
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
    trigger,
    formState: { errors },
  } = useForm({
    defaultValues: {
      ticketId: 0,
      title: ticketData ? ticketData.title : "",
      description: ticketData ? ticketData.description : "",
      priority: ticketData ? ticketData.priority : "",
      type: ticketData ? ticketData.type : "HW",
      // subType: ticketData ? ticketData.subType : "",
      subTypeId: ticketData ? ticketData.subTypeId : "",

      // reportingManager: ticketData ? ticketData.reportingManager : "Janam Soni",
      //   reportingManager: ticketData ? ticketData.reportingManager : "",
      status: ticketData ? ticketData.status : "Pending",

      files: ticketData ? ticketData.files : null,
    },
  });

  const [previewImage, setPreviewImage] = useState(null);
  const [fileError, setFileError] = useState("");
  watch();

  useEffect(() => {
    dispatch(getAllTicketType(token));
  }, []);

  const {
    ticketType: { ticketTypeList },
  } = useSelector((state) => state);
  useEffect(() => {
    if (modal && title === "Add Ticket") {
      setSelectedType("HW");
      setPreviewImage(null);
    }
  }, [modal, title]);

  useEffect(() => {
    if (ticketData) {
      setValue("title", ticketData && ticketData.title);
      setValue("description", ticketData && ticketData.description);
      setValue("priority", ticketData && ticketData.priority);
      setValue("type", ticketData && ticketData.type);
      setValue("subTypeId", ticketData && ticketData.subTypeId);
      setValue("reportingManager", ticketData && ticketData.reportingManager);
      if (ticketData?.status === "Cancel") {
        setValue("status", { label: "Cancel", value: "Cancel" });
      } else {
        setValue("status", ticketData?.status);
      }

      setValue("files", ticketData && ticketData.files);
      setPreviewImage(ticketData && ticketData.files);
    } else {
      reset();
    }
  }, [ticketData, modal]);
  useEffect(() => {
    if (!modal) {
      reset();
    }
  }, [modal, reset]);

  const priority = [
    { label: "Urgent", value: "Urgent" },
    { label: "High", value: "High" },
    { label: "Medium", value: "Medium" },
    { label: "Low", value: "Low" },
  ];

  const softwareData =
    ticketTypeList?.response?.SW?.length > 0
      ? ticketTypeList?.response?.SW.map((item) => ({
          label: item.sub_type,
          value: item.id,
        }))
      : [];
  const hardwareData =
    ticketTypeList?.response?.HW?.length > 0
      ? ticketTypeList?.response?.HW?.map((item) => ({
          label: item.sub_type,
          value: item.id,
        }))
      : [];
  const status = [
    { label: "Approve", value: "Approve" },
    { label: "Reject", value: "Reject" },
    { label: "Pending", value: "Pending" },
  ];

  const handleTypeChange = (e) => {
    const value = e.target.value;
    setSelectedType(value);
    setValue("type", value, { shouldTouch: true, shouldValidate: true });
    setValue("subTypeId", "");
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      const allowedExtensions = ["jpeg", "jpg", "png"];
      const extension = file.name.split(".").pop().toLowerCase();

      if (!allowedExtensions.includes(extension)) {
        setValue("files", null);
        setPreviewImage(null);
        setFileError("Invalid image extension");
        return;
      }

      const maxSize = 10 * 1024 * 1024;
      const size = file.size;

      if (size > maxSize) {
        setFileError("Image size should be up to 10MB");
        setValue("files", null);
        setPreviewImage(null);
        return;
      }

      setValue("files", file);
      setPreviewImage(URL.createObjectURL(file));
      setFileError("");
      const reader = new FileReader();
      reader.onload = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      console.error("Invalid file object:", file);
    }
  };

  const onSubmit = handleSubmit((data) => {
    if (!data.subTypeId) {
      setError("subTypeId", {
        type: "manual",
        message: "SubTypeId is required",
      });
      return;
    }

    if (ticketData) {
      data.ticketId = ticketData.ticketId;
      dispatch(createTickets({ ...data, rowsPerPage, currentPage, setCurrentPage, token: token }));
    } else {
      const fileInput = document.getElementById("files").files[0];
      dispatch(createTickets({ ...data, files: fileInput, rowsPerPage, currentPage, setCurrentPage, token: token }));
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
      size="xl"
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
              <Col md="12">
                <div className="form-group">
                  <label className="form-label">
                    <div>
                      Title
                      <span className="allLabels">*</span>
                    </div>
                  </label>

                  <input
                    className="form-control"
                    type="text"
                    {...register("title", {
                      required: "Title is required",
                      pattern: {
                        value: /^[a-zA-Z0-9_ ]*$/,
                        message: "Title is required",
                      },
                    })}
                    name="title"
                    id="title"
                    maxlength="100"
                    onChange={(e) =>
                      setValue("title", e.target.value.trimStart(), { shouldValidate: true, shouldTouch: true })
                    }
                    placeholder="Enter Title"
                    value={getValues("title")}
                  />
                  {errors.title && <span className="invalid">{errors.title.message}</span>}
                </div>
              </Col>

              <Col md="12">
                <div className="form-group">
                  <label className="form-label">
                    <div>
                      Description
                      <span className="allLabels">*</span>
                    </div>
                  </label>
                  <div className="form-control-wrap">
                    <textarea
                      className="no-resize form-control"
                      {...register("description", {
                        required: "Description is required",
                      })}
                      type="textarea"
                      id="textarea"
                      placeholder="Enter description"
                      onChange={(e) =>
                        setValue("description", e.target.value.trimStart(), {
                          shouldValidate: true,
                          shouldTouch: true,
                        })
                      }
                      maxlength="150"
                      value={getValues("description")}
                    />
                    {errors.description && <span className="invalid">{errors.description.message}</span>}
                  </div>
                </div>
              </Col>
              <Col md="6">
                <div className="form-group">
                  <label className="form-label">
                    <div>
                      Priority
                      <span className="allLabels">*</span>
                    </div>
                  </label>
                  <div className="form-control-wrap">
                    <RSelect
                      {...register("priority", { required: "Priority is required" })}
                      options={priority}
                      value={priority.find((option) => option.value === getValues("priority"))}
                      onChange={(value) => {
                        setValue("priority", value.value, { shouldTouch: true, shouldValidate: true });
                      }}
                    />
                    {errors.priority && <span className="error-message">{errors.priority.message}</span>}
                  </div>
                </div>
              </Col>

              <Col md="6">
                <div className="form-group">
                  <label className="form-label">
                    <div>
                      Type
                      <span className="allLabels">*</span>
                    </div>
                  </label>
                  <div className="g-4 align-center flex-wrap">
                    <div className="g">
                      <div className="custom-control custom-control-sm custom-radio">
                        <input
                          type="radio"
                          {...register("type", { required: "Type is required" })}
                          className="custom-control-input"
                          value="SW"
                          checked={getValues("type") === "SW" || (!ticketData && selectedType === "SW")}
                          onChange={handleTypeChange}
                          id="customRadio7"
                        />
                        <label className="custom-control-label" htmlFor="customRadio7">
                          Software
                        </label>
                      </div>
                    </div>
                    <div className="g">
                      <div className="custom-control custom-control-sm custom-radio">
                        <input
                          type="radio"
                          {...register("type", { required: "Type is required" })}
                          className="custom-control-input"
                          value="HW"
                          checked={getValues("type") === "HW" || (!ticketData && selectedType === "HW")}
                          onChange={handleTypeChange}
                          id="customRadio8"
                        />

                        <label className="custom-control-label" htmlFor="customRadio8">
                          Hardware
                        </label>
                      </div>
                    </div>
                  </div>
                  {errors.type && <span className="error-message">{errors.type.message}</span>}
                </div>
              </Col>
              {getValues("type") === "SW" && (
                <Col md="6">
                  <div className="form-group">
                    <label className="form-label">
                      <div>
                        Software Type
                        <span className="allLabels">*</span>
                      </div>
                    </label>
                    <div className="form-control-wrap">
                      <RSelect
                        options={softwareData}
                        {...register("subTypeId", {
                          required: "Software Type is required",
                        })}
                        value={softwareData.find((option) => option.value === getValues("subTypeId"))}
                        onChange={(value) => {
                          setValue(`subTypeId`, value.value, { shouldTouch: true, shouldValidate: true });
                        }}
                        defaultValue={
                          ticketData
                            ? ticketTypeList?.response.SW.filter(
                                (softwareValue) => softwareValue.id == ticketData?.subTypeId
                              ).map((softwareValue) => {
                                return { value: softwareValue.id, label: softwareValue.sub_type };
                              })
                            : []
                        }
                      />

                      {errors.subTypeId && (
                        <span className="error-message">
                          {getValues("type") === "HW" ? "Hardware Type is required" : "Software Type is required"}
                        </span>
                      )}
                    </div>
                  </div>
                </Col>
              )}

              {getValues("type") === "HW" && (
                <Col md="6">
                  <div className="form-group">
                    <label className="form-label">
                      <div>
                        Hardware Type
                        <span className="allLabels">*</span>
                      </div>
                    </label>
                    <div className="form-control-wrap">
                      <RSelect
                        options={hardwareData}
                        {...register("subTypeId", {
                          required: "Hardware Type is required",
                        })}
                        onChange={(value) => {
                          setValue(`subTypeId`, value.value, { shouldTouch: true, shouldValidate: true });
                        }}
                        defaultValue={
                          ticketData
                            ? ticketTypeList?.response.HW.filter(
                                (hardwareValue) => hardwareValue.id == ticketData?.subTypeId
                              ).map((hardwareValue) => {
                                return { value: hardwareValue.id, label: hardwareValue.sub_type };
                              })
                            : []
                        }
                      />

                      {errors.subTypeId && (
                        <span className="error-message">
                          {getValues("type") === "HW" ? "Hardware Type is required" : "Software Type is required"}
                        </span>
                      )}
                    </div>
                  </div>
                </Col>
              )}
              {/* {ticketData && (
                <Col md="6">
                  <div className="form-group">
                    <label className="form-label">
                      <div>
                        Reporting Manager
                        <span className="allLabels">*</span>
                      </div>
                    </label>
                    <input
                      className="form-control"
                      disabled={true}
                      type="text"
                      {...register("reportingManager", { required: "Reporting Manager is required" })}
                      value={getValues("reportingManager")}
                      onChange={(e) =>
                        setValue("reportingManager", e.target.value.trimStart(), {
                          shouldValidate: true,
                          shouldTouch: true,
                        })
                      }
                      placeholder="Reporting Manager"
                    />
                    {errors.reportingManager && <span className="invalid">{errors.reportingManager.message}</span>}
                  </div>
                </Col>
              )} */}

              <Col md="6" className="d-none">
                <div className="form-group">
                  <label className="form-label">
                    <div>
                      Status
                      <span className="allLabels">*</span>
                    </div>
                  </label>
                  <div className="form-control-wrap">
                    <RSelect
                      options={status}
                      {...register("status", { required: "Status is required" })}
                      value={
                        status.find((option) => option.value === getValues("status")) ||
                        (ticketData?.status === "Cancel" ? { label: "Cancel", value: "Cancel" } : null)
                      }
                      onChange={(value) => {
                        setValue("status", value.value, { shouldTouch: true, shouldValidate: false });
                      }}
                    />
                    {errors.status && <span className="error-message">{errors.status.message}</span>}
                  </div>
                </div>
              </Col>

              <Col md="6">
                <label className="form-label">Attachment</label>

                <Input
                  type="file"
                  {...register("files")}
                  name="files"
                  id="files"
                  accept=".png,.jpg,.jpeg"
                  onChange={handleFileChange}
                />
                {fileError && <span className="error-message">{fileError}</span>}
              </Col>

              {previewImage && (
                <Col md="6">
                  <img src={previewImage} alt="Image" className="formImageUpload" />
                </Col>
              )}

              <Col size="12">
                <ul className="align-center flex-wrap flex-sm-nowrap gx-4 gy-2">
                  <li>
                    <Button color="primary" size="md" type="submit">
                      {title}
                    </Button>
                  </li>
                  <li>
                    <a
                      href="#cancel"
                      onClick={(ev) => {
                        ev.preventDefault();
                        closeModal();
                        reset();
                      }}
                      className="link link-light"
                    >
                      Cancel
                    </a>
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
export default TicketModule;
