import React, { useContext, useEffect, useState } from "react";
import styled from "styled-components";
import contextApi from "../contextApi/ContextApi";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

export default function Header() {
  const { token, setUser, setHistory } = useContext(contextApi);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const res = await axios.post(
        "http://localhost:8080/auth/logout",
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );

      if (res.status === 200) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        localStorage.removeItem("history");
        setUser({});
        navigate("/");
        setHistory([])
      }
    } catch (err) {
      console.log(err);
    }
  };


  const loginUser = JSON.parse(localStorage.getItem("user"))
  return (
    <>
      <Container className="w-100 d-flex align-items-center justify-content-between mx-4 mt-4">
        <Wrapper>
          <h1 className="web-name">Shortly</h1>
        </Wrapper>
        <Wrapper className="d-flex gap-4 align-items-center me-5">
          {loginUser && Object.keys(loginUser).length !== 0 ? (
            <>
              <h5 className="text-white text-center mt-3 me-3">Hi, {loginUser?.username}</h5>
              <button
                onClick={() => {
                  handleLogout();
                }}
                className="btn btn-outline-light rounded-pill px-3"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" style={{ textDecoration: "none" }}>
                <LoginButton className="py-2 d-flex align-items-center gap-2 rounded rounded-pill btn btn-transparent">
                  Login{" "}
                  <span>
                    <svg
                      width={18}
                      height={18}
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="rgba(237,238,239,1)"
                    >
                      <path d="M4 15H6V20H18V4H6V9H4V3C4 2.44772 4.44772 2 5 2H19C19.5523 2 20 2.44772 20 3V21C20 21.5523 19.5523 22 19 22H5C4.44772 22 4 21.5523 4 21V15ZM10 11V8L15 12L10 16V13H2V11H10Z"></path>
                    </svg>
                  </span>
                </LoginButton>
              </Link>
              <Link to="/register">
                <RegisterButton className="text-white rounded rounded-pill btn">
                  Register Now
                </RegisterButton>
              </Link>
            </>
          )}
        </Wrapper>
      </Container>
    </>
  );
}

const Container = styled.div`
  position: relative;
`;

const Wrapper = styled.div`
  position: relative;
  @media screen and (max-width: 768px) {
    gap: 0 !important;
  }
`;

const LoginButton = styled.button`
  padding-left: 25px;
  padding-right: 25px;
  border-color: #edeeef62;
  color: #edeeefb5;
  &:hover {
    border-color: #edeeef62;
    color: #edeeefb2;
  }
`;

const RegisterButton = styled.button`
  padding-left: 25px;
  padding-right: 25px;
  background-color: #144ee3;
  padding: 13px 25px;
  font-weight: 300;
  &:hover {
    background-color: #144ee3;
  }

  @media screen and (max-width: 768px) {
   display: none;
  }
`;
