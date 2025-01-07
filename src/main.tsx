import React, {useEffect} from "react";
import {BrowserRouter, Route, Routes, useLocation, useNavigate} from "react-router-dom";
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
import {cacheEmployees, Employee} from "./assets/ts/useEmployeeList.ts";
import FullListPage from "./assets/pages/FullListPage.tsx";
import {AlertModalProvider, useAlertModal} from "./assets/providers/AlertModalProvider.tsx";

applyTheme();

ReactDOM.createRoot($("#root")[0]!).render(
    <React.StrictMode>
        <BrowserRouter>
            <AlertModalProvider>
                <PageContent/>
            </AlertModalProvider>
        </BrowserRouter>
    </React.StrictMode>
);


function PageContent()
{
    cacheEmployees();
    const navigate = useNavigate();
    if (!Stores.hasStores())
        Stores.init();
    const [employee, setEmployee] = React.useState<Employee | null>(window.localStorage.getItem("employee") !== undefined ? JSON.parse(window.localStorage.getItem("employee")!) as Employee : null);

    const {alert} = useAlertModal();
    const {pathname} = useLocation();
    useEffect(() =>
    {
        window.scrollTo(0, 0);

        // ping the api
        fetch("https://inv.mardens.com/api/ping")
            .then(response =>
            {
                if (!response.ok)
                    throw new Error("System is Offline");
            })
            .catch(() =>
            {
                alert({
                    title: "System is Offline",
                    message: "The year end inventory system is currently offline, if you believe this is a mistake please email helpdesk at helpdesk@mardens.com",
                    type: "error",
                    actions: undefined
                });
            });
    }, [pathname]);

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

