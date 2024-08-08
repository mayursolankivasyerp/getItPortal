import React, { useContext, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Modal, ModalBody, Form, Input } from "reactstrap";
import { Icon, Col, Button, RSelect } from "../../../components/Component";
import { useForm } from "react-hook-form";
import "../../../../src/style.css";
import Dropzone from "react-dropzone";
import { ticketType, getAllTicketType, createDocuments } from "../../../reducers/ticketType.reducer";
import { createTickets } from "../../../reducers/ticketRequest.reducer";

const DocumentModel = ({
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
      documentId: 0,
      title: selectedData ? selectedData.title : "",
      type: selectedData ? selectedData.type : "",
      files: selectedData ? selectedData.fileUrlName : null,
      icon: selectedData ? selectedData.iconUrlName : null,
    },
  });

  const [previewImage, setPreviewImage] = useState(null);
  const [defaultFile, setDefaultFile] = useState(null);
  const [defaultIcon, setDefaultIcon] = useState(null);
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
      // setSelectedType("HW");
      setPreviewImage(null);
    }
  }, [modal, title]);

  useEffect(() => {
    if (selectedData) {
      console.log("selectedData===>>",selectedData)
      setValue("title", selectedData && selectedData.title);
      setValue("files", selectedData && selectedData.fileUrlName);
      setValue("icon", selectedData && selectedData.iconUrlName);
      setValue("type", selectedData && selectedData.type);
      setValue("documentId", selectedData && selectedData.documentId);
      setPreviewImage(selectedData && selectedData.files);
    } else {
      reset();
    }
  }, [selectedData, modal]);
  useEffect(() => {
    if (!modal) {
      reset();
    }
  }, [modal, reset]);

  const type = [
    { label: "SOP", value: "SOP" },
    { label: "DIY", value: "DIY" },
    { label: "Policy", value: "Policy" },
    { label: "Other", value: "Other" },
  ];


 
 
  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    setValue("files", selectedFile); // Assuming you're using React Hook Form's setValue
  };
  
  const handleClearFile = () => {
    setValue("files", null); // Clear the selected file
  };
  
  const handleIconChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      const allowedExtensions = ["jpeg", "jpg", "png"];
      const extension = file.name.split(".").pop().toLowerCase();

      if (!allowedExtensions.includes(extension)) {
        setValue("icon", null);
        setPreviewImage(null);
        setFileError("Invalid image extension");
        return;
      }

      const maxSize = 10 * 1024 * 1024;
      const size = file.size;

      if (size > maxSize) {
        setFileError("Image size should be up to 10MB");
        setValue("icon", null);
        setPreviewImage(null);
        return;
      }

      setValue("icon", file);
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
  
  const onSubmit = handleSubmit((data) => {
 
    if (selectedData) {
      data.documentId = selectedData.documentId;
      const fileInput = document.getElementById("files").files[0];
      const iconInput = document.getElementById("icon").files[0];
      dispatch(createDocuments({ ...data, menuUrl:menuURL,files: fileInput, icon:iconInput, rowsPerPage, currentPage, setCurrentPage, token: token}));
    } else {
      const fileInput = document.getElementById("files").files[0];
      const iconInput = document.getElementById("icon").files[0];
      dispatch(createDocuments({ ...data, files: fileInput, icon:iconInput, menuUrl:menuURL, rowsPerPage, currentPage, setCurrentPage, token: token }));
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
              <Col md="6">
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
                      // pattern: {
                      //   value: /^[a-zA-Z0-9_ ]*$/,
                      //   message: "Title is required",
                      // },
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

             
              <Col md="6">
                <div className="form-group">
                  <label className="form-label">
                    <div>
                      type
                      <span className="allLabels">*</span>
                    </div>
                  </label>
                  <div className="form-control-wrap">
                    <RSelect
                      {...register("type", { required: "type is required" })}
                      options={type}
                      value={type.find((option) => option.value === getValues("type"))}
                      onChange={(value) => {
                        setValue("type", value.value, { shouldTouch: true, shouldValidate: true });
                      }}
                    />
                    {errors.type && <span className="error-message">{errors.type.message}</span>}
                     

                  </div>
                </div>
              </Col>
                <Col md="6" className="d-none">
                <div className="form-group">
                  <label className="form-label">
                    <div>
                      Status
                      <span className="allLabels">*</span>
                    </div>
                  </label>
                  <div className="form-control-wrap">
                    {/* <RSelect
                      options={status}
                      {...register("status", { required: "Status is required" })}
                      value={
                        status.find((option) => option.value === getValues("status")) ||
                        (selectedData?.status === "Cancel" ? { label: "Cancel", value: "Cancel" } : null)
                      }
                      onChange={(value) => {
                        setValue("status", value.value, { shouldTouch: true, shouldValidate: false });
                      }}
                    /> */}
                    {errors.status && <span className="error-message">{errors.status.message}</span>}
                  </div>
                </div>
              </Col>

              <Col md="6">
                <label className="form-label">Attachment</label>
                <span className="allLabels">*</span>
                <Input
                  type="file"
                  {...register("files", {
                    required: "files is required",
                    pattern: {
                      // value: /^[a-zA-Z0-9_ ]*$/,
                      message: "files is required",
                    },
                  })}
                  name="files"
                  id="files"
                  accept=".pdf"
                  onChange={handleFileChange}
                />
                {selectedFile && (
                  <span className="clear-icon" onClick={handleClearFile}>
                    &#x2715;
                  </span>
                )}
                   {errors.files && <span className="error-message">{errors.files.message}</span>}
              </Col>
{/* 
              {previewImage && (
                <Col md="6">
                  <img src={previewImage} alt="Image" className="formImageUpload" />
                </Col>
              )} */}
                 <Col md="6">
                <label className="form-label">Icon</label>

                <Input
                  type="file"
                  {...register("icon")}
                  name="icon"
                  id="icon"
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


              {/* {previewImage && (
                <Col md="6">
                  <img src={previewImage} alt="Image" className="formImageUpload" />
                </Col>
              )} */}
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
export default DocumentModel;



