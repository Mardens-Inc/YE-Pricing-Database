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

    const handleSelectionChange = async (item: string | null) =>
    {
        if (!item) return;
        try
        {
            const response = await fetch(`https://employees.mardens.com/api/${item}`);
            if (!response.ok)
            {
                throw new Error(`Failed to fetch employee details (status: ${response.status})`);
            }
            const data = await response.json();
            if (onSelectionChange)
            {
                onSelectionChange(data as Employee | null);
            }
        } catch (e)
        {
            const errMessage = e instanceof Error ? e.message : "Unknown error occurred.";
            setErrorMessage(errMessage);
            if (onSelectionChange)
            {
                onSelectionChange(null);
            }
        }
    };

    return (
        <Autocomplete
            key={"employee-autocomplete"}
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
            onSelectionChange={(key) => handleSelectionChange(key as string | null)}
            scrollShadowProps={{
                isEnabled: false
            }}
        >

            {(emp) =>
            {
                try
                {

                    const name = `${emp.first_name ?? "unknown"} ${emp.last_name ?? "unknown"}`;
                    return (
                        <AutocompleteItem
                            key={emp.id ?? "unknown"}
                            textValue={`${emp.first_name ?? "unknown"} ${emp.last_name ?? "unknown"}`}
                            className={"flex flex-row capitalize"}
                        >
                            <div className={"flex flex-row"}>
                                <Avatar alt={name} className="flex-shrink-0 mr-4" size="sm" src={""}/>
                                <div className="flex flex-col">
                                    <span className="text-small capitalize">{name?.toLowerCase()}</span>
                                    <span className="text-tiny text-default-400">{emp.location ?? "unknown"}</span>
                                </div>
                            </div>
                        </AutocompleteItem>
                    );
                } catch
                {
                    return (<></>);
                }
            }}

        </Autocomplete>);
}