import React, { useContext, useEffect, useState } from "react";
import styled, { css } from "styled-components";
import axios from "axios";
import Modal from "./Modal";
import Loading from "./Loading";
import contextApi from "../contextApi/ContextApi";
import { Link, useNavigate } from "react-router-dom";
import ErrorModal from "./ErrorModal";
export default function Login() {
  const { setUser, handleLoginSuccess } = useContext(contextApi);
  const navigate = useNavigate();
  const [usernameFocus, setUsernameFocus] = useState(false);
  const [usernameValue, setUsernameValue] = useState("");
  const [passwordFocus, setPasswordFocus] = useState(false);
  const [passwordValue, setPasswordValue] = useState("");
  const [UsernameError, setUsernameError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [modalText, setModalText] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorModal, setErrorModal] = useState(false);

  const handleUsernameFocus = () => setUsernameFocus(true);
  const handleUsernameBlur = () => setUsernameFocus(usernameValue !== "");
  const handleUsernameChange = (e) => setUsernameValue(e.target.value);

  const handlePasswordFocus = () => setPasswordFocus(true);
  const handlePasswordBlur = () => setPasswordFocus(passwordValue !== "");
  const handlePasswordChange = (e) => setPasswordValue(e.target.value);

  const handleModal = async () => {
    setOpenModal(false);
    navigate("/");
  };

  const onSubmit = async (e) => {
    setLoading(true);
    try {
      setPasswordError("");
      setUsernameError("");
      e.preventDefault();
      const data = new FormData(e.target);
      const username = data.get("username");
      const password = data.get("password");

      const res = await axios.post(
        "https://shortlypro.vercel.app/auth/login",
        { username, password },
        { withCredentials: true }
      );
      if (res.status === 200) {
        setOpenModal(true);
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("user", JSON.stringify(res.data.user));
        setUser(res.data.user);
        handleLoginSuccess(); // Call the function to refresh history
        setModalText("Login successful");
        setLoading(false);
      }
    } catch (error) {
      if (error.response.status === 400) {
        if (error.response.data.user) {
          setUsernameError(error.response.data.user);
        }
        if (error.response.data.password) {
          setPasswordError(error.response.data.password);
        }
      }
      setErrorModal(true);
      setLoading(false);
    }
  };

  const handleErrorModal = () => {
    setErrorModal(false);
  };
  return (
    <>
      {loading && <Loading />}
      {openModal && <Modal handleModal={handleModal} modalText={modalText} />}
      {errorModal && (
        <ErrorModal
          handleModal={handleErrorModal}
          modalText="Something Wrong please try again"
        />
      )}
      <Container>
        <Wrapper>
          <h1>Welcome back</h1>
          <p>Sign up for your account</p>
          <Form onSubmit={onSubmit}>
            <InputWrapper>
              <Input
                type="text"
                id="username"
                required
                name="username"
                value={usernameValue}
                onFocus={handleUsernameFocus}
                onBlur={handleUsernameBlur}
                onChange={handleUsernameChange}
              />
              <Label
                htmlFor="username"
                isFocused={usernameFocus || usernameValue}
              >
                Username
              </Label>
            </InputWrapper>
            {UsernameError && <Error className="ms-2">{UsernameError}</Error>}
            <InputWrapper style={{ marginTop: "18px" }}>
              <Input
                type="password"
                name="password"
                id="password"
                required
                value={passwordValue}
                onFocus={handlePasswordFocus}
                onBlur={handlePasswordBlur}
                onChange={handlePasswordChange}
              />
              <Label
                htmlFor="password"
                isFocused={passwordFocus || passwordValue}
              >
                Password
              </Label>
            </InputWrapper>
            {passwordError && <Error className="ms-2">{passwordError}</Error>}
            <div>
              <RegisterButton
                type="submit"
                className="text-white rounded rounded-pill btn"
              >
                Login
              </RegisterButton>
              
              <RegisterLink>
                Didn't have an account? <a href="/register">Register Now</a>
              </RegisterLink>
            </div>
          </Form>
        </Wrapper>
      </Container>
    </>
  );
}

const Container = styled.div`
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #0e131e;
`;

const Wrapper = styled.div`
  width: 500px;
  border-radius: 10px;
  background: #181e29;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0 0 40px;
  @media only screen and (max-width: 767px) {
    width: 350px;
    justify-content: center;
  }

  h1 {
    color: aliceblue;
    font-family: "Poppins", sans-serif;
    margin-top: 80px;
    font-weight: 600;
    background-image: -webkit-radial-gradient(circle, #e32c8c 4%, #2f4fd8 90%);
    background-clip: text;
    -webkit-background-clip: text;
    text-fill-color: transparent;
    -webkit-text-fill-color: transparent;
    font-size: 40px;

    @media only screen and (max-width: 767px) {
      margin-top: 20px;
    }
  }

  p {
    color: rgba(240, 248, 255, 0.615);
  }
`;

const Form = styled.form`
  margin-top: 10px;
  position: relative;
  display: flex;
  flex-direction: column;
  width: 400px;
  padding: 10px 20px;
  @media only screen and (max-width: 767px) {
    width: 350px;
  }
`;

const InputWrapper = styled.div`
  position: relative;
  width: 100%;
  margin-top: 10px;
  /* margin-bottom: 25px; */
`;

const Input = styled.input`
  width: 100%;
  background: transparent;
  border: 2px solid rgba(240, 248, 255, 0.615);
  border-radius: 10px;
  padding: 10px 20px;
  color: rgba(240, 248, 255, 0.825);
  position: relative;
  z-index: 1;
  font-size: 16px;
  transition: border-color 0.3s ease, box-shadow 0.3s ease;
  &:focus {
    border-color: rgba(240, 248, 255, 0.825);
    box-shadow: 0 0 10px rgba(240, 248, 255, 0.2);
  }
`;

const Label = styled.label`
  position: absolute;
  top: 50%;
  left: 20px;
  transform: translateY(-50%);
  color: rgba(240, 248, 255, 0.615);
  pointer-events: none;
  transition: all 0.3s ease;
  padding: 0 5px;

  ${({ isFocused }) =>
    isFocused &&
    css`
      top: -10px;
      left: 15px;
      font-size: 12px;
      color: rgba(240, 248, 255, 0.825);
    `}
`;

const RegisterButton = styled.button`
  padding-left: 25px;
  padding-right: 25px;
  background-color: #144ee3;
  padding: 13px 25px;
  font-weight: 400;
  width: 100%;
  border-radius: 10px !important;
  letter-spacing: 1px;
  margin-top: 20px;
  margin-bottom: 10px;
  &:hover {
    background-color: #144ee3;
    color: #fff;
    transition: all 0.3s ease;
  }
`;

const RegisterLink = styled.div`
  margin-top: 10px;
  color: rgba(240, 248, 255, 0.615);
  text-align: center;
  a {
    color: rgba(240, 248, 255, 0.955);
    text-decoration: none;
    &:hover {
      text-decoration: underline;
    }
  }
`;

const Error = styled.div`
  color: red;
  font-size: 12px;
  margin-top: 5px;
`;
