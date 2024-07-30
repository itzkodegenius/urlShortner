import React from "react";
import styled from "styled-components";
export default function Modal({handleModal, modalText}) {
  return (
    <>
      <Container></Container>
      <Wrapper>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="6em"
          height="6em"
          viewBox="0 0 36 36"
        >
          <path
            fill="#04f000"
            d="M18 2a16 16 0 1 0 16 16A16 16 0 0 0 18 2m0 30a14 14 0 1 1 14-14a14 14 0 0 1-14 14"
            className="clr-i-outline clr-i-outline-path-1"
          ></path>
          <path
            fill="#04f000"
            d="M28 12.1a1 1 0 0 0-1.41 0l-11.1 11.05l-6-6A1 1 0 0 0 8 18.53L15.49 26L28 13.52a1 1 0 0 0 0-1.42"
            className="clr-i-outline clr-i-outline-path-2"
          ></path>
          <path fill="none" d="M0 0h36v36H0z"></path>
        </svg>
        <div>{modalText}</div>
        <Cross onClick={()=>{handleModal()}}>
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
  width: 350px;
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
