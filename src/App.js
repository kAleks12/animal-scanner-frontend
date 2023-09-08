import React from "react";
import "./App.css";
import styled from "styled-components";
import {Route, Routes} from "react-router-dom";
import {Home} from "./components/home/home";
import RequireAuth from "./components/common/RequireAuth";
import {Login} from "./components/login/login";
import {Register} from "./components/register/register";

const AppContainer = styled.div`
  width: 100%;
  height: 100%;
`;

function App() {
    return (
        <AppContainer>
            <Routes>
                <Route element={<RequireAuth/>}>
                    <Route path={"/"} element={<Home/>}/>
                </Route>
                <Route path="/login" element={<Login/>}></Route>
                <Route path="/register" element={<Register/>}></Route>
            </Routes>
        </AppContainer>
    );
}

export default App;
