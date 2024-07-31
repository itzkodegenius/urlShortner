import axios from "axios";
import React, { useContext, useState } from "react";
import styled, { keyframes } from "styled-components";
import contextApi from "../contextApi/ContextApi";
import { Link, Navigate, useNavigate } from "react-router-dom";
import LoginModal from "./LoginModal";
import DotLoader from "./DotLoader";

const ShortenIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="1.5em"
    height="1.5em"
    viewBox="0 0 15 15"
  >
    <path
      fill="#F0F4FE"
      d="M8.293 2.293a1 1 0 0 1 1.414 0l4.5 4.5a1 1 0 0 1 0 1.414l-4.5 4.5a1 1 0 0 1-1.414-1.414L11 8.5H1.5a1 1 0 0 1 0-2H11L8.293 3.707a1 1 0 0 1 0-1.414"
    ></path>
  </svg>
);

export default function Main() {
  const { history, setHistory, setLoginModal, loginModal } =
    useContext(contextApi);
  const [url, setUrl] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loader, setLoader] = useState(false);
  const user = localStorage.getItem("user");

  const validateURL = (url) => {
    console.log("URL to validate:", url);
    try {
      new URL(url);
      console.log("Is URL valid?", true);
      return true;
    } catch (e) {
      console.log("Is URL valid?", false);
      return false;
    }
  };

  const generateShortURL = async () => {
    setLoader(true);
    if (!validateURL(url)) {
      setLoader(false);
      setErrorMessage("Invalid URL");
      const inputElement = document.getElementById("url-input");
      if (inputElement) {
        inputElement.classList.add("vibrate");
        setTimeout(() => inputElement.classList.remove("vibrate"), 500);
        setLoader(false);
      }
      return;
    }

    const user = JSON.parse(localStorage.getItem("user"))
    try {
      const res = await axios.post(
        "https://shortlypro.vercel.app/url/shortUrl",
        {
          redirectURL: url,
        },
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
          withCredentials: true,
        }
      );
      setHistory([...history, res.data.shortURL]);
      setErrorMessage("");
      setLoader(false);
    } catch (error) {
      console.log(error);
    }
  };

  const handleLoginModal = () => {
    setLoginModal(false);
  };

  return (
    <>
      {loginModal && <LoginModal handleLoginModal={handleLoginModal} />}
      <Content className="text-center">
        <h1 className="fw-bold heading">Shorten Your Loooong Links :)</h1>
        <p className="para">
          Shortly is an efficient and easy-to-use URL shortening service that
          streamlines your online experience.
        </p>
        <Input id="url-input" className="rounded rounded-pill">
          <input
            className="ms-3 rounded rounded-pill"
            placeholder="Enter the link here"
            type="text"
            onChange={(e) => {
              setUrl(e.target.value);
            }}
          />
          <button
            onClick={() => {
              if (localStorage.getItem("user")) {
                generateShortURL();
              } else {
                setLoginModal(true);
              }
            }}
            style={{ width: "160px", height: "56px" }}
            className="ms-2 rounded rounded-pill"
          >
            {loader ? (
              <DotLoader />
            ) : (
              <>
                <span className="shorten-text">Shorten Now!</span>
                <span className="shorten-icon">
                  <ShortenIcon />
                </span>
              </>
            )}
          </button>
        </Input>
        {errorMessage && <Error>{errorMessage}</Error>}
        {user ? null : (
          <>
            <p className="para mt-4">
              <Link to="/register" className="text-decoration-none">
                <span style={{ color: "#e32c8c" }} className="fw-normal">
                  Register now
                </span>{" "}
              </Link>
              to short URLs and access exclusive features.
            </p>
          </>
        )}
      </Content>
    </>
  );
}

const Content = styled.div`
  margin-top: 100px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
`;

const vibrate = keyframes`
  0% { transform: translateX(0); }
  25% { transform: translateX(-2px); }
  50% { transform: translateX(2px); }
  75% { transform: translateX(-2px); }
  100% { transform: translateX(0); }
`;

const Input = styled.div`
  width: 568px;
  display: flex;
  justify-items: start;
  align-items: center;
  border: 2.5px solid #313c57;
  padding: 5px 5px 5px 10px;
  position: relative; /* Added for vibration effect */
  &.vibrate {
    animation: ${vibrate} 0.5s linear;
  }

  @media screen and (max-width: 768px) {
    width: 410px;
  }

  input {
    background: transparent;
    outline: none;
    width: 367px;
    border: none;
    padding: 10px 10px;
    color: rgba(240, 248, 255, 0.615);
  }

  button {
    background-color: #144ee3;
    color: whitesmoke;
    border: none;
    outline: none;
    padding: 16px 25px;
    display: flex;
    align-items: center;
    justify-content: center;

    @media screen and (max-width: 768px) {
      font-size: 16px;
      padding: 0 15px;
      width: 72px !important;
    }
  }

  .shorten-text {
    @media screen and (max-width: 768px) {
      display: none;
    }
  }

  .shorten-icon {
    display: none;
    @media screen and (max-width: 768px) {
      display: block;
    }
  }
`;

const Error = styled.div`
  color: red;
  margin-top: 10px;
  font-weight: bold;
`;
