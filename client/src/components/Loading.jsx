import React from "react";
import styled from "styled-components";

export default function Loading() {
  return (
    <>
      <Container></Container>
      <Loader>
        <span class="loader"></span>
      </Loader>
    </>
  );
}

const Container = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 100%;
  height: 100%;
  background-color: #000000;
  opacity: 0.6;
  z-index: 10;
`;

const Loader = styled.div`
  z-index: 125;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`;
