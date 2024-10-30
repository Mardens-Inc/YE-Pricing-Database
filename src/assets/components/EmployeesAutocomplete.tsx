import {Autocomplete, AutocompleteItem, Avatar} from "@nextui-org/react";
import {useEffect, useState} from "react";
import {Employee, useEmployeeList} from "../ts/useEmployeeList.ts";
import {useInfiniteScroll} from "@nextui-org/use-infinite-scroll";

export default function EmployeesAutocomplete({onSelectionChange, error, label, description, placeholder, isRequired, className}: { onSelectionChange?: (item: Employee | null) => void, error?: string, label?: string, description?: string, placeholder?: string, isRequired?: boolean, className?: string })
{
    error ??= "";
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
            label={label ?? "Employee"}
            description={description ?? "Select your employee ID or username."}
            placeholder={placeholder ?? "Search for an employee..."}
            isRequired={isRequired}
            defaultItems={items}
            scrollRef={scrollerRef}
            isLoading={loading}
            onOpenChange={setOpen}
            isInvalid={errorMessage !== ""}
            errorMessage={errorMessage}
            className={className}
            clearButtonProps={{
                onClick: () =>
                {
                    if (onSelectionChange) onSelectionChange(null);
                }
            }}
            onValueChange={value =>
            {
                if (value !== search)
                    setSearch(value);
            }}
            onSelectionChange={item =>
            {
                fetch(`https://employees.mardens.com/api/${item}`).then(response => response.json()).then(data =>
                {
                    if (onSelectionChange){
                        onSelectionChange(data as Employee | null);
                    }
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
                        key={emp.id}
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