import {Autocomplete, AutocompleteItem, Avatar, Input} from "@nextui-org/react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faMagnifyingGlass} from "@fortawesome/free-solid-svg-icons";
import Stores, {Store} from "../ts/stores.ts";
import {all_departments, Department} from "../pages/DepartmentsPage.tsx";
import EmployeesAutocomplete from "./EmployeesAutocomplete.tsx";
import {Employee} from "../ts/useEmployeeList.ts";

interface ListFilterOptionsProps
{
    search: string;
    setSearch: (value: string) => void;
    store: Store | null;
    setStore: (value: Store | null) => void;
    department: Department | null;
    setDepartment: (value: Department | null) => void;
    setEmployee: (value: Employee | null) => void;
}

export default function ListFilterOptions(props: ListFilterOptionsProps)
{
    const {store, setStore, department, setDepartment, setEmployee, setSearch, search} = props;
    return (
        <>
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
                isClearable={false}
                onSelectionChange={(item) =>
                {
                    if (item)
                    {
                        const store: Store | undefined = Stores.getStores().find(store => store.id == item);
                        if (store)
                            setStore(store);
                        else
                            setStore(null);
                    } else
                    {
                        setStore(null);
                    }
                }}
                onValueChange={(item) =>
                {
                    const store: Store | undefined = Stores.getStores().find(store => store.id.toString() === item);
                    if (store)
                        setStore(store);
                    else
                        setStore(null);
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
                selectedKey={department?.name ?? null}
                isClearable={false}
                clearButtonProps={{
                    onClick: () => setDepartment(null),
                    className: "w-[32px] h-[32px] z-10 cursor-pointer"
                }}
                onSelectionChange={(item) =>
                {
                    if (item)
                    {
                        const dept: Department | undefined = all_departments.find(dept => dept.name === item);
                        if (dept)
                            setDepartment(dept);
                    } else
                    {
                        setDepartment(null);
                    }
                }}
                onValueChange={(item) =>
                {
                    const dept: Department | undefined = all_departments.find(dept => dept.name === item);
                    if (dept)
                        setDepartment(dept);
                    else
                        setDepartment(null);
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
        </>
    );
}