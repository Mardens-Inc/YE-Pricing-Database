import {useEffect, useState} from "react";

export interface Employee
{
    id: number,
    first_name: string
    last_name: string,
    location: string
}

export function getCurrentEmployee(): Employee | null
{
    const employee = window.localStorage.getItem("employee");
    if (employee)
    {
        return JSON.parse(employee);
    }
    return null;
}

export function cacheEmployees()
{
    if (document.cookie.includes("employees_fetched=true")) return;
    fetch(`https://employees.mardens.com/api/`).then(response => response.json()).then(data =>
    {
        localStorage.setItem("employees", JSON.stringify(data.employees));
        document.cookie = "employees_fetched=true";
    });
}

export function getEmployees(): Employee[]
{
    try
    {

        const employees = JSON.parse(<string>localStorage.getItem("employees")) as Employee[] | null;
        if (!employees)
        {
            throw new Error("No employees found in local storage");
        }
        return employees;
    } catch (e)
    {
        document.cookie = "employees_fetched=false";
        cacheEmployees();
        window.location.reload();
        return [];
    }
}

export function useEmployeeList(search?: string)
{
    const [items, setItems] = useState<Employee[]>([]);
    const [hasMore, setHasMore] = useState(true);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(0);
    const limit = 10;
    const fetchedPages = new Set<number>();

    useEffect(() =>
    {
        // setItems([]);
        // setHasMore(true);
        // setLoading(true);
        // setPage(0);

        if (search === "")
        {
            fetchedPages.clear();
            loadEmployees(0);
            return;
        }
        if (search)
        {
            fetch(`https://employees.mardens.com/api/search?q=${search}&limit=10`).then(response => response.json()).then(data =>
            {
                console.log(data);
                setItems(data);
                setHasMore(false);
                setLoading(false);
            });

            const employees = getEmployees();
            const filteredEmployees = employees.filter(employee => employee.first_name.toLowerCase().includes(search.toLowerCase()) || employee.last_name.toLowerCase().includes(search.toLowerCase()));
            setItems(filteredEmployees);

        }

    }, [search]);

    const loadEmployees = async (currentPage: number) =>
    {
        if (fetchedPages.has(currentPage))
        {
            return;
        }
        fetchedPages.add(currentPage);
        const controller = new AbortController();
        const signal = controller.signal;

        try
        {
            setLoading(true);
            const response = await fetch(`https://employees.mardens.com/api/?limit=${limit}&page=${currentPage}`, {signal});
            if (!response.ok)
            {
                throw new Error("Failed to fetch data");
            }
            const data = await response.json();
            const lastPage = data["last_page"];
            setHasMore(currentPage < lastPage);
            setItems((prevItems) =>
            {
                return [...prevItems, ...data.employees];
            });

        } catch (e: any)
        {
            if (e.name === "AbortError")
            {
                console.log("Fetch aborted");
            } else
            {
                console.error("There was an error with the fetch operation:", e);
            }
        } finally
        {
            setLoading(false);
        }
    };

    useEffect(() =>
    {
        loadEmployees(page);
    }, []);

    const onLoadMore = () =>
    {
        const newPage = page + 1;
        setPage(newPage);
        loadEmployees(newPage);
    };

    return {items, hasMore, loading, onLoadMore};

}