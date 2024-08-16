import $ from "jquery";

export interface Store
{
    id: number,
    name: string,
    address: string,
    images: { [key: string]: string }
}


export default class Stores
{
    static async init(): Promise<void>
    {
        const stores: Store[] = await $.get("https://lib.mardens.com/stores/");
        localStorage.setItem("stores", JSON.stringify(stores));
    }

    static hasStores(): boolean
    {
        return localStorage.getItem("stores") !== null;
    }

    static getStores(): Store[]
    {
        return (JSON.parse(localStorage.getItem("stores") as string) as Store[]).map((store, index) => ({...store, id: index}));
    }
}