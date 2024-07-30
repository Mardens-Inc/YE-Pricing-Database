import {Button, cn, getKeyValue, Pagination, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow, Tooltip} from "@nextui-org/react";
import {EditIcon, TrashIcon} from "./Icons.tsx";
import {useMemo, useState} from "react";
import ConfirmModal from "./ConfirmModal.tsx";
import EditRecordModal from "./EditRecordModal.tsx";
import {Employee} from "../ts/useEmployeeList.ts";

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
    store: string;
    department: string;
    employee: Employee;
}


export default function DatabaseListComponent(props: DatabaseListProps)
{
    const [deletingId, setDeletingId] = useState<number | null>(null);
    const [editingRecord, setEditingRecord] = useState<DatabaseRow | null>(null);
    const databaseRows: DatabaseRow[] = [];

    // generate test data
    for (let i = 0; i < 100; i++)
    {
        databaseRows.push({
            id: i,
            store: props.store,
            tag_number: 798,
            department: props.department,
            percent: parseFloat(((i * 0.01)).toFixed(2)),
            mardens_price: parseFloat((i * 0.5 + i).toFixed(2)),
            quantity: i,
            description: "This is a test description",
            employee: props.employee,
            created_at: "2021-07-01",
            updated_at: "2021-07-01"
        });
    }


    const itemsPerPage = 10;
    const pages = Math.ceil(databaseRows.length / itemsPerPage);
    const [page, setPage] = useState(1);

    const items = useMemo(() =>
    {
        const start = (page - 1) * itemsPerPage;
        const end = start + itemsPerPage;
        return databaseRows.slice(start, end);
    }, [page, databaseRows]);

    return (
        <>
            <ConfirmModal
                title={"Delete"}
                message={"Are you sure you want to delete this record?"}
                onClose={(value) =>
                {
                    if (value)
                    {
                        console.log(`Deleting ${deletingId}`);
                        setDeletingId(null);
                    }
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
                onClose={value =>
                {
                    console.log(`Saving ${JSON.stringify(value)}`);
                    setEditingRecord(null);
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
                        `overflow-y-scroll`
                    )

                }}
                bottomContent={
                    <div className={"flex w-full justify-center"}>
                        <Pagination
                            isCompact
                            showControls
                            showShadow
                            color={"primary"}
                            total={pages}
                            page={page}
                            onChange={(page) => setPage(page)}


                        />
                    </div>
                }
            >
                <TableHeader>
                    <TableColumn key={"store"}>Store</TableColumn>
                    <TableColumn key={"department"}>Department</TableColumn>
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
                                    return (<TableCell className={"text-success"}>{((getKeyValue(item, key) as number) * 100).toFixed(2)}%</TableCell>);
                                } else if (key === "employee")
                                {
                                    const employee = getKeyValue(item, key) as Employee;
                                    return (<TableCell className={"capitalize"}>{employee.first_name.toLowerCase()} {employee.last_name.toLowerCase()}</TableCell>);
                                }
                                if (key === "actions")
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
                                return (<TableCell>{getKeyValue(item, key)}</TableCell>);
                            }}
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </>
    );


}
