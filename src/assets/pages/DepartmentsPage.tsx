import {useNavigate, useParams} from "react-router-dom";
import Stores from "../ts/stores.ts";

export default function DepartmentsPage()
{
    const navigate = useNavigate();
    const storeName: string | undefined = useParams().store;
    if (storeName === undefined)
    {
        navigate("/stores");
        return <></>;
    }

    const store = Stores.getStores().filter(store => store.name.toLowerCase() === storeName.toLowerCase())[0];


    return (
        <>
            <h1 className={"text-9xl ml-9"}>Departments for {store.name}</h1>
            <div className={"flex flex-wrap flex-grow"}>
                {
                }
            </div>
        </>
    );
}