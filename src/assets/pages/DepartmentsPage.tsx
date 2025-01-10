import {useNavigate, useParams} from "react-router-dom";
import Stores from "../ts/stores.ts";
import ImageCard from "../components/ImageCard.tsx";
// include images
import clothing from "/src/assets/images/clothing.webp";
import shoes from "/src/assets/images/shoes.webp";
import hardware from "/src/assets/images/hardware.webp";
import furniture from "/src/assets/images/furniture.webp";
import flooring from "/src/assets/images/flooring.webp";
import fabric from "/src/assets/images/fabric.webp";
import general from "/src/assets/images/general.webp";
import food from "/src/assets/images/food.webp";
import StoresPage from "./StoresPage.tsx";


export interface Department
{
    id: number,
    name: string,
    image: string,
}

export const all_departments: Department[] = [
    {id: 0, name: "Clothing", image: clothing},
    {id: 1, name: "Shoes", image: shoes},
    {id: 2, name: "Hardware", image: hardware},
    {id: 3, name: "Furniture", image: furniture},
    {id: 4, name: "Flooring", image: flooring},
    {id: 5, name: "Fabric", image: fabric},
    {id: 6, name: "General", image: general},
    {id: 7, name: "Food", image: food}
];

export default function DepartmentsPage()
{
    const storeName: string | undefined | null = useParams().store;
    console.log(storeName == "null");
    const navigate = useNavigate();
    if (storeName === undefined || storeName === "null")
    {
        navigate("/stores/");
        return <StoresPage/>;
    }

    const store = Stores.getStores().filter(store => store.name.toLowerCase() === storeName.toLowerCase())[0];

    return (
        <>
            <h1 className={"text-2xl ml-9 mb-4 sm:text-4xl md:text-6xl lg:text-9xl"}>Departments for {store.name}</h1>
            <div className={"flex flex-wrap flex-grow"}>
                {
                    all_departments.map(dept =>
                    {
                        return (
                            <ImageCard
                                image={dept.image}
                                title={dept.name}
                                className={"flex-grow flex-shrink"}
                                onClick={() =>
                                {
                                    localStorage.setItem("department", dept.name.toLowerCase());
                                    navigate(`/stores/${store.name.toLowerCase()}/${dept.name.toLowerCase()}`);
                                }}
                            />
                        );
                    })
                }
            </div>
        </>
    );
}