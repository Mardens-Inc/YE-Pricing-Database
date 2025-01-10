import DatabaseListComponent from "../components/DatabaseListComponent.tsx";
import {Button, Tooltip} from "@nextui-org/react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faFloppyDisk} from "@fortawesome/free-regular-svg-icons";
import {Store} from "../ts/stores.ts";
import {Department} from "./DepartmentsPage.tsx";
import {useEffect, useState} from "react";
import {Employee} from "../ts/useEmployeeList.ts";
import ListFilterOptions from "../components/ListFilterOptions.tsx";

export default function FullListPage()
{
    const [search, setSearch] = useState<string>("");
    const [store, setStore] = useState<Store | null>(null);
    const [department, setDepartment] = useState<Department | null>(null);
    const [employee, setEmployee] = useState<Employee | null>(null);
    const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

    useEffect(() =>
    {
        setIsRefreshing(prev => !prev);
    }, [search, store, department, employee]);


    return (
        <div>
            <div className={"flex flex-row w-[90%] mx-auto mb-4 gap-4"}>
                <ListFilterOptions
                    search={search}
                    setSearch={setSearch}
                    store={store}
                    setStore={setStore}
                    department={department}
                    setDepartment={setDepartment}
                    setEmployee={setEmployee}
                />
                <Tooltip content={"Export filtered list"} placement={"bottom"}>
                    <Button
                        // color={"primary"}
                        className={"w-[3.5rem] h-[3.5rem] min-w-[3.5rem] min-h-[3.5rem]"}
                        onPress={() =>
                        {
                            const url = new URL("https://yeinv.mardens.com/api/export");
                            if (search)
                                url.searchParams.append("query", search);
                            if (store?.id !== undefined && store?.id !== null)
                                url.searchParams.append("store", store?.id.toString()!);
                            if (department?.id !== undefined && department?.id !== null)
                                url.searchParams.append("department", department?.id.toString()!);

                            const link = document.createElement("a");
                            link.href = url.href;
                            link.click();
                            console.log("Exporting database");
                        }}
                    >
                        <FontAwesomeIcon icon={faFloppyDisk}/>
                    </Button>
                </Tooltip>
            </div>
            <DatabaseListComponent isRefreshing={isRefreshing} limit={50} query={search} store={store?.name} department={department?.name} employee={employee}/>
        </div>
    );
}