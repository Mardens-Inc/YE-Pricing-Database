import {Autocomplete, AutocompleteItem, Avatar} from "@nextui-org/react";
import {useEffect, useState} from "react";
import {Employee, useEmployeeList} from "../ts/useEmployeeList.ts";
import {useInfiniteScroll} from "@nextui-org/use-infinite-scroll";

export default function EmployeesAutocomplete({onSelectionChange, error}: { onSelectionChange: (item: Employee | null) => void, error: string })
{
    const [isOpen, setOpen] = useState(false);
    const [search, setSearch] = useState<string | undefined>(undefined);
    const {items, hasMore, loading, onLoadMore} = useEmployeeList(search);
    const [errorMessage, setErrorMessage] = useState<string>(error);
    const [, scrollerRef] = useInfiniteScroll({
        hasMore,
        isEnabled: isOpen,
        shouldUseLoader: false,
        onLoadMore
    });

    useEffect(() =>
    {
        setErrorMessage(error);
    }, [error]);

    return (
        <Autocomplete
            id={"employee-autocomplete"}
            label={"Employee"}
            description={"Select your employee ID or username."}
            placeholder={"Search for an employee..."}
            isRequired
            defaultItems={items}
            scrollRef={scrollerRef}
            isLoading={loading}
            onOpenChange={setOpen}
            isInvalid={errorMessage !== ""}
            errorMessage={errorMessage}
            onValueChange={value =>
            {
                if (value !== search)
                    setSearch(value);
            }}
            onSelectionChange={item =>
            {
                fetch(`https://employees.mardens.com/api/${item}`).then(response => response.json()).then(data =>
                {
                    onSelectionChange(data as Employee | null);
                });
            }}
            scrollShadowProps={{
                isEnabled: false
            }}
        >

            {(emp) =>
            {
                const name = `${emp.first_name} ${emp.last_name}`;
                return (
                    <AutocompleteItem
                        key={emp.employee_id}
                        textValue={`${emp.first_name} ${emp.last_name}`}
                        className={"flex flex-row capitalize"}
                    >
                        <div className={"flex flex-row"}>
                            <Avatar alt={name} className="flex-shrink-0 mr-4" size="sm" src={""}/>
                            <div className="flex flex-col">
                                <span className="text-small capitalize">{name.toLowerCase()}</span>
                                <span className="text-tiny text-default-400">{emp.location}</span>
                            </div>
                        </div>
                    </AutocompleteItem>
                );

            }}

        </Autocomplete>);
}