import {Navbar, NavbarContent, NavbarItem} from "@nextui-org/navbar";
import ThemeSwitcher from "./ThemeSwitcher.tsx";
import {Avatar, Button, Dropdown, DropdownItem, DropdownMenu, DropdownSection, DropdownTrigger, Link} from "@nextui-org/react";
import MardensLogo from "./MardensLogo.tsx";
import Authentication from "../ts/authentication.ts";
import {useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";
import {Employee} from "../ts/useEmployeeList.ts";

export default function Navigation({employee}: { employee: Employee | null })
{

    const auth = new Authentication(false);
    const navigate = useNavigate();
    const [emp, setEmployee] = useState<Employee | null>(employee);
    const [isAdmin, setIsAdmin] = useState(false);

    if (!employee && window.location.pathname !== "/")
    {
        navigate("/");
    }


    auth.loginWithTokenFromCookie().then(res =>
    {
        if (!res && window.location.pathname !== "/")
        {
            navigate("/");
        }
        if (res && typeof res === "object")
        {
            try
            {
                setIsAdmin(auth.getUserProfile().admin);
                console.log(auth.getUserProfile());
            } catch
            {
                setIsAdmin(false);
            }
        }
    });


    useEffect(() =>
    {
        setEmployee(employee);
    }, [employee]);

    return (
        <Navbar maxWidth={"full"}>
            <NavbarContent justify="start" className={"max-w-40"}>
                <NavbarItem className={"font-bold"}>
                    <Link href="/"><MardensLogo height={"2rem"} color={"#f13848"}/></Link>
                </NavbarItem>
            </NavbarContent>
            {window.location.pathname !== "/" && emp &&
                <NavbarContent justify="end">
                    <Dropdown closeOnSelect={false}>
                        <DropdownTrigger>
                            <Button radius={"full"}>
                                <div className={"flex flex-row"}>
                                    <Avatar/>
                                    <div className={"flex flex-col text-start my-auto"}>
                                        <span className={"text-tiny capitalize"}>{emp?.first_name.toLowerCase()} {emp?.last_name.toLowerCase()}</span>
                                        <span className={"text-tiny text-default-400"}>{emp?.location}</span>
                                    </div>
                                </div>
                            </Button>

                        </DropdownTrigger>
                        <DropdownMenu>
                            {
                                (window.localStorage.getItem("store") && window.localStorage.getItem("department")) as any &&
                                <DropdownItem
                                    closeOnSelect={true}
                                    description={`Currently processing ${window.localStorage.getItem("department") ?? "not set"} in ${window.localStorage.getItem("store") ?? "not set"}`}
                                    onClick={() => navigate(`/stores/${window.localStorage.getItem("store")}/${window.localStorage.getItem("department")}`)}
                                >
                                    Goto Processing
                                </DropdownItem>
                            }
                            {
                                window.localStorage.getItem("store") as any &&

                                <DropdownItem
                                    closeOnSelect={true}
                                    hidden={window.localStorage.getItem("store") !== undefined}
                                    description={`Current department is ${window.localStorage.getItem("department") ?? "not set"}`}
                                    onClick={() => navigate(`/stores/${window.localStorage.getItem("store")}`)}
                                >
                                    Change Department
                                </DropdownItem>
                            }
                            <DropdownItem
                                closeOnSelect={true}
                                description={`Current store is ${window.localStorage.getItem("store") ?? "not set"}`}
                                onClick={() => navigate("/stores/")}
                            >
                                Change Store
                            </DropdownItem>
                            <DropdownItem closeOnSelect={false}>
                                <ThemeSwitcher/>
                            </DropdownItem>
                            {isAdmin &&
                                <DropdownSection title={"Admin zone"}>
                                    <DropdownItem
                                        closeOnSelect={true}
                                        description={"View the full list of items."}
                                        onClick={() => navigate("/list")}
                                    >
                                        View Full List
                                    </DropdownItem>
                                    <DropdownItem
                                        closeOnSelect={true}
                                        description={"View the full list of items."}
                                        onClick={() =>
                                        {
                                            const link = document.createElement("a");
                                            link.href = "https://yeinv.mardens.com/api/export";
                                            link.click();
                                            console.log("Exporting database");
                                        }}
                                    >
                                        Export List
                                    </DropdownItem>
                                </DropdownSection>
                            }

                            <DropdownSection title={"Danger zone"}>
                                <DropdownItem
                                    color={"danger"}
                                    className="text-danger"
                                    closeOnSelect={true}
                                    description={"Logout from the current session."}
                                    onClick={() =>
                                    {
                                        auth.logout();
                                        window.localStorage.removeItem("profile");
                                        window.localStorage.removeItem("employee");
                                        window.localStorage.removeItem("department");
                                        window.localStorage.removeItem("store");
                                        navigate("/");
                                    }}
                                >
                                    Logout
                                </DropdownItem>
                            </DropdownSection>
                        </DropdownMenu>
                    </Dropdown>
                </NavbarContent>
            }
        </Navbar>)
        ;
}
