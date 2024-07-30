import React from "react";
import styled from "styled-components";
export default function ErrorModal({ handleModal, modalText }) {
  return (
    <>
      <Container></Container>
      <Wrapper>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="6em"
          height="6em"
          viewBox="0 0 12 12"
        >
          <path
            fill="#ff0000"
            d="M5.25 8.25a.75.75 0 1 1 1.5 0a.75.75 0 0 1-1.5 0m.258-4.84a.5.5 0 0 1 .984 0l.008.09V6l-.008.09a.5.5 0 0 1-.984 0L5.5 6V3.5zM11 6A5 5 0 1 1 1 6a5 5 0 0 1 10 0m-1 0a4 4 0 1 0-8 0a4 4 0 0 0 8 0"
          ></path>
        </svg>
        <div>{modalText}</div>
        <Cross
          onClick={() => {
            handleModal();
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="2em"
            height="2em"
            viewBox="0 0 16 16"
          >
            <path
              fill="none"
              stroke="#e3e3e3"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="m11.25 4.75l-6.5 6.5m0-6.5l6.5 6.5"
            ></path>
          </svg>
        </Cross>
      </Wrapper>
    </>
  );
}

const Container = styled.div`
  position: absolute;
  transform: translate(-50%, -50%);
  top: 50%;
  left: 50%;
  width: 100%;
  background-color: black;
  opacity: 0.5;
  z-index: 10;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Wrapper = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 400px;
  border-radius: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  z-index: 12;
  background: #181e29;
  height: 300px;

  div {
    margin-top: 20px;
    color: rgba(240, 248, 255, 0.915);
    font-size: 20px;
  }
`;

const Cross = styled.div`
  position: absolute;
  top: -8px;
  right: 15px;
  cursor: pointer;
`;
