import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import {BrowserRouter, Route, Routes} from "react-router-dom";

import {Provider as StyletronProvider} from "styletron-react";
import {Client as Styletron} from "styletron-engine-atomic";

import {
    BaseProvider,
    styled,
    DarkTheme,
} from "baseui";
import {AuthProvider} from "./context/AuthProvider";

const engine = new Styletron();

const Centered = styled("div", {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100%",
    width: "100%",
});

const root = ReactDOM.createRoot(
    document.getElementById("root")
);

root.render(
    <React.StrictMode>
        <StyletronProvider value={engine}>
            <BaseProvider
                theme={DarkTheme}
                overrides={{
                    AppContainer: {style: {width: "100%", height: "100%"}},
                }}
            >
                <Centered>
                    <BrowserRouter>
                        <AuthProvider>
                            <Routes>
                                <Route path="/*" element={<App/>}/>
                            </Routes>
                        </AuthProvider>
                    </BrowserRouter>
                </Centered>
            </BaseProvider>
        </StyletronProvider>
    </React.StrictMode>
);