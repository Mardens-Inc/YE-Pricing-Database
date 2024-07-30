import {useNavigate, useParams} from "react-router-dom";
import Stores from "../ts/stores.ts";
import DatabaseListComponent from "../components/DatabaseListComponent.tsx";
import {Button, Input, Textarea} from "@nextui-org/react";
import {Employee} from "../ts/useEmployeeList.ts";

export default function ProcessingPage()
{
    const navigate = useNavigate();
    const params = useParams();
    const storeName: string | undefined = params.store;
    const departmentName: string | undefined = params.department;

    if (storeName === undefined)
    {
        navigate("/stores");
        return <></>;
    }

    if (departmentName === undefined)
    {
        navigate(`/stores/${storeName}`);
        return <></>;
    }

    const store = Stores.getStores().filter(store => store.name.toLowerCase() === storeName.toLowerCase())[0];

    return (
        <>
            <div className={"flex flex-row items-end"}>
                <h1 className={"text-2xl ml-9 mb-4 sm:text-4xl md:text-5xl lg:text-7xl capitalize"}>{departmentName}</h1>
                <h2 className={"text-2xl ml-9 mb-4 sm:text-3xl md:text-4xl lg:text-6xl opacity-70 italic"}>{store.name}</h2>
            </div>

            <div className={"w-[90%] mx-auto my-10 flex flex-row gap-3"}>
                <div className={"flex flex-col gap-3 w-[25%]"}>
                    <Input label={"Tag Number"}/>
                    <Textarea label={"Description"}/>
                </div>
                <div className={"flex flex-col gap-3 w-[75%]"}>
                    <Input label={"Percent"} type={"number"}/>
                    <div className={"flex flex-row gap-3"}>
                        <Input label={"Mardens Price or Tag Price"} type={"number"}/>
                        <Input label={"Quantity"} className={"w-[25%]"} type={"number"}/>
                    </div>
                    <Button radius={"full"}>Add</Button>
                </div>
            </div>


            <DatabaseListComponent store={storeName} department={departmentName!} employee={JSON.parse(window.localStorage.getItem("employee")!) as Employee}/>
        </>
    );
}