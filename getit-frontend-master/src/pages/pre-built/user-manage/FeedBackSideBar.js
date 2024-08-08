// import { Button } from "bootstrap";
import { useDispatch } from "react-redux";
import React, { useEffect, useState, useRef } from "react";
import { createFeedBack, fetchAllTicketRecord, ticketTypeData } from "../../../reducers/ticketRequest.reducer";
import "./HomePage.css";
import { useForm } from "react-hook-form";
import Slider from "react-slick";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.min.js";
import { APIKEY, AccessControlOrigin, AgentName, ApiUrl } from "../../../utils/Constant";
import axios from "axios";
import ReviewImg from "../../../images/review.png";
import TicketLists from "./TicketLists";
import { useNavigate } from "react-router-dom";
import { Icon } from "../../../components/Component";
const FeedBackSidebar = ({
  data,
  modal,
  columns,
  pagination,
  className,
  value,
  handleSearch,
  menuURL,
  typeValue,
  typeSearch,
  totalRecords,
  rowsPerPage,
  setRowsPerPage,
  currentPage,
  isDropdownOpen,
  setIsDropdownOpen,
  setSelectedStatus,
  selectedStatus,
  handleStatusChange,
  statusBtn,
  setStatusBtn,
  toggleDropdown,
  setCurrentPage,
  newSearchValue,
  menuData,
}) => {
  const dispatch = useDispatch();
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
  useEffect(() => {
    if (ticketTypeData) {
      setValue("feedBackId", ticketTypeData.feedBackId);
      setValue("description", ticketTypeData.description);
    } else {
      reset();
    }
  }, [ticketTypeData, modal]);
  const [slideIndex, setSlideIndex] = useState(0);
  function getCookie(name) {
    return document.cookie.match("(^|;)\\s*" + name + "\\s*=\\s*([^;]+)")?.pop() || null;
  }
  const token = getCookie("GetItToken");
  const [slidesToShow, setSlidesToShow] = useState(1);
  const [allFeedBack, setAllFeedBack] = useState([]);
  const sliderRef = useRef(null);
  const navigate = useNavigate();
  const getAllFeedBack = async () => {
    try {
      const commonHeaders = {
        Accept: "*/*",
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": AccessControlOrigin, // Assuming AccessControlOrigin is defined somewhere
        "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,PATCH,OPTIONS",
        "X-APIKEY": APIKEY, // Assuming APIKEY is defined somewhere
        AgentName: AgentName, // Assuming AgentName is defined somewhere
        Authorization: token,
      };

      const apiUrlPath = `${ApiUrl}/feedback/top`;
      const response = await axios.get(apiUrlPath, {
        headers: commonHeaders,
      });
      setAllFeedBack(response.data.response);
    } catch (error) {
      throw error; // This is assuming that error.response.responseData is not a valid property.
    }
  };
  useEffect(() => {
    handleFeedBack();
    getAllFeedBack(token);
    // console.log("allFeedBack",allFeedBack)
  }, []);

  useEffect(() => {
    if (sliderRef.current) {
      sliderRef.current.slickNext();
    }
  }, []);

  // const prevSlide = () => {
  //   if (sliderRef.current) {
  //     sliderRef.current.slickPrev();
  //   }
  // };

  // const nextSlide = () => {
  //   if (sliderRef.current) {
  //     sliderRef.current.slickNext();
  //   }
  // };

  const handleFeedBack = () => {
    getAllFeedBack(token);
  };

  const onSubmit = handleSubmit((data) => {
    if (ticketTypeData) {
      data.feedBackId = ticketTypeData.feedBackId;
      dispatch(createFeedBack({ ...data, rowsPerPage, currentPage, setCurrentPage, token: token, menuUrl: menuURL }));
    } else {
      dispatch(createFeedBack({ ...data, rowsPerPage, currentPage, setCurrentPage, token: token, menuUrl: menuURL }));
    }
    // getAllFeedBack(token);
    reset();
  });
  const [showFullDescription, setShowFullDescription] = useState(false);

  const renderSlides = () => {
    return allFeedBack?.map((slide) => {
      // console.log("slide", slide);

      const description = showFullDescription
        ? slide.description
        : slide.description.slice(0, 100) + (slide.description.length > 100 ? "..." : "");

      return (
        <div className="cart-p" key={slide.id}>
          <div id="keyfeatures" className="benefits animate__animated  animate__fadeInUp  animate__delay-0.5s">
            <div className="slide">
              <div className="carousel-image">
                 <p style={{textAlign:"right", fontSize:"12px"}}>{slide.createdBy} - <span>{slide.createdOn}</span></p>
                <p className="fs-6" >{description}</p>
               
                {slide.description.length > 100 && (
                  <span
                    style={{ color: "blue", cursor: "pointer", textDecoration: "underline" }}
                    className="show-more"
                    onClick={() => setShowFullDescription(!showFullDescription)}
                  >
                    {showFullDescription ? "Show less" : "Show more"}

                  </span>
                  
                )}
             {/* <span style={{marginLeft:"150px", marginTop:"10px",color:"LightGray"}}>{slide.createdBy}</span> */}
              </div>
              
            </div>
          </div>
         
        </div>
      );
    });
  };
  // useEffect(()=>{
  //   // console.log(document.querySelector(".slick-next").textContent,"ldfjadsfj")
  //   // document.querySelector(".slick-next").textContent = ""
  //   // document.querySelector(".slick-prev").textContent = ""
  // })
  const sliderSettings = {
    slidesToShow: slidesToShow,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2000,
    // arrow:true,
    nextArrow: <></>, // Remove Next arrow
    prevArrow: <></>, // Remove Previous arrow
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 4,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 3,
        },
      },
      {
        breakpoint: 426,
        settings: {
          slidesToShow: 2,
        },
      },
    ],
  };

  const handleFeedBackAll = () => {
    navigate("/feedback/list");

    // Rest of your code...
    dispatch(
      fetchAllTicketRecord({
        menuUrl: "/feedback/list",
        searchValue: "",
        length: "",
        start: "",
        draw: 0,
        token: getCookie("GetItToken"),
        status: "",
      })
    );
    // window.location.reload();
  };
  // console.log("dataRouterrr--->", menuData);
  return (
    <>
      <button
        type="button"
        className="btn sidebtn"
        data-bs-toggle="modal"
        data-bs-target="#rightModal"
        onClick={() => handleFeedBack()}
        title="Drop Your FeedBack"
        style={{zIndex:'1'}}
      >
        <div className="d-flex align-items-center">
          <div>
            <i className="fa-solid fa-chevron-left"></i>
          </div>
          <div style={{width: "88%"}}>GetIT Wall</div>
        </div>
      </button>

      <div
        className="modal fade right"
        id="rightModal"
        tabindex="-1"
        aria-labelledby="rightModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog ">
          <div className="modal-content">
            <div className="modal-header position-relative">
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
              <h5 className="modal-title position-absolute" id="rightModalLabel">
                GetIT Wall
              </h5>
            </div>
            <div className="modal-body">
              <div className="review-img">
                <img src={ReviewImg} className="img-fluid" alt="" />
              </div>
              <div className="slider-wrapper">
                <Slider {...sliderSettings} className="card-slider">
                  {renderSlides()}
                </Slider>
       
                <span
                  onClick={() => {
                    handleFeedBackAll();
                    document.getElementById("rightModal").classList.remove("show");
                  }}
                  style={{ color: "blue", cursor: "pointer", float: "right", marginRight: "50px" }}
                  data-bs-dismiss="modal"  // This line is added to close the modal
                >
                  View More
                </span>
              </div>
              <form className="animate__animated  animate__fadeInUp  animate__delay-0.5s" onSubmit={onSubmit}>
                <div className="row justify-content-center" style={{ backgroundColor: "#F6FAFE", paddingTop: "40px" }}>
                  <div className="col-lg-12 col-12">
                    <div className="form-group">
                      <label className="form-label">Feedback</label>
                      <span className="allLabels">*</span>
                      <textarea
                        type="text"
                        {...register("description", {
                          required: "description is required",
                          maxLength: {
                            value: 1000,
                            message: "Max 50 length exceeded",
                          },

                          pattern: {
                            // value: /^[a-zA-Z0-9_ ]*$/,
                            message: "description is required",
                          },
                        })}
                        placeholder="Enter Feedback"
                        name="Feedback"
                        maxlength="1000"
                        id="Feedback"
                        onChange={(e) =>
                          setValue("description", e.target.value.trimStart(), {
                            shouldValidate: true,
                            shouldTouch: true,
                          })
                        }
                        className="form-control"
                        value={getValues("description")}
                      />
                      {errors.description && <span className="invalid">{errors.description.message}</span>}
                    </div>
                  </div>
                  <button className="btn mt-4 animate__animated  animate__fadeInUp animate__delay-0.5s" type="submit">
                    Save
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default FeedBackSidebar;
