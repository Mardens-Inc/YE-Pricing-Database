import React from "react";
import {BrowserRouter, Route, Routes, useNavigate} from "react-router-dom";
import ReactDOM from "react-dom/client";
import $ from "jquery";
import {NextUIProvider} from "@nextui-org/react";

import "./assets/scss/index.scss";
import {applyTheme} from "./assets/components/ThemeSwitcher.tsx";
import Navigation from "./assets/components/Navigation.tsx";
import LoginPage from "./assets/pages/LoginPage.tsx";
import StoresPage from "./assets/pages/StoresPage.tsx";
import Stores from "./assets/ts/stores.ts";
import DepartmentsPage from "./assets/pages/DepartmentsPage.tsx";
import ProcessingPage from "./assets/pages/ProcessingPage.tsx";

applyTheme();

ReactDOM.createRoot($("#root")[0]!).render(
    <React.StrictMode>
        <BrowserRouter>
            <PageContent/>
        </BrowserRouter>
    </React.StrictMode>
);


function PageContent()
{
    const navigate = useNavigate();
    // const auth = new Authentication();
    // auth.loginWithTokenFromCookie().then(res =>
    // {
    //     console.log(`logged in`, res);
    //     if (window.location.pathname !== "/login" && !res)
    //     {
    //         navigate("/login");
    //     }
    // });
    if (!Stores.hasStores())
        Stores.init();
    return (
        <NextUIProvider navigate={navigate}>
            <Navigation/>
            <Routes>
                <Route>
                    <Route path="/" element={<LoginPage/>}/>
                    <Route path="/stores" element={<StoresPage/>}/>
                    <Route path="/stores/:store" element={<DepartmentsPage/>}/>
                    <Route path="/stores/:store/:department" element={<ProcessingPage/>}/>
                </Route>
            </Routes>
        </NextUIProvider>
    );
}

