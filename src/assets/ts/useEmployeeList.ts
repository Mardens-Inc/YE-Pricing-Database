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
    try
    {
        const employee = window.localStorage.getItem("employee");
        if (employee)
        {
            return JSON.parse(employee);
        }
        return null;
    } catch (error)
    {
        console.error("Error retrieving current employee:", error);
        return null;
    }
}

export function cacheEmployees()
{
    if (document.cookie.includes("employees_fetched=true")) return;
    fetch(`https://employees.mardens.com/api/all`)
        .then(response =>
        {
            if (!response.ok)
            {
                throw new Error(`Error fetching employees: ${response.statusText}`);
            }
            return response.json();
        })
        .then(data =>
        {
            localStorage.setItem("employees", JSON.stringify(data));
            document.cookie = "employees_fetched=true; path=/; SameSite=Strict;";
        })
        .catch(error =>
        {
            console.error("Error caching employees:", error);
        });
}

export function getEmployees(): Employee[] {
    try {
        const employeesRaw = localStorage.getItem("employees");
        if (!employeesRaw || employeesRaw === "null") {
            throw new Error("No employees found in local storage");
        }

        const employees = JSON.parse(employeesRaw) as Employee[];
        if (!Array.isArray(employees)) {
            throw new Error("Invalid employee data format");
        }

        return employees;
    } catch (error) {
        console.error("Error retrieving employees from local storage:", error);
        document.cookie = "employees_fetched=false";
        cacheEmployees();
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
        if (search === "")
        {
            fetchedPages.clear();
            loadEmployees(0);
            return;
        }
        if (search)
        {
            fetch(`https://employees.mardens.com/api/search?q=${search}&limit=10`)
                .then(response =>
                {
                    if (!response.ok)
                    {
                        throw new Error(`Error searching employees: ${response.statusText}`);
                    }
                    return response.json();
                })
                .then(data =>
                {
                    console.log(data);
                    setItems(data);
                    setHasMore(false);
                    setLoading(false);
                })
                .catch(error =>
                {
                    console.error("Error searching employees:", error);
                    setLoading(false);
                });

            try
            {
                const employees = getEmployees();
                const filteredEmployees = employees.filter(employee => employee.first_name.toLowerCase().includes(search.toLowerCase()) || employee.last_name.toLowerCase().includes(search.toLowerCase()));
                setItems(filteredEmployees);
            } catch (error)
            {
                console.error("Error filtering employees:", error);
            }
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
                throw new Error(`Failed to fetch data: ${response.statusText}`);
            }
            const data = await response.json();
            const lastPage = data["last_page"];
            setHasMore(currentPage < lastPage);
            setItems((prevItems) =>
            {
                return [...prevItems, ...data.employees];
            });
        } catch (error: any)
        {
            if (error.name === "AbortError")
            {
                console.log("Fetch aborted");
            } else
            {
                console.error("Error loading employees:", error);
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