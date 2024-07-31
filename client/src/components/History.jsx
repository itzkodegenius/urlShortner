import React, { useContext, useEffect, useState } from "react";
import contextApi from "../contextApi/ContextApi";
import { dummyData } from "../lib/DummyData";
import Loading from "./Loading";
import ErrorModal from "./ErrorModal";
import { Link } from "react-router-dom";
import axios from "axios";
import MobileView from "./MobileView";

export default function History() {
  const { history, setHistory, token, loginModal } = useContext(contextApi);
  const [loading, setLoading] = useState(false);
  const [modal, setModal] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  const fetchHistory = async () => {
    try {
      const res = await axios.get("https://shortlypro.vercel.app/auth/urls", {
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
      const res = await axios.delete(
        `https://shortlypro.vercel.app/auth/delete/${shortId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );
      console.log("Url deleted Successfully", res);
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

  const handleCopy = (text) => {
    const tempInput = document.createElement("input");
    tempInput.value = text;
    document.body.appendChild(tempInput);
    tempInput.select();
    document.execCommand("copy");
    document.body.removeChild(tempInput);
    alert("Text copied: " + text);
  };

  const handleRedirectToOrignalUrl = async (shortId) => {
    window.open(`http://localhost:8080/url/${shortId}`, "_blank");

    await fetchHistory();
  };

  const handleModal = () => {
    setModal(false);
  };
  const user = localStorage.getItem("user");

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);
  return (
    <>
      {loading && <Loading />}
      {modal && (
        <ErrorModal
          modalText="Something wrong please try again"
          handleModal={handleModal}
        />
      )}

      {isMobile ? (
        <MobileView />
      ) : history && history.length > 0 ? (
        <div className="table-wrapper mt-3">
          <table className="table">
            <thead>
              <tr>
                <th className="table-header " scope="col">
                  Short Link
                </th>
                <th className="table-header" scope="col">
                  Original Link
                </th>
                <th className="table-header" scope="col">
                  QR Code
                </th>
                <th className="table-header" scope="col">
                  Clicks
                </th>
                <th
                  className="table-header ps-5"
                  style={{ width: "165px" }}
                  scope="col"
                >
                  Date
                </th>
                <th className="table-header" scope="col">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {history.map((item, index) => {
                const faviconUrl = getFaviconUrl(item.redirectURL);
                return (
                  <tr key={index}>
                    <td
                      className="table-row"
                      scope="row"
                      style={{ cursor: "pointer" }}
                    >
                      {`http://shortly.com/${item.shortId}`}
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="1.5em"
                        height="1.5em"
                        viewBox="0 0 24 24"
                        className="ms-3"
                        style={{cursor : 'pointer'}}
                        onClick={() => handleCopy(`http://shortly.com/${item.shortId}`)}
                      >
                        <g
                          fill="none"
                          stroke="#F0F4FE"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                        >
                          <path d="M18.327 7.286h-8.044a1.932 1.932 0 0 0-1.925 1.938v10.088c0 1.07.862 1.938 1.925 1.938h8.044a1.932 1.932 0 0 0 1.925-1.938V9.224c0-1.07-.862-1.938-1.925-1.938"></path>
                          <path d="M15.642 7.286V4.688c0-.514-.203-1.007-.564-1.37a1.918 1.918 0 0 0-1.361-.568H5.673c-.51 0-1 .204-1.36.568a1.945 1.945 0 0 0-.565 1.37v10.088c0 .514.203 1.007.564 1.37c.361.364.85.568 1.361.568h2.685"></path>
                        </g>
                      </svg>
                    </td>

                    <td className="table-row">
                      {faviconUrl && (
                        <img
                          src={faviconUrl}
                          alt="favicon"
                          style={{
                            marginRight: "10px",
                            width: "25px",
                            height: "25px",
                          }}
                        />
                      )}
                      {truncateText(item.redirectURL, 50)}
                    </td>
                    <td className="table-row">
                      {item.qrCodeURL && (
                        <img
                          width={40}
                          className="ms-3"
                          src={item.qrCodeURL}
                          alt="QR Code"
                        />
                      )}
                    </td>
                    <td className="table-row">
                      {Array.isArray(item.visitHistory)
                        ? item.visitHistory.length
                        : 0}
                    </td>
                    <td className="table-row" style={{ marginRight: "0px" }}>
                      {item.createdAt ? item.createdAt.split("T")[0] : "N/A"}
                    </td>
                    <td
                      onClick={() => {
                        handleDeleteUrl(item.shortId);
                      }}
                      className="table-row"
                      style={{ marginRight: "0px", cursor: "pointer" }}
                    >
                      <div
                        style={{ width: "40px", height: "40px" }}
                        className=" rounded-5 d-flex justify-content-center align-items-center"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="1.5em"
                          height="1.5em"
                          viewBox="0 0 24 24"
                        >
                          <g fill="none" fillRule="evenodd">
                            <path d="M24 0v24H0V0zM12.594 23.258l-.012.002l-.071.035l-.02.004l-.014-.004l-.071-.036q-.016-.004-.024.006l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427q-.004-.016-.016-.018m.264-.113l-.014.002l-.184.093l-.01.01l-.003.011l.018.43l.005.012l.008.008l.201.092q.019.005.029-.008l.004-.014l-.034-.614q-.005-.018-.02-.022m-.715.002a.02.02 0 0 0-.027.006l-.006.014l-.034.614q.001.018.017.024l.015-.002l.201-.093l.01-.008l.003-.011l.018-.43l-.003-.012l-.01-.01z"></path>
                            <path
                              fill="currentColor"
                              d="M14.28 2a2 2 0 0 1 1.897 1.368L16.72 5H20a1 1 0 1 1 0 2h-1v12a3 3 0 0 1-3 3H8a3 3 0 0 1-3-3V7H4a1 1 0 0 1 0-2h3.28l.543-1.632A2 2 0 0 1 9.721 2zM17 7H7v12a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1zm-2.72-3H9.72l-.333 1h5.226z"
                            ></path>
                          </g>
                        </svg>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : user && history.length === 0 ? (
        <div className="table-wrapper mt-3">
          <table className="table">
            <thead>
              <tr>
                <th className="table-header" scope="col">
                  Short Link
                </th>
                <th className="table-header" scope="col">
                  Original Link
                </th>
                <th className="table-header" scope="col">
                  QR Code
                </th>
                <th className="table-header" scope="col">
                  Clicks
                </th>
                <th
                  className="table-header ps-5"
                  style={{ width: "165px" }}
                  scope="col"
                >
                  Date
                </th>
                <th className="table-header" scope="col">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              <tr className="pt-5">
                <td
                  className="table-row text-center fs-4"
                  scope="row"
                  colSpan="6"
                >
                  <div className="my-5 text-white">
                    Start by shortening your first URL <br /> to see your
                    history here. Get started now!
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      ) : (
        <div className="table-container">
          <div className="overlay-text">
            {loginModal !== true ? (
              <>
                {" "}
                <Link to="/register" style={{ color: "#1440B3" }}>
                  Register now
                </Link>{" "}
                <span>to enjoy unlimited history</span>{" "}
              </>
            ) : null}
          </div>
          <div className="table-wrapper table-blur">
            <table className="table">
              <thead>
                <tr>
                  <th className="table-header" scope="col">
                    Short Link
                  </th>
                  <th className="table-header" scope="col">
                    Original Link
                  </th>
                  <th className="table-header" scope="col">
                    QR Code
                  </th>
                  <th className="table-header" scope="col">
                    Clicks
                  </th>
                  <th
                    className="table-header ps-5"
                    style={{ width: "165px" }}
                    scope="col"
                  >
                    Date
                  </th>
                </tr>
              </thead>
              <tbody>
                {dummyData.map((item, index) => {
                  const faviconUrl = getFaviconUrl(item.redirectURL);
                  return (
                    <tr key={index}>
                      <td className="table-row" scope="row">
                        {item.shortId}
                      </td>
                      <td className="table-row">
                        {faviconUrl && (
                          <img
                            src={faviconUrl}
                            alt="favicon"
                            style={{
                              marginRight: "10px",
                              width: "25px",
                              height: "25px",
                            }}
                          />
                        )}
                        {truncateText(item.redirectURL, 50)}
                      </td>
                      <td className="table-row">
                        {item.qrCodeUrl && (
                          <img
                            width={40}
                            className="ms-3"
                            src={item.qrCodeUrl}
                            alt="QR Code"
                          />
                        )}
                      </td>
                      <td className="table-row">200</td>
                      <td className="table-row" style={{ marginRight: "0px" }}>
                        {item.createdAt ? item.createdAt.split("T")[0] : "N/A"}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </>
  );
}
