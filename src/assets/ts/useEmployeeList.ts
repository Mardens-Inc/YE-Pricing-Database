import {useEffect, useState} from "react";

export interface Employee
{
    employee_id: number,
    first_name: string
    last_name: string,
    location: string
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
                setItems(data);
                setHasMore(false);
                setLoading(false);
            });
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