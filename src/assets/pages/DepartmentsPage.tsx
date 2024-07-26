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


interface Department
{
    name: string,
    image: string,
}

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
    const department: Department[] = [
        {name: "Clothing", image: clothing},
        {name: "Shoes", image: shoes},
        {name: "Hardware", image: hardware},
        {name: "Furniture", image: furniture},
        {name: "Flooring", image: flooring},
        {name: "Fabric", image: fabric},
        {name: "General", image: general},
        {name: "Food", image: food}
    ];

    return (
        <>
            <h1 className={"text-2xl ml-9 mb-4 sm:text-4xl md:text-6xl lg:text-9xl"}>Departments for {store.name}</h1>
            <div className={"flex flex-wrap flex-grow"}>
                {
                    department.map(dept =>
                    {
                        return (
                            <ImageCard
                                image={dept.image}
                                title={dept.name}
                                className={"flex-grow flex-shrink"}
                                onClick={() => navigate(`/stores/${store.name.toLowerCase()}/${dept.name.toLowerCase()}`)}
                            />
                        );
                    })
                }
            </div>
        </>
    );
}