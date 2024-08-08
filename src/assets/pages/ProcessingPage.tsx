import {useNavigate, useParams} from "react-router-dom";
import Stores from "../ts/stores.ts";
import DatabaseListComponent from "../components/DatabaseListComponent.tsx";
import {Button, Input, Slider, Textarea} from "@nextui-org/react";
import {Employee} from "../ts/useEmployeeList.ts";
import {useState} from "react";
import $ from "jquery";
import Records, {Record} from "../ts/records.ts";
import {all_departments} from "./DepartmentsPage.tsx";

export default function ProcessingPage()
{
    const [isAdding, setIsAdding] = useState<boolean>(false);

    // form data
    const [tagNumber, setTagNumber] = useState("");
    const [description, setDescription] = useState("");
    const [percent, setPercent] = useState<number>(40);
    const [mardensPrice, setMardensPrice] = useState("");
    const [quantity, setQuantity] = useState("");

    // form data missing required field state
    const [tagNumberError, setTagNumberError] = useState("");
    const [mardensPriceError, setMardensPriceError] = useState("");
    const [quantityError, setQuantityError] = useState("");
    const [isRefreshing, setIsRefreshing] = useState(false);


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

    const onAdd = async () =>
    {
        if (isAdding) return;
        // handle empty fields
        if (tagNumber === "" || mardensPrice === "" || quantity === "")
        {
            if (tagNumber === "")
            {
                setTagNumberError("Tag number is required.");
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
        setMardensPriceError("");
        setQuantityError("");


        setIsAdding(true);

        // TODO: Submit to API
        // ...

        const record: Record = {
            tag_number: parseInt(tagNumber),
            store: store.id,
            department: all_departments.findIndex(department => department.name.toLowerCase() === departmentName.toLowerCase()),
            percent: percent,
            mardens_price: parseFloat(mardensPrice),
            quantity: parseInt(quantity),
            employee: (JSON.parse(window.localStorage.getItem("employee")!) as Employee).employee_id,
            description
        };

        await Records.add(record);

        // setPercent(0);
        setMardensPrice("");
        setQuantity("");
        $("#form-restart-input").trigger("focus");
        setTimeout(() =>
        {
            setIsAdding(false);
            setIsRefreshing(prevState => !prevState);
        }, 1000);
    };

    $("#record-data-form input")
        .off("keyup")
        .on("keyup", async e =>
        {
            if (e.key === "Enter")
            {
                await onAdd();
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
                        onValueChange={setDescription}
                        className={"h-full"}
                        classNames={{
                            inputWrapper: "!h-[100%]"
                        }}
                    />
                </div>
                <div id={"record-data-form"} className={"flex flex-col gap-3 w-[75%]"}>
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
                    <Slider
                        label={"Percentage"}
                        value={percent}
                        step={1}
                        minValue={0}
                        maxValue={100}
                        size={"lg"}
                        showTooltip
                        showSteps
                        onChange={
                            (value) =>
                            {
                                if (Array.isArray(value)) value = value[0];
                                setPercent(value);
                            }
                        }
                        marks={[
                            {value: 0, label: "0%"},
                            {value: 25, label: "25%"},
                            {value: 50, label: "50%"},
                            {value: 75, label: "75%"},
                            {value: 100, label: "100%"}
                        ]}
                        renderValue={
                            ({}) =>
                            {
                                return (
                                    <Input
                                        id={"form-restart-input"}
                                        type={"number"}
                                        value={percent.toString()}
                                        onValueChange={
                                            (value) =>
                                            {
                                                if (value === "") value = "0";
                                                let percent = parseFloat(value);
                                                if (isNaN(percent)) percent = 0;
                                                setPercent(percent);
                                            }
                                        }

                                        classNames={{
                                            base: "w-[4.2rem] text-center"
                                        }}

                                    />
                                );
                            }
                        }

                    />
                    <Button radius={"full"} isLoading={isAdding} onClick={onAdd}>Add</Button>
                </div>
            </div>


            <DatabaseListComponent
                store={storeName}
                department={departmentName!}
                employee={JSON.parse(window.localStorage.getItem("employee")!) as Employee}
                isRefreshing={isRefreshing}
            />
        </>
    );
}