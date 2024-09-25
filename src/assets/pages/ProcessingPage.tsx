import {useNavigate, useParams} from "react-router-dom";
import Stores from "../ts/stores.ts";
import DatabaseListComponent from "../components/DatabaseListComponent.tsx";
import {Button, Input, Textarea} from "@nextui-org/react";
import {Employee} from "../ts/useEmployeeList.ts";
import {useState} from "react";
import $ from "jquery";
import Records, {Record} from "../ts/records.ts";
import {all_departments} from "./DepartmentsPage.tsx";
import sound from "../audio/notification-sound.mp3";

export default function ProcessingPage()
{
    const [isAdding, setIsAdding] = useState<boolean>(false);

    // form data
    const [tagNumber, setTagNumber] = useState("");
    const [description, setDescription] = useState("");
    const [percent, setPercent] = useState<string>("0");
    const [mardensPrice, setMardensPrice] = useState("");
    const [quantity, setQuantity] = useState("1");

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
            const missing_required = $("input[aria-required='true']").filter((_, el) => ((el as HTMLInputElement).value === ""));
            if (missing_required.length !== 0)
            {
                $(missing_required[0]).trigger("focus");
                return;
            }

            return;
        }


        setTagNumberError("");
        setMardensPriceError("");
        setQuantityError("");


        setIsAdding(true);

        const record: Record = {
            tag_number: parseInt(tagNumber),
            store: store.id,
            department: all_departments.findIndex(department => department.name.toLowerCase() === departmentName.toLowerCase()),
            percent: Number(percent),
            mardens_price: parseFloat(mardensPrice),
            quantity: parseInt(quantity),
            employee: (JSON.parse(window.localStorage.getItem("employee")!) as Employee).employee_id,
            description
        };

        await Records.add(record);


        await ($("#notification-sound")[0] as HTMLAudioElement).play();

        // setPercent(0);
        setMardensPrice("");
        setIsAdding(false);
        setIsRefreshing(prevState => !prevState);
        $("#quantity-input").trigger("focus");
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
            <audio id={"notification-sound"} src={sound}/>
            <div className={"flex flex-row items-end"}>
                <h1 className={"text-2xl ml-9 mb-4 sm:text-4xl md:text-5xl lg:text-7xl capitalize"}>{departmentName}</h1>
                <h2 className={"text-2xl ml-9 mb-4 sm:text-3xl md:text-4xl lg:text-6xl opacity-70 italic"}>{store.name}</h2>
            </div>

            <div className={"w-[90%] mx-auto my-10 flex flex-row gap-3"}>
                <div id={"series-data-form"} className={"flex flex-col gap-3 w-[25%]"}>
                    <Input
                        tabIndex={1}
                        label={"Tag Number"}
                        value={tagNumber}
                        onValueChange={
                            (value) =>
                            {
                                value = value.replace(/[^0-9]/g, "");
                                let num = parseInt(value);
                                if (isNaN(num)) num = 0;
                                if (num < 0) value = "0";
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
                        tabIndex={2}
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
                            tabIndex={3}
                            label={"Quantity"}
                            id={"quantity-input"}
                            className={"w-[25%]"}
                            value={quantity}
                            onValueChange={
                                (value) =>
                                {
                                    value = value.replace(/[^0-9]/g, "");
                                    let num = parseInt(value);
                                    if (isNaN(num)) num = 0;
                                    if (num < 0) value = "0";
                                    setQuantity(value);
                                    setQuantityError("");
                                }
                            }
                            isRequired
                            isInvalid={quantityError !== ""}
                            errorMessage={quantityError}/>
                        <Input
                            tabIndex={4}
                            id={"mardens-price-input"}
                            label={"Mardens Price or Tag Price"}
                            value={mardensPrice}
                            onValueChange={
                                (value) =>
                                {
                                    value = value.replace(/[^0-9.]/g, "");
                                    let num = parseInt(value);
                                    if (isNaN(num)) num = 0;
                                    if (num < 0) value = "0";
                                    setMardensPrice(value);
                                    setMardensPriceError("");
                                }
                            }
                            isRequired
                            isInvalid={mardensPriceError !== ""}
                            errorMessage={mardensPriceError}/>
                    </div>
                    <Input
                        tabIndex={5}
                        label={"Percentage"}
                        value={percent}
                        onKeyDown={(e) =>
                        {
                            if (e.key === "Tab")
                            {
                                e.preventDefault();
                                $("#quantity-input").trigger("focus");
                            }
                        }}
                        onValueChange={
                            (value) =>
                            {

                                value = value.replace(/[^0-9.]/g, "");
                                let percent = parseInt(value);
                                if (isNaN(percent)) value = "0";
                                if (percent < 0) value = "0";
                                if (percent > 100) value = "100";
                                setPercent(value);
                            }
                        }
                    />
                    <Button excludeFromTabOrder radius={"full"} isLoading={isAdding} onClick={onAdd}>Add</Button>
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