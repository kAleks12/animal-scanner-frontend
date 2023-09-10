import React from "react";
import "./App.css";
import styled from "styled-components";
import {Route, Routes} from "react-router-dom";
import {Home} from "./components/home/home";
import RequireAuth from "./components/common/RequireAuth";
import {Login} from "./components/login/login";
import {Register} from "./components/register/register";
import {Confirmation} from "./components/register/confirmation";
import {Activation} from "./components/register/activation";

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
                <Route path="/confirmation" element={<Confirmation/>}></Route>
                <Route path="/activation" element={<Activation/>}></Route>
            </Routes>
        </AppContainer>
    );
}

export default App;
