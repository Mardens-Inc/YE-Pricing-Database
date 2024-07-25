import $ from "jquery";

interface Store
{
    name: string,
    address: string,
    images: any
}

export default class Stores
{
    static async init(): Promise<void>
    {
        const stores: Store[] = await $.get("https://lib.mardens.com/stores.json");
        localStorage.setItem("stores", JSON.stringify(stores));
    }

    static hasStores(): boolean
    {
        return localStorage.getItem("stores") !== null;
    }

    static getStores(): Store[]
    {
        return JSON.parse(localStorage.getItem("stores") as string) as Store[];
    }
}