import ImageCard from "../components/ImageCard.tsx";
import Stores from "../ts/stores.ts";
import {useNavigate} from "react-router-dom";

export default function StoresPage()
{
    const navigate = useNavigate();
    return (
        <>
            <h1 className={"text-9xl ml-9"}>Stores</h1>
            <div className={"flex flex-wrap flex-grow"}>
                {
                    Stores.getStores().map((store, index) =>
                    {
                        return (
                            <ImageCard
                                key={index}
                                image={store.images["992"]}
                                title={store.name}
                                description={store.address}
                                className={"flex-grow flex-shrink"}
                                onClick={()=>navigate(`/stores/${store.name.toLowerCase()}`)}
                            />
                        );
                    })
                }
            </div>
        </>
    );
}