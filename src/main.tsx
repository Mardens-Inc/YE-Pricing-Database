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
import {Employee} from "./assets/ts/useEmployeeList.ts";
import FullListPage from "./assets/pages/FullListPage.tsx";

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
    if (!Stores.hasStores())
        Stores.init();
    const [employee, setEmployee] = React.useState<Employee | null>(window.localStorage.getItem("employee") !== undefined ? JSON.parse(window.localStorage.getItem("employee")!) as Employee : null);

    return (
        <NextUIProvider navigate={navigate}>
            <Navigation employee={employee}/>
            <Routes>
                <Route>
                    <Route path="/" element={<LoginPage onLogin={(_username, _password, _profile, employee) =>
                    {
                        setEmployee(employee);
                    }}/>}/>
                    <Route path="/stores" element={<StoresPage/>}/>
                    <Route path="/stores/:store" element={<DepartmentsPage/>}/>
                    <Route path="/stores/:store/:department" element={<ProcessingPage/>}/>
                    <Route path="/list" element={<FullListPage/>}/>
                </Route>
            </Routes>
        </NextUIProvider>
    );
}

