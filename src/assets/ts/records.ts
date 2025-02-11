import {DatabaseRow} from "../components/DatabaseListComponent.tsx";
import Stores from "./stores.ts";
import {all_departments} from "../pages/DepartmentsPage.tsx";
import $ from "jquery";
import {Employee, getCurrentEmployee, getEmployees} from "./useEmployeeList.ts";

export interface Record
{
    id?: number;
    tag_number: number;
    store: number;
    department: number;
    percent: number;
    mardens_price: number;
    quantity: number;
    employee: number;
    description: string;
    created_at?: Date;
    updated_at?: Date;
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
    query?: string;
    tag_number?: number;
    store?: number;
    department?: number;
    employee?: number;
    period?: DateRange;
    limit?: number;
    page?: number;
    sort_column?: "id" | "tag" | "store" | "department" | "percent" | "mardens_price" | "quantity" | "employee" | "description" | "created_at" | "updated_at";
    sort_direction?: "asc" | "desc";
    abortSignal?: AbortSignal;
}

export const DEFAULT_RECORD_SEARCH_OPTIONS: RecordSearchOptions = {
    period: {
        from: new Date(new Date().setDate(new Date().getDate() - 365)),
        to: new Date()
    },
    limit: 10,
    page: 1,
    tag_number: undefined,
    store: undefined,
    department: undefined,
    employee: undefined,
    query: undefined,
    sort_column: undefined,
    sort_direction: "asc",
    abortSignal: new AbortController().signal
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
        if (Object.keys(options).includes("tag_number")) uri.searchParams.append("tag_number", options.tag_number!.toString());
        if (Object.keys(options).includes("store") && options.store !== undefined) uri.searchParams.append("store", options.store!.toString());
        if (Object.keys(options).includes("department") && options.department !== undefined) uri.searchParams.append("department", options.department!.toString());
        if (Object.keys(options).includes("employee") && options.employee) uri.searchParams.append("employee", options.employee!.toString());
        if (Object.keys(options).includes("query") && options.query) uri.searchParams.append("query", options.query);
        if (Object.keys(options).includes("period"))
        {
            uri.searchParams.append("from", options.period!.from.toISOString());
            uri.searchParams.append("to", options.period!.to.toISOString());
        }
        if (options.limit) uri.searchParams.append("limit", options.limit.toString());
        if (options.page) uri.searchParams.append("page", options.page.toString());
        if (options.sort_column) uri.searchParams.append("sort", options.sort_column);
        if (options.sort_direction) uri.searchParams.append("asc", options.sort_direction === "asc" ? "true" : "false");
        return fetch(uri.toString(), {signal: options.abortSignal}).then(response => response.json());
    }

    public static async add(record: Record): Promise<void>
    {
        return $.ajax("https://yeinv.mardens.com/api/", {method: "POST", data: JSON.stringify(record), contentType: "application/json"});
    }

    public static async update(record: Record): Promise<void>
    {
        return $.ajax(`https://yeinv.mardens.com/api/?id=${record.id}`, {method: "PATCH", data: JSON.stringify(record), contentType: "application/json"});
    }

    public static async delete(id: number): Promise<void>
    {
        return $.ajax(`https://yeinv.mardens.com/api/?id=${id}`, {method: "DELETE"});
    }

    public static async truncate(): Promise<void>
    {
        await $.ajax("https://yeinv.mardens.com/api/truncate", {method: "DELETE"});
    }


}

export async function recordToDatabaseRow(record: Record): Promise<DatabaseRow>
{
    const matchedStore = Stores.getStores().find(i => i.id === record.store);
    const matchedDepartment = all_departments.find((_, index) => index === record.department);
    const employee = getCurrentEmployee()?.id === record.employee ? getCurrentEmployee() : getEmployees().find(employee => employee.id === record.employee);

    if (!matchedStore)
    {
        alert(`Store Id not found: ${record.store}`);
        throw new Error("Store not found");
    }

    if (!matchedDepartment)
    {
        alert(`Department Id not found: ${record.department}`);
        throw new Error("Department not found");
    }

    return {
        ...record,
        id: record.id ?? 0,
        store: matchedStore?.name,
        department: matchedDepartment?.name,
        employee: employee || {id: -1, first_name: record.employee.toString(), last_name: "", location: ""} as Employee,
        created_at: record.created_at?.toString() ?? "",
        updated_at: record.updated_at?.toString() ?? ""
    };
}

export async function databaseRowToRecord(row: DatabaseRow): Promise<Record>
{
    const matchedStore = Stores.getStores().find(i => i.name === row.store);
    const matchedDepartment = all_departments.find(i => i.name === row.department);
    const employee:Employee = getCurrentEmployee()?.id === row.employee.id ? getCurrentEmployee() : await $.get(`https://employees.mardens.com/api/${row.employee.id}`);

    if (!employee)
    {
        alert(`Employee not found: ${row.employee.id}`);
        throw new Error("Employee not found");
    }

    if (!matchedStore)
    {
        alert(`Store not found: ${row.store}`);
        throw new Error("Store not found");
    }

    if (!matchedDepartment)
    {
        alert(`Department not found: ${row.department}`);
        throw new Error("Department not found");
    }

    return {
        ...row,
        store: matchedStore?.id,
        department: all_departments.findIndex(i => i.name === row.department),
        employee: employee.id,
        created_at: new Date(row.created_at),
        updated_at: new Date(row.updated_at)
    };
}