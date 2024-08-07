import {DatabaseRow} from "../components/DatabaseListComponent.tsx";
import Stores from "./stores.ts";
import {all_departments} from "../pages/DepartmentsPage.tsx";
import $ from "jquery";

export interface Record
{
    id: number;
    tag_number: number;
    store: number;
    department: number;
    percent: number;
    mardens_price: number;
    quantity: number;
    employee: number;
    description: string;
    created_at: Date;
    updated_at: Date;
}

export interface DatabaseResult
{
    data: Record[];
    per_page: number;
    current_page: number;
    last_page: number;
    count: number;
    total: number;
}

export interface RecordSearchOptions
{
    tag_number?: number;
    store?: number;
    department?: number;
    employee?: number;
    period?: DateRange;
    limit?: number;
    page?: number;
}

export const DEFAULT_RECORD_SEARCH_OPTIONS: RecordSearchOptions = {
    period: {
        from: new Date(new Date().setDate(new Date().getDate() - 365)),
        to: new Date()
    },
    limit: 10,
    page: 1
};

export interface DateRange
{
    from: Date;
    to: Date;
}

export default class Records
{
    public static async search(options: RecordSearchOptions = DEFAULT_RECORD_SEARCH_OPTIONS): Promise<DatabaseResult>
    {
        const uri = new URL("https://yeinv.mardens.com/api/");
        if (options.tag_number) uri.searchParams.append("tag_number", options.tag_number.toString());
        if (options.store) uri.searchParams.append("store", options.store.toString());
        if (options.department) uri.searchParams.append("department", options.department.toString());
        if (options.employee) uri.searchParams.append("employee", options.employee.toString());
        if (options.period)
        {
            uri.searchParams.append("from", options.period.from.toISOString());
            uri.searchParams.append("to", options.period.to.toISOString());
        }
        if (options.limit) uri.searchParams.append("limit", options.limit.toString());
        if (options.page) uri.searchParams.append("page", options.page.toString());
        return $.get(uri.toString());
    }

}

export async function recordToDatabaseRow(record: Record): Promise<DatabaseRow>
{
    const matchedStore = Stores.getStores().find(i => i.id === record.store);
    const matchedDepartment = all_departments.find((_, index) => index === record.department);
    const employee = await $.get(`https://employees.mardens.com/api/${record.employee}`);

    if (!employee)
    {
        throw new Error("Employee not found");
    }

    if (!matchedStore)
    {
        throw new Error("Store not found");
    }

    if (!matchedDepartment)
    {
        throw new Error("Department not found");
    }

    return {
        ...record,
        store: matchedStore?.name,
        department: matchedDepartment?.name,
        employee,
        created_at: record.created_at.toString(),
        updated_at: record.updated_at.toString()
    };
}