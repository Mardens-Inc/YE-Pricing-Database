import {useNavigate, useParams} from "react-router-dom";
import Stores from "../ts/stores.ts";
import DatabaseListComponent from "../components/DatabaseListComponent.tsx";
import {Button, Input, Textarea} from "@nextui-org/react";
import {Employee} from "../ts/useEmployeeList.ts";
import {useState} from "react";
import $ from "jquery";

export default function ProcessingPage()
{
    const [isAdding, setIsAdding] = useState<boolean>(false);

    // form data
    const [tagNumber, setTagNumber] = useState("");
    const [description, setDescription] = useState("");
    const [percent, setPercent] = useState("");
    const [mardensPrice, setMardensPrice] = useState("");
    const [quantity, setQuantity] = useState("");

    // form data missing required field state
    const [tagNumberError, setTagNumberError] = useState("");
    const [percentError, setPercentError] = useState("");
    const [mardensPriceError, setMardensPriceError] = useState("");
    const [quantityError, setQuantityError] = useState("");


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

    if (!window.localStorage.getItem("employee"))
    {
        navigate("/");
        return <></>;
    }

    const store = Stores.getStores().filter(store => store.name.toLowerCase() === storeName.toLowerCase())[0];

    const onAdd = () =>
    {
        // handle empty fields
        if (tagNumber === "" || percent === "" || mardensPrice === "" || quantity === "")
        {
            if (tagNumber === "")
            {
                setTagNumberError("Tag number is required.");
            }
            if (percent === "")
            {
                setPercentError("Percent is required.");
            }
            if (mardensPrice === "")
            {
                setMardensPriceError("Mardens price is required.");
            }
            if (quantity === "")
            {
                setQuantityError("Quantity is required.");
            }
            return;
        }


        setTagNumberError("");
        setPercentError("");
        setMardensPriceError("");
        setQuantityError("");


        setIsAdding(true);

        // TODO: Submit to API
        // ...


        setPercent("");
        setMardensPrice("");
        setQuantity("");
        $("#form-restart-input").trigger("focus");
        setTimeout(() =>
        {
            setIsAdding(false);
        }, 1000);
    };

    $("#record-data-form input").on("keyup", e =>
    {
        if (e.key === "Enter")
        {
            onAdd();
        }
    });

    return (
        <>
            <div className={"flex flex-row items-end"}>
                <h1 className={"text-2xl ml-9 mb-4 sm:text-4xl md:text-5xl lg:text-7xl capitalize"}>{departmentName}</h1>
                <h2 className={"text-2xl ml-9 mb-4 sm:text-3xl md:text-4xl lg:text-6xl opacity-70 italic"}>{store.name}</h2>
            </div>

            <div className={"w-[90%] mx-auto my-10 flex flex-row gap-3"}>
                <div id={"series-data-form"} className={"flex flex-col gap-3 w-[25%]"}>
                    <Input
                        label={"Tag Number"}
                        value={tagNumber}
                        onValueChange={
                            (value) =>
                            {
                                setTagNumber(value);
                                setTagNumberError("");
                            }
                        }
                        autoFocus
                        isRequired
                        isInvalid={tagNumberError !== ""}
                        errorMessage={tagNumberError}
                    />
                    <Textarea
                        label={"Description"}
                        value={description}
                        onValueChange={setDescription}/>
                </div>
                <div id={"record-data-form"} className={"flex flex-col gap-3 w-[75%]"}>
                    <Input
                        id={"form-restart-input"}
                        label={"Percent"}
                        type={"number"}
                        value={percent}
                        onValueChange={
                            (value) =>
                            {
                                setPercent(value);
                                setPercentError("");
                            }
                        }
                        isRequired
                        isInvalid={percentError !== ""}
                        errorMessage={percentError}/>
                    <div className={"flex flex-row gap-3"}>
                        <Input
                            label={"Mardens Price or Tag Price"}
                            type={"number"}
                            value={mardensPrice}
                            onValueChange={
                                (value) =>
                                {
                                    setMardensPrice(value);
                                    setMardensPriceError("");
                                }
                            }
                            isRequired
                            isInvalid={mardensPriceError !== ""}
                            errorMessage={mardensPriceError}/>
                        <Input
                            label={"Quantity"}
                            className={"w-[25%]"}
                            type={"number"}
                            value={quantity}
                            onValueChange={
                                (value) =>
                                {
                                    setQuantity(value);
                                    setQuantityError("");
                                }
                            }
                            isRequired
                            isInvalid={quantityError !== ""}
                            errorMessage={quantityError}/>
                    </div>
                    <Button radius={"full"} isLoading={isAdding} onClick={onAdd}>Add</Button>
                </div>
            </div>


            <DatabaseListComponent
                store={storeName}
                department={departmentName!}
                employee={JSON.parse(window.localStorage.getItem("employee")!) as Employee}
            />
        </>
    );
}