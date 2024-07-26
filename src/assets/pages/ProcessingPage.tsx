import {useNavigate, useParams} from "react-router-dom";
import Stores from "../ts/stores.ts";

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

    const store = Stores.getStores().filter(store => store.name.toLowerCase() === storeName.toLowerCase())[0];

    return (
        <>
            <h1 className={"text-2xl ml-9 mb-4 sm:text-2xl md:text-4xl lg:text-7xl capitalize"}>{departmentName}</h1>
            <h2 className={"text-2xl ml-9 mb-4 sm:text-2xl md:text-3xl lg:text-4xl"}>{store.name}</h2>
            <div className={"flex flex-wrap flex-grow"}>
            </div>
        </>
    );
}