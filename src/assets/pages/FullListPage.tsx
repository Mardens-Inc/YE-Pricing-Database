import DatabaseListComponent from "../components/DatabaseListComponent.tsx";
import {Autocomplete, AutocompleteItem, Avatar, Button, Input, Tooltip} from "@nextui-org/react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faFloppyDisk} from "@fortawesome/free-regular-svg-icons";
import {faMagnifyingGlass} from "@fortawesome/free-solid-svg-icons";
import Stores, {Store} from "../ts/stores.ts";
import {all_departments, Department} from "./DepartmentsPage.tsx";
import EmployeesAutocomplete from "../components/EmployeesAutocomplete.tsx";
import {useEffect, useState} from "react";
import {Employee} from "../ts/useEmployeeList.ts";

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
                <Input
                    label={"Filter by Description"}
                    className={"w-full"}
                    startContent={<FontAwesomeIcon icon={faMagnifyingGlass} opacity={.5}/>}
                    placeholder={"Ex: Chair, T-Shirt, Tiles..."}
                    value={search}
                    onValueChange={setSearch}
                    onClear={() => setSearch("")}
                />

                <Autocomplete
                    label="Filter by Store"
                    defaultItems={Stores.getStores()}
                    className={"w-[900px]"}
                    placeholder={"Search for store..."}
                    defaultSelectedKey={store?.id}
                    onSelectionChange={(item) =>
                    {
                        if (item)
                        {
                            const store: Store | undefined = Stores.getStores().find(store => store.id == item);
                            if (store)
                                setStore(store);
                        }
                    }}
                    onValueChange={(item) =>
                    {
                        const store: Store | undefined = Stores.getStores().find(store => store.id.toString() === item);
                        if (store)
                            setStore(store);
                    }}
                    clearButtonProps={{
                        onClick: () =>
                        {
                            setStore(null);
                        }
                    }}
                >
                    {
                        (store) =>
                        {
                            return (
                                <AutocompleteItem key={store.id} textValue={store.name}>
                                    <div className={"flex flex-row items-center w-full"}>
                                        <Avatar src={store.images["150"]} alt={store.name} size={"sm"} className={"min-w-[32px] min-h-[32px] w-[32px] h-[32px] max-w-[32px] max-h-[32px]"}/>
                                        <div className={"flex flex-col ml-3 w-full"}>
                                            <span className={"text-md"}>{store.name}</span>
                                            <span className={"opacity-50 font-light text-sm truncate max-w-[95%]"}>{store.address}</span>
                                        </div>
                                    </div>
                                </AutocompleteItem>
                            );
                        }
                    }
                </Autocomplete>

                <Autocomplete
                    label={"Department"}
                    defaultItems={all_departments}
                    className={"w-[800px]"}
                    placeholder={"Search for a department..."}
                    defaultSelectedKey={department?.name}
                    clearButtonProps={{
                        onClick: () => setDepartment(null)
                    }}
                    onSelectionChange={(item) =>
                    {
                        if (item)
                        {
                            const dept: Department | undefined = all_departments.find(dept => dept.name === item);
                            if (dept)
                                setDepartment(dept);
                        }
                    }}
                    onValueChange={(item) =>
                    {
                        const dept: Department | undefined = all_departments.find(dept => dept.name === item);
                        if (dept)
                            setDepartment(dept);
                    }}

                >
                    {({name, image}) => (
                        <AutocompleteItem key={name} textValue={name}>
                            <div className={"flex flex-row items-center"}>
                                <Avatar src={image} alt={name} size={"sm"}/>
                                <span className={"ml-3"}>{name}</span>
                            </div>
                        </AutocompleteItem>
                    )}
                </Autocomplete>


                <EmployeesAutocomplete
                    description={""}
                    label={"Filter by Employee"}
                    className={"w-[800px]"}
                    onSelectionChange={setEmployee}
                />

                <Tooltip content={"Export full list"} placement={"bottom"}>
                    <Button
                        // color={"primary"}
                        className={"w-[3.5rem] h-[3.5rem] min-w-[3.5rem] min-h-[3.5rem]"}
                    >
                        <FontAwesomeIcon icon={faFloppyDisk}/>
                    </Button>
                </Tooltip>
            </div>
            <DatabaseListComponent isRefreshing={isRefreshing} limit={10} query={search} store={store?.name} department={department?.name} employee={employee}/>
        </div>
    );
}