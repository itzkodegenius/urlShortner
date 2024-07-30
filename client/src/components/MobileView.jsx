import React, { useContext, useEffect, useState } from "react";
import contextApi from "../contextApi/ContextApi";
import { dummyData } from "../lib/DummyData";
import Loading from "./Loading";
import ErrorModal from "./ErrorModal";
import { Link } from "react-router-dom";
import axios from "axios";

export default function MobileView() {
  const { history, setHistory, token, loginModal } = useContext(contextApi);
  const [loading, setLoading] = useState(false);
  const [modal, setModal] = useState(false);
  const [selected, setSelected] = useState(null);

  const toggle = (i) => {
    if (selected === i) {
      return setSelected(null);
    }
    setSelected(i);
  };

  const fetchHistory = async () => {
    try {
      const res = await axios.get("http://localhost:8080/auth/urls", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      });
      setHistory(res.data.url);
    } catch (error) {
      console.log("Server error", error);
    }
  };

  useEffect(() => {
    if (token) {
      fetchHistory();
    }
  }, [token, setHistory]);

  const getFaviconUrl = (url) => {
    if (!url || url.trim() === "") {
      return null;
    }
    try {
      const hostname = new URL(url).hostname;
      return `https://www.google.com/s2/favicons?domain=${hostname}`;
    } catch (error) {
      console.error("Invalid URL:", url, error);
      return null;
    }
  };

  const truncateText = (text, maxLength) => {
    if (!text || typeof text !== "string") {
      return "";
    }
    return text.length > maxLength
      ? text.substring(0, maxLength) + "..."
      : text;
  };

  const handleDeleteUrl = async (shortId) => {
    setLoading(true);
    const token = localStorage.getItem("token");
    try {
      await axios.delete(`http://localhost:8080/auth/delete/${shortId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      });
      console.log("Url deleted Successfully");
      setHistory((prevHistory) =>
        prevHistory.filter((item) => item.shortId !== shortId)
      );
      setLoading(false);
    } catch (error) {
      console.log("Error deleting Url", error);
      setLoading(false);
      setModal(true);
    }
  };

  const handleRedirectToOriginalUrl = async (shortId) => {
    window.open(`http://localhost:8080/url/${shortId}`, "_blank");
    await fetchHistory();
  };

  const handleModal = () => {
    setModal(false);
  };

  const user = localStorage.getItem("user");

  return (
    <>
      {loading && <Loading />}
      {modal && (
        <ErrorModal
          modalText="Something went wrong, please try again"
          handleModal={handleModal}
        />
      )}

      {history && history.length > 0 ? (
        <div className="mt-4 ms-3">
          <div className="wrapper rounded-4">
            <div className="card-heading p-4 rounded-3 fs-5 fw-semibold text-white">
              Shorten Links
            </div>
            <div className="overflow-container" style={{ maxHeight: "600px", overflowY: "auto" }}>
              {history.map((item, index) => {
                const faviconUrl = getFaviconUrl(item.redirectURL);
                return (
                  <div key={index} className="short-link-container">
                    <div className="short-link text-white">
                      <div>{`http://shortly.com/${item.shortId}`}</div>
                      {selected === index ? (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="1.5em"
                          height="1.5em"
                          viewBox="0 0 24 24"
                          onClick={() => {
                            toggle(index);
                          }}
                        >
                          <path
                            fill="#F0F4FE"
                            fillRule="evenodd"
                            d="m4 15l8-8l8 8l-2 2l-6-6l-6 6z"
                          ></path>
                        </svg>
                      ) : (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="2em"
                          height="2em"
                          viewBox="0 0 24 24"
                          onClick={() => {
                            toggle(index);
                          }}
                        >
                          <path
                            fill="#F0F4FE"
                            d="M7.41 8.58L12 13.17l4.59-4.59L18 10l-6 6l-6-6z"
                          ></path>
                        </svg>
                      )}
                    </div>
                    <div
                      className={
                        selected === index
                          ? "accordian-show ms-4 d-flex flex-column gap-3 mt-2 text-white"
                          : "accordian"
                      }
                    >
                      <div className="d-flex gap-3">
                        <div className="fw-semibold">Original link :</div>
                        <div>
                          <img
                            src={faviconUrl}
                            alt="favicon"
                            style={{
                              marginRight: "10px",
                              width: "25px",
                              height: "25px",
                            }}
                          />
                          {truncateText(item.redirectURL, 19)}
                        </div>
                      </div>
                      <div className="d-flex align-items-center mt-2">
                        <div>QR Code : </div>
                        <div>
                          {" "}
                          {item.qrCodeURL && (
                            <img
                              width={40}
                              className="ms-3"
                              src={item.qrCodeURL}
                              alt="QR Code"
                            />
                          )}
                        </div>
                      </div>
                      <div className="d-flex gap-2 mt-2">
                        <div className="fw-semibold">Clicks :</div>
                        <div className="text-white">
                          {Array.isArray(item.visitHistory)
                            ? item.visitHistory.length
                            : 0}
                        </div>
                      </div>
                      <div className="d-flex gap-2 mb-2 mt-2">
                        <div>Created At :</div>
                        <div>
                          {" "}
                          {item.createdAt ? item.createdAt.split("T")[0] : "N/A"}
                        </div>
                      </div>
                      <div className="d-flex align-items-center gap-3 mb-4 ">
                        <div>Actions :</div>
                        <button
                          className="btn btn-outline-danger"
                          onClick={() => handleDeleteUrl(item.shortId)}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      ) : user && history && history.length === 0 ? (
        <div className="mt-4 ms-3">
          <div className="wrapper rounded-4 pb-4">
            <div className="card-heading p-4 rounded-3 fs-5 fw-semibold text-white">
              Shorten Links
            </div>
            <div className="text-white text-center my-5 fs-5 mb-5">
              {" "}
              Start by shortening your first URL <br /> to see your history
              here. Get started now!{" "}
            </div>
          </div>
        </div>
      ) : (
        <div className="mt-4 ms-3 position-relative">
          <div className="overlay-text w-100 h-100" style={{ backgroundColor: 'rgba(0, 0, 0, 0.459)', backdropFilter: 'blur(10px)', paddingTop: "130px" }}>
            {loginModal !== true ? (
              <>
                <Link to="/register" style={{ color: "#1440B3" }}>
                  Register now
                </Link>{" "}
                <span>to enjoy unlimited history</span>
              </>
            ) : null}
          </div>
          <div className="wrapper rounded-4">
            <div className="card-heading p-4 rounded-3 fs-5 fw-semibold text-white">
              Shorten Links
            </div>
            <div className="overflow-container" style={{ maxHeight: "500px", overflowY: "auto" }}>
              {dummyData.map((item, index) => {
                const faviconUrl = getFaviconUrl(item.redirectURL);
                return (
                  <div key={index} className="short-link-container">
                    <div className="short-link text-white">
                      <div>{`http://shortly.com/${item.shortId}`}</div>
                      {selected === index ? (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="1.5em"
                          height="1.5em"
                          viewBox="0 0 24 24"
                          onClick={() => {
                            toggle(index);
                          }}
                        >
                          <path
                            fill="#F0F4FE"
                            fillRule="evenodd"
                            d="m4 15l8-8l8 8l-2 2l-6-6l-6 6z"
                          ></path>
                        </svg>
                      ) : (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="2em"
                          height="2em"
                          viewBox="0 0 24 24"
                          onClick={() => {
                            toggle(index);
                          }}
                        >
                          <path
                            fill="#F0F4FE"
                            d="M7.41 8.58L12 13.17l4.59-4.59L18 10l-6 6l-6-6z"
                          ></path>
                        </svg>
                      )}
                    </div>
                    <div
                      className={
                        selected === index
                          ? "accordian-show ms-4 d-flex flex-column gap-3 mt-2 text-white"
                          : "accordian"
                      }
                    >
                      <div className="d-flex gap-3">
                        <div className="fw-semibold">Original link :</div>
                        <div>
                          <img
                            src={faviconUrl}
                            alt="favicon"
                            style={{
                              marginRight: "10px",
                              width: "25px",
                              height: "25px",
                            }}
                          />
                          {truncateText(item.redirectURL, 19)}
                        </div>
                      </div>
                      <div className="d-flex align-items-center mt-2">
                        <div>QR Code : </div>
                        <div>
                          {" "}
                          {item.qrCodeURL && (
                            <img
                              width={40}
                              className="ms-3"
                              src={item.qrCodeURL}
                              alt="QR Code"
                            />
                          )}
                        </div>
                      </div>
                      <div className="d-flex gap-2 mt-2">
                        <div className="fw-semibold">Clicks :</div>
                        <div className="text-white">
                          {Array.isArray(item.visitHistory)
                            ? item.visitHistory.length
                            : 0}
                        </div>
                      </div>
                      <div className="d-flex gap-2 mb-2 mt-2">
                        <div>Created At :</div>
                        <div>
                          {" "}
                          {item.createdAt ? item.createdAt.split("T")[0] : "N/A"}
                        </div>
                      </div>
                      <div className="d-flex align-items-center gap-3 mb-4 ">
                        <div>Actions :</div>
                        <button
                          className="btn btn-outline-danger"
                          onClick={() => handleDeleteUrl(item.shortId)}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
