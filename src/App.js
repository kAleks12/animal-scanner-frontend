import React from "react";
import "./App.css";
import styled from "styled-components";
import {Route, Routes} from "react-router-dom";
import {Home} from "./components/home/Home";
import RequireAuth from "./components/auth/RequireAuth";
import {Login} from "./components/login/Login";
import {Register} from "./components/register/Register";
import {Confirmation} from "./components/register/Confirmation";
import {Activation} from "./components/register/Activation";
import {SetPassword} from "./components/password_reset/SetPassword";
import {ResetPassword} from "./components/password_reset/PasswordReset";
import {NewSubmission} from "./components/submission/NewSubmission";
import {EditSubmission} from "./components/submission/EditSubmission";

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
                    <Route path="/add-submission" element={<NewSubmission/>}></Route>
                    <Route path="/edit-submission" element={<EditSubmission/>}></Route>
                </Route>
                <Route path="/login" element={<Login/>}></Route>
                <Route path="/register" element={<Register/>}></Route>
                <Route path="/confirmation" element={<Confirmation/>}></Route>
                <Route path="/activation" element={<Activation/>}></Route>
                <Route path="/set-password" element={<SetPassword/>}></Route>
                <Route path="/reset-password" element={<ResetPassword/>}></Route>
            </Routes>
        </AppContainer>
    );
}

export default App;
