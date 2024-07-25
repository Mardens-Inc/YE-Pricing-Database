import {cn} from "@nextui-org/react";

export interface ImageCardProps
{
    image: string;
    title?: string;
    description?: string;
    className?: string;
    onClick?: () => void;
}

export default function ImageCard(props: ImageCardProps)
{
    return (
        <div className={cn(
            props.className,
            "image-card-container flex flex-col items-center justify-center relative",
            "m-4 rounded-lg shadow-lg w-[400px] h-[200px] cursor-pointer transition-transform transform duration-300 ease-in-out overflow-hidden hover:scale-[1.015]"
        )}>
            <div
                className={
                    cn(
                        "image-card bg-cover bg-center bg-no-repeat contrast-[1.25] brightness-[.4] duration-300 ease-in-out absolute top-[-10px] left-[-10px] right-[-10px] bottom-[-10px] z-0 blur-sm",
                        "transition-all duration-300 ease-in-out",
                        "hover:contrast-[1] hover:brightness-[.7] hover:blur-lg hover:scale-105"
                    )
                } style={{backgroundImage: `url('https://lib.mardens.com${props.image}')`}} onClick={props.onClick}>
            </div>
            <div className="image-card-content absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] pointer-events-none">
                <h2 className={"text-4xl font-bold"}>{props.title}</h2>
                <p>{props.description}</p>
            </div>
        </div>
    );
}
{

}