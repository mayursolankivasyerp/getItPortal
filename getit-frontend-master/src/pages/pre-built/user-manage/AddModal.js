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
  menuURL,
  closeModal,
  setSelectedType,
  selectedType,
  selectedData,
  rowsPerPage,
  currentPage,
  setCurrentPage,
}) => {
  const dispatch = useDispatch();
  // const [token, setToken] = useState(getCookie("GetItToken"));
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
    trigger,
    formState: { errors },
  } = useForm({
    defaultValues: {
      ticketId: 0,
      title: selectedData ? selectedData.title : "",
      description: selectedData ? selectedData.description : "",
      priority: selectedData ? selectedData.priority : "",
      type: selectedData ? selectedData.type : "HW",
      // subType: selectedData ? selectedData.subType : "",
      subTypeId: selectedData ? selectedData.subTypeId : "",
      // reportingManager: selectedData ? selectedData.reportingManager : "Janam Soni",
      //   reportingManager: selectedData ? selectedData.reportingManager : "",
      status: selectedData ? selectedData.status : "Pending",

      files: selectedData ? selectedData.files : null,
    },
  });

  const [previewImage, setPreviewImage] = useState(null);
  const [message, setMessage] = useState("")
  const [selectedFile, setSelectedFile] = useState(null);
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
    if (selectedData) {
      setValue("title", selectedData && selectedData.title);
      setValue("description", selectedData && selectedData.description);
      setValue("priority", selectedData && selectedData.priority);
      setValue("type", selectedData && selectedData.type);
      setValue("subTypeId", selectedData && selectedData.subTypeId);
      setValue("reportingManager", selectedData && selectedData.reportingManager);
      if (selectedData?.status === "Cancel") {
        setValue("status", { label: "Cancel", value: "Cancel" });
      } else {
        setValue("status", selectedData?.status);
      }

      setValue("files", selectedData && selectedData.files);
      setPreviewImage(selectedData && selectedData.files);
    } else {
      reset();
    }
  }, [selectedData, modal]);
  useEffect(() => {
    if (!modal) {
      reset();
      setMessage("");
    }
  }, [modal, reset]);

  const priority = [
    { label: "Urgent", value: "Urgent" },
    { label: "High", value: "High" },
    { label: "Medium", value: "Medium" },
    { label: "Low", value: "Low" },
  ];

  const softwareData =
    ticketTypeList?.response?.sw?.length > 0
      ? ticketTypeList?.response?.sw.map((item) => ({
        label: item.subType,
        value: item.id,
        approvalRequired: item.approvalRequired
      }))
      : [];
  const hardwareData =
    ticketTypeList?.response?.hw?.length > 0
      ? ticketTypeList?.response?.hw?.map((item) => ({
        label: item.subType,
        value: item.id,
        approvalRequired: item.approvalRequired
      }))
      : [];
  // console.log(ticketTypeList,"ticketTypeList")
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
    setMessage("");
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
      //setFileError("");
      const reader = new FileReader();
      reader.onload = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      console.error("Invalid file object:", file);
    }
  };

  const handleClearFile = () => {
    setSelectedFile(null);
    setPreviewImage(null);
    // setFileError(null);
  };
  console.log("masssgeee------------>",message)
  const onSubmit = handleSubmit((data) => {
    if (!data.subTypeId) {
      setError("subTypeId", {
        type: "manual",
        message: "SubTypeId is required",
      });
      return;
    }

    if (selectedData) {
      data.ticketId = selectedData.ticketId;
      dispatch(createTickets({ ...data, menuUrl: menuURL, rowsPerPage, currentPage, setCurrentPage, token: token }));
    } else {
      const fileInput = document.getElementById("files").files[0];
      dispatch(createTickets({ ...data, files: fileInput, menuUrl: menuURL, rowsPerPage, currentPage, setCurrentPage, token: token }));
    }
    reset();
    setMessage("");
    closeModal();
  });

  return (
    <Modal
      isOpen={modal}
      toggle={() => {
        closeModal(false);
        reset();
        setMessage("");
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
                    // pattern: {
                    //   value: /^[a-zA-Z0-9_ ]*$/,
                    //   message: "Title is required",
                    // },    className="form-control"
                    type="text"
                    {...register("title", {
                      required: "Title is required",

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
                      // maxlength="150"
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
                          checked={getValues("type") === "SW" || (!selectedData && selectedType === "SW")}
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
                          checked={getValues("type") === "HW" || (!selectedData && selectedType === "HW")}
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
                          setMessage("");
                          setValue(`subTypeId`, value.value, { shouldTouch: true, shouldValidate: true });
                          // console.log(value,"valueee")
                          if (value.approvalRequired === 1) {
                            setMessage("Note:  Approval is necessary from L1, and after L2, the steps can be completed by yourself once the ticket is passed on to the getIt team!!");
                          } else {
                            setMessage("");
                          }
                        }}
                        defaultValue={
                          selectedData
                            ? ticketTypeList?.response.SW.filter(
                              (softwareValue) => softwareValue.id == selectedData?.subTypeId
                            ).map((softwareValue) => {
                              return { value: softwareValue.id, label: softwareValue.sub_type };
                            })
                            : []
                        }
                      />
                      {message && <p className="error-message">{message}</p>}
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
                          setMessage("");
                          setValue(`subTypeId`, value.value, { shouldTouch: true, shouldValidate: true });
                          if (value.approvalRequired === 1) {
                            setMessage("123455");
                          } else {
                            setMessage("");
                          }
                        }}
                        defaultValue={
                          selectedData
                            ? ticketTypeList?.response.HW.filter(
                              (hardwareValue) => hardwareValue.id == selectedData?.subTypeId
                            ).map((hardwareValue) => {
                              return { value: hardwareValue.id, label: hardwareValue.sub_type };
                            })
                            : []
                        }
                      />
                     {message && <p className="error-message">{message}</p>}
                      {errors.subTypeId && (
                        <span className="error-message">
                          {getValues("type") === "HW" ? "Hardware Type is required" : "Software Type is required"}
                        </span>
                      )}
                    </div>
                  </div>
                </Col>
              )}


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
                        (selectedData?.status === "Cancel" ? { label: "Cancel", value: "Cancel" } : null)
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
                {selectedFile && (
                  <span className="clear-icon" onClick={handleClearFile}>
                    &#x2715;
                  </span>
                )}
                {/* {fileError && <span className="error-message">{fileError}</span>} */}
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
                        setMessage("");
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


