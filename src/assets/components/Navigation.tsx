import {Navbar, NavbarContent, NavbarItem} from "@nextui-org/navbar";
import ThemeSwitcher from "./ThemeSwitcher.tsx";
import {Avatar, Button, Dropdown, DropdownItem, DropdownMenu, DropdownSection, DropdownTrigger, Link, useDisclosure} from "@nextui-org/react";
import MardensLogo from "./MardensLogo.tsx";
import Authentication from "../ts/authentication.ts";
import {useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";
import {Employee} from "../ts/useEmployeeList.ts";
import ConfirmModal from "./ConfirmModal.tsx";
import Records from "../ts/records.ts";

export default function Navigation({employee}: { employee: Employee | null })
{

    const auth = new Authentication(false);
    const navigate = useNavigate();
    const [emp, setEmployee] = useState<Employee | null>(employee);
    const [isAdmin, setIsAdmin] = useState(false);

    const {onOpenChange, isOpen, onOpen} = useDisclosure();

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
        <>
            <ConfirmModal
                title={"Delete Database"}
                message={"Are you sure you want to delete all the contents of the database, this can NOT be undone?"}
                onClose={async value =>
                {
                    if (value)
                    {
                        await Records.truncate();
                        console.log("database truncated!");
                        window.location.reload();
                    }
                }}
                isOpen={isOpen} onOpenChange={onOpenChange}
            />
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
                                            description={"Export the full list of items to a CSV file."}
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
                                    {isAdmin &&
                                        (<DropdownItem
                                            color={"danger"}
                                            className="text-danger"
                                            closeOnSelect={true}
                                            description={"This will delete all items in the database."}
                                            onClick={onOpen}
                                        >
                                            Truncate
                                        </DropdownItem>) as any
                                    }
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
            </Navbar>
        </>
    );
}
