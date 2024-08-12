import {Button, cn, getKeyValue, Pagination, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow, Tooltip} from "@nextui-org/react";
import {EditIcon, TrashIcon} from "./Icons.tsx";
import {useEffect, useState} from "react";
import ConfirmModal from "./ConfirmModal.tsx";
import EditRecordModal from "./EditRecordModal.tsx";
import {Employee} from "../ts/useEmployeeList.ts";
import Records, {databaseRowToRecord, recordToDatabaseRow} from "../ts/records.ts";
import Stores from "../ts/stores.ts";
import {all_departments} from "../pages/DepartmentsPage.tsx";

export interface DatabaseRow
{
    id: number;
    tag_number: number;
    store: string,
    department: string;
    percent: number,
    mardens_price: number,
    quantity: number,
    description: string,
    employee: Employee;
    created_at: string;
    updated_at: string;
}

export interface DatabaseListProps
{
    store?: string;
    department?: string;
    employee?: Employee;
    isRefreshing: boolean;
    limit?: number;
}


export default function DatabaseListComponent(props: DatabaseListProps)
{
    if (props.employee === null)
    {
        return <></>;
    }

    const [deletingId, setDeletingId] = useState<number | null>(null);
    const [editingRecord, setEditingRecord] = useState<DatabaseRow | null>(null);
    const [items, setItems] = useState<DatabaseRow[]>([]);


    const [pages, setPages] = useState(1);
    const [page, setPage] = useState(1);
    const refresh = () =>
    {
        if (props.store === undefined || props.department === undefined || props.employee === undefined)
        {
            Records.search({
                page,
                limit: props.limit ?? 10
            }).then(async result =>
            {
                setItems(await Promise.all(result.data.map(record => recordToDatabaseRow(record))));
                setPages(result.last_page);
            });
        } else
        {
            Records.search({
                employee: props.employee.employee_id,
                page,
                store: Stores.getStores().filter(store => store.name.toLowerCase() === props.store!.toLowerCase())[0].id,
                department: all_departments.findIndex(department => department.name.toLowerCase() === props.department!.toLowerCase()),
                limit: props.limit ?? 10
            }).then(async result =>
            {
                setItems(await Promise.all(result.data.map(record => recordToDatabaseRow(record))));
                setPages(result.last_page);
            });
        }
    };
    useEffect(() =>
    {
        refresh();
    }, [page, props.isRefreshing]);


    return (
        <>
            <ConfirmModal
                title={"Delete"}
                message={"Are you sure you want to delete this record?"}
                onClose={async (value) =>
                {
                    if (value)
                    {
                        if (deletingId !== null)
                        {
                            console.log(`Deleting ${deletingId}`);
                            await Records.delete(deletingId);
                            refresh();
                        }
                    }
                    setDeletingId(null);
                }}
                isOpen={deletingId !== null}
                onOpenChange={
                    (value) =>
                    {
                        if (!value)
                        {
                            setDeletingId(null);
                        }
                    }
                }
            />

            <EditRecordModal
                record={editingRecord}
                onClose={async value =>
                {
                    if (value === null) return;
                    console.log(`Saving`, value);
                    await Records.update(await databaseRowToRecord(value));
                    setEditingRecord(null);
                    refresh();
                }}
                isOpen={editingRecord !== null}
                onOpenChange={
                    value =>
                    {
                        if (!value)
                        {
                            setEditingRecord(null);
                        }
                    }
                }
            />

            <Table
                aria-label={"Database Table"}
                isHeaderSticky
                classNames={{
                    wrapper: "w-[90%] mx-auto mb-10 h-[80vh]",
                    tbody: cn(
                        `overflow-y-scroll relative`,
                    )

                }}
                bottomContent={
                    (() =>
                    {
                        if (pages === 1) return (<></>);
                        return (<div className={"flex w-full justify-center"}>
                            <Pagination
                                isCompact
                                showControls
                                showShadow
                                color={"primary"}
                                total={pages}
                                page={page}
                                onChange={(page) => setPage(page)}
                            />
                        </div>);
                    })()
                }
            >
                <TableHeader>
                    <TableColumn key={"store"} className={"max-w-8"}>Store</TableColumn>
                    <TableColumn key={"department"} className={"max-w-8"}>Department</TableColumn>
                    <TableColumn key={"description"}>Description</TableColumn>
                    <TableColumn key={"percent"}>Percent</TableColumn>
                    <TableColumn key={"mardens_price"}>Mardens Price</TableColumn>
                    <TableColumn key={"employee"}>Employee</TableColumn>
                    <TableColumn key={"quantity"}>Quantity</TableColumn>
                    <TableColumn key={"actions"}>Actions</TableColumn>
                </TableHeader>
                <TableBody items={items}>
                    {item => (
                        <TableRow key={item.id}>
                            {key =>
                            {
                                if (key === "mardens_price")
                                {
                                    return (<TableCell className={"text-primary"}>${(getKeyValue(item, key) as number).toFixed(2)}</TableCell>);
                                } else if (key === "percent")
                                {
                                    return (<TableCell className={"text-success"}>{getKeyValue(item, key) as number}%</TableCell>);
                                } else if (key === "employee")
                                {
                                    const employee = getKeyValue(item, key) as Employee;
                                    return (<TableCell className={"capitalize"}>{employee.first_name.toLowerCase()} {employee.last_name.toLowerCase()}</TableCell>);
                                } else if (key === "description")
                                {

                                    return (<TableCell className={"max-w-40 !truncate"}>{getKeyValue(item, key)}</TableCell>);
                                } else if (key === "actions")
                                {
                                    return (
                                        <TableCell className={"w-0"}>
                                            <div className={"w-auto flex flex-row"}>
                                                <Tooltip content={"Edit this record"}>
                                                    <Button
                                                        variant={"light"}
                                                        className={"max-w-[48px] w-[48px] min-w-[48px]"}
                                                        radius={"full"}
                                                        onClick={() =>
                                                        {
                                                            setEditingRecord(item);
                                                        }}
                                                    >
                                                        <EditIcon size={16} opacity={.5}/>
                                                    </Button>
                                                </Tooltip>
                                                <Tooltip content={"Delete this record"}>
                                                    <Button
                                                        variant={"light"}
                                                        color={"danger"}
                                                        className={"max-w-[48px] w-[48px] min-w-[48px]"}
                                                        radius={"full"}
                                                        onClick={() =>
                                                        {
                                                            setDeletingId(item.id);
                                                        }}
                                                    >
                                                        <TrashIcon size={16}/>
                                                    </Button>
                                                </Tooltip>
                                            </div>
                                        </TableCell>
                                    );
                                }
                                return (<TableCell className={"max-w-4 !truncate"}>{getKeyValue(item, key)}</TableCell>);
                            }}
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </>
    );


}
