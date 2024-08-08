export const quickInsertMessages = [
  "Thanks for taking the time to share your thoughts.",
  "Please reach out if you have any more questions.",
  "Your issue solved.",
  "I appreciate your feedback.",
  "If you have any suggestions, we're all ears.",
  "I appreciate your feedback.",
  "We'll look into this issue.",
];

import React, { useState, useRef, useEffect } from "react";
import { useDispatch } from "react-redux";
import { DropdownMenu, DropdownToggle, UncontrolledDropdown, DropdownItem, Card, Form } from "reactstrap";
import { Button, Icon, TooltipComponent, UserAvatar } from "../../../components/Component";
import { messageData } from "../../app/messages/MessageData";
import { MetaItem, ReplyItem } from "../../app/messages/MessagePartials";
import { APIKEY, AccessControlOrigin, AgentName, ApiUrl } from "../../../utils/Constant";
import axios from "axios";
import { useForm } from "react-hook-form";
import { findUpper } from "../../../utils/Utils";
import { commentDetails, createComment } from "../../../reducers/comment.Request";
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

// import { createComment } from "../../path/to/commentSlice"; // Update the path accordingly

// import { commentDetails, createComment } from "../../../reducers/commentRequest.reducer";

const CommentBox = ({ userProfile, ticket, ticketId }) => {
  const dispatch = useDispatch();
  const [item, setItem] = useState([]);
  const [formTab, setFormTab] = useState("1");

  const [fileError, setFileError] = useState("");
  const [selectedFile, setSelectedFile] = useState({});
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [textInput, setTextInput] = useState("");
  const fileInputRef = useRef(null);
  const [insertMessage, setInsertMessage] = useState("");
  const [editorData, setEditorData] = useState(""); // Initial content

  const handleEditorChange = (e, editor) => {
    const editorData = editor.getData();
    // config.forcePasteAsPlainText = true;
    setEditorData(editorData);
      setValue("description", editorData, {
        shouldValidate: true,
        shouldTouch: true,

      })
      
    }
    const handlePaste = event => {
      // console.log(event.clipboardData.getData('text'));
    };
  
    useEffect(() => {
      const handlePasteAnywhere = event => {
        // console.log(event.clipboardData.getData('text'));
      };
  
      window.addEventListener('paste', handlePasteAnywhere);
  
      return () => {
        window.removeEventListener('paste', handlePasteAnywhere);
      };
    }, []);
  // function getCookie(name) {
  //   return document.cookie.match("(^|;)\\s*" + name + "\\s*=\\s*([^;]+)")?.pop() || null;
  // }
  // const token = getCookie("GetItToken");

  function getCookie(name) {
    return document.cookie.match("(^|;)\\s*" + name + "\\s*=\\s*([^;]+)")?.pop() || null;
  }
  let token = getCookie("GetItToken");

  const openFileInput = () => {
    fileInputRef.current.click();
  };

  const {
    register,
    handleSubmit,
    getValues,
    setValue,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      ticketId: ticketId,
      description: editorData,
      files: null,
    },
  });
   
  // Function to handle the quick insert dropdown click
  const handleQuickInsertClick = (message) => {
    setValue("description", getValues("description") + message); // Append the message to the description field
  };

  // Function to remove attach files
  const handleRemoveFileClick = (file) => {
    setSelectedFiles((prevSelectedFiles) => prevSelectedFiles.filter((selectedFile) => selectedFile !== file));
    // Check the number of files after removing one
    if (selectedFiles.length <= 6) {
      setFileError(""); // Clear the error message
    }
  };
  // Function to handle file selection
  const handleFileChange = (e) => {
    setFileError("");
    const files = e.target.files;
    const newSelectedFiles = Array.from(files);
    setSelectedFiles((prevSelectedFiles) => [...prevSelectedFiles, ...newSelectedFiles]);
    if (files) {
      let totalSize = 0;
      for (let i = 0; i < files.length; i++) {
        totalSize += files[i].size;
      }
      const maxSizePerFile = 10 * 1024 * 1024;
      const maxSizeTotal = 50 * 1024 * 1024;
      if (files.length > 5) {
        setFileError("You can only upload up to 5 files.");
        setValue("files", null);
        return;
      }
      if (totalSize > maxSizeTotal) {
        setFileError("Total file size should be up to 50MB");
        setValue("files", null);
        return;
      }
      for (let i = 0; i < files.length; i++) {
        if (files[i].size > maxSizePerFile) {
          setFileError(`File "${files[i].name}" exceeds 10MB limit`);
          setValue("files", null);
          return;
        }
      }
      setSelectedFile(files);
    } else {
      console.error("Invalid file object:", files);
    }
  };

  const onTextChange = (e) => {
    e.preventDefault();
    setTextInput(e.target.value);
  };

  const onFormSubmit = handleSubmit((data, e) => {
    e.preventDefault();
    setIsLoading(true);
    const formData = new FormData();
    for (let i = 0; i < selectedFile.length; i++) {
      formData.append(`files`, selectedFile[i]);
    }

    formData.append("ticketId", data?.ticketId);
    formData.append("description", data?.description);

    // debugger;
    try {
      dispatch(
        createComment({
          formData,
          token: token,
          setItem,
          ticketId,
          dispatch,
        })
      );

      reset();
      setSelectedFile({});
      setSelectedFiles([]);
    } catch (error) {
      console.error("Error submitting data:", error);
      setIsLoading(false);
    } finally {
      setIsLoading(false);
    }
  });
  useEffect(() => {
    dispatch(commentDetails({ ticketId, token, setItem }));
  }, [editorData]);

  const renderAttachedFiles = () => {
    if (selectedFiles.length === 0) {
      return null;
    }

    return (
      <div className="attached-files">
        <ul className="attachedFilesBlock">
          {selectedFiles.map((file, index) => (
            <li className="attachedFiles" key={index}>
              {file.name}
              <Icon onClick={() => handleRemoveFileClick(file)} name="file-remove"></Icon>
            </li>
          ))}
        </ul>
      </div>
    );
  };

  return (
    <>
      <div className="nk-reply-form m-0">
        <div className="nk-reply-form-header">
          <ul className="nav nav-tabs-s2 nav-tabs nav-tabs-sm">
            <li className="nav-item">
              <a
                // className={`nav-link ${formTab === "1" ? "active" : ""}`}
                className={`nav-link active`}
                onClick={(ev) => {
                  ev.preventDefault();
                  setFormTab("1");
                }}
                href="#tab"
              >
                Reply
              </a>
            </li>
          </ul>
          <div className="nk-reply-form-title">
            <div className="title">Reply as:</div>
            <div className="user-avatar xs bg-purple">
              <span>{findUpper(userProfile?.name)}</span>
            </div>
          </div>
        </div>
        <div className="tab-content">
          {/* <div className={`tab-pane ${formTab === "1" ? "active" : ""}`}> */}
          <div className={`tab-pane active`}>
            <Form noValidate method="POST" className="row gy-4" onSubmit={onFormSubmit}>
              <div className="nk-reply-form-editor">
                <div className="nk-reply-form-field">
                  {/* <textarea
                   {...register("description", {
                    required: "Description is required",
                  })}
                  className="form-control form-control-simple no-resize"
                  placeholder="Reply"
                  // value={getValues("description")}
                  onChange={(e) =>
                    setValue("description", e.target.value.trimStart(), {
                      shouldValidate: true,
                      shouldTouch: true,
                    })
                  }
                  // onChange={(e) => onTextChange(e)}
                /> */}
                  <p>
                    <CKEditor editor={ClassicEditor}  onChange={(e,editor)=>handleEditorChange(e,editor)} onPaste={handlePaste}/>
                  </p>
                  {renderAttachedFiles()}
                </div>

                <div className="nk-reply-form-tools">
                  <ul className="nk-reply-form-actions g-1">
                    <li className="me-2">
                      <Button
                        color="primary"
                        type="submit"
                        disabled={Boolean(fileError) || isLoading}
                        //  onClick={(e) => onFormSubmit(e)}
                      >
                        Reply
                      </Button>
                    </li>
                    <li>
                      <UncontrolledDropdown>
                        <DropdownToggle tag="a" className="btn btn-icon btn-sm btn-tooltip">
                          <Icon name="hash"></Icon>
                        </DropdownToggle>
                        <DropdownMenu start className="dropdown-menu">
                          <ul className="link-list-opt no-bdr link-list-template">
                            <li className="opt-head">
                              <span>Quick Insert</span>
                            </li>
                            {quickInsertMessages.map((message, index) => (
                              <li key={index}>
                                <DropdownItem
                                  tag="a"
                                  href="#dropdown"
                                  onClick={(ev) => {
                                    ev.preventDefault();
                                    handleQuickInsertClick(message);
                                  }}
                                >
                                  <span>{message}</span>
                                </DropdownItem>
                              </li>
                            ))}
                            <li className="divider" />
                          </ul>
                        </DropdownMenu>
                      </UncontrolledDropdown>
                    </li>
                    <li style={{ cursor: "pointer" }}>
                      <span className="btn btn-icon btn-sm btn-tooltip commentUpload" onClick={openFileInput}>
                        <TooltipComponent
                          icon="clip-v"
                          direction="top"
                          text="Upload Attachment"
                          id="upload-tooltip"
                          type="file"
                        ></TooltipComponent>
                      </span>
                    </li>
                    <input
                      type="file"
                      {...register("files")}
                      multiple
                      ref={fileInputRef}
                      style={{ display: "none" }}
                      onChange={handleFileChange}
                    />
                    {fileError && <span className="error-message">{fileError}</span>}
                  </ul>
                </div>
                {/* .nk-reply-form-tools */}
              </div>
            </Form>
            {/* .nk-reply-form-editor */}
          </div>
          <div className={`tab-pane ${formTab === "2" ? "active" : ""}`}>
            <div className="nk-reply-form-editor">
              <div className="nk-reply-form-field">
                <textarea
                  className="form-control form-control-simple no-resize"
                  placeholder="Helloaaaa"
                  value={textInput}
                  onChange={(e) => onTextChange(e)}
                />
              </div>
              <div className="nk-reply-form-tools">
                <ul className="nk-reply-form-actions g-1">
                  <li className="me-2">
                    <Button color="primary" onClick={(e) => onFormSubmit(e, "note")} type="submit">
                      Add Note
                    </Button>
                  </li>
                  <li>
                    <a
                      className="btn btn-icon btn-sm"
                      title="Upload Attachment"
                      href="#copy"
                      onClick={(ev) => {
                        ev.preventDefault();
                      }}
                    >
                      <Icon name="clip-v"></Icon>
                    </a>
                  </li>
                </ul>
                {/* <UncontrolledDropdown>
                  <DropdownToggle tag="a" className="dropdown-toggle btn-trigger btn btn-icon me-n2">
                    <Icon name="more-v"></Icon>
                  </DropdownToggle>
                  <DropdownMenu end>
                    <ul className="link-list-opt no-bdr">
                      <li>
                        <DropdownItem
                          tag="a"
                          href="#dropdown"
                          onClick={(ev) => {
                            ev.preventDefault();
                          }}
                        >
                          <span>Another Option</span>
                        </DropdownItem>
                      </li>
                      <li>
                        <DropdownItem
                          tag="a"
                          href="#dropdown"
                          onClick={(ev) => {
                            ev.preventDefault();
                          }}
                        >
                          <span>More Option</span>
                        </DropdownItem>
                      </li>
                    </ul>
                  </DropdownMenu>
                </UncontrolledDropdown> */}
              </div>
              {/* {editorData} */}
              {/* .nk-reply-form-tools */}
            </div>
            {/* .nk-reply-form-editor */}
          </div>
        </div>
      </div>

      {item?.length > 0 &&
        item.map((replyItem) => {
          return (
            <ReplyItem userProfile={userProfile} ticket={ticket} item={replyItem} key={replyItem.commentId}></ReplyItem>
          );
        })}
      {/* <ReplyItem  item={item}/> */}
    </>
  );
};

export default CommentBox;
