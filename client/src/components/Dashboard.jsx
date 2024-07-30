import React, { useContext, useEffect } from "react";
import styled from "styled-components";
import Header from "./Header";
import History from "./History";
import Main from "./Main";

export default function Dashboard() {

  return (
    <>
      <Container className="container-fluid">
        <Header />
        <Main />
        <History />
      </Container>
    </>
  );
}

const Container = styled.div`
  height: 100vh;
  width: 100%;
  position: relative;
  display: flex;
  flex-direction: column;
`;
