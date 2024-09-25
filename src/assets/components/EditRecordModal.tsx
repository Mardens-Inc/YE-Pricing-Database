import {DatabaseRow} from "./DatabaseListComponent.tsx";
import {Autocomplete, AutocompleteItem, Avatar, Button, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Textarea} from "@nextui-org/react";
import {useState} from "react";
import {all_departments} from "../pages/DepartmentsPage.tsx";

interface EditRecordModalProps
{
    record: DatabaseRow | null;
    onClose: (value: DatabaseRow | null) => void;
    isOpen: boolean;
    onOpenChange: (value: boolean) => void;
}


export default function EditRecordModal(props: EditRecordModalProps)
{
    if (props.record === null)
    {
        return <></>;
    }

    const [record, setRecord] = useState<DatabaseRow>(props.record);
    return (
        <>
            <Modal isOpen={props.isOpen} onOpenChange={props.onOpenChange}>
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader>Edit Record</ModalHeader>
                            <ModalBody>
                                <div className={"flex flex-col gap-3"}>
                                    <div id={"readonly-data"} className={"opacity-50 w-full flex flex-col"}>
                                        <div className={"flex flex-row gap-1 w-full"}>
                                            Employee:
                                            <span className={"font-semibold capitalize"}>{`${record.employee.first_name} ${record.employee.last_name}`.toLowerCase()}</span>
                                        </div>
                                        <div className={"flex flex-row gap-1 w-full"}>
                                            Store:
                                            <span className={"font-semibold capitalize"}>{record.store}</span>
                                        </div>
                                        <div className={"flex flex-row gap-1 w-full"}>
                                            Created At:
                                            <span className={"font-semibold"}>{
                                                (() =>
                                                {
                                                    const date = new Date(record.created_at);
                                                    return (`${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`);
                                                })()
                                            }</span>
                                        </div>
                                        {record.created_at !== record.updated_at &&
                                            <div className={"flex flex-row gap-1 w-full mr-auto"}>
                                                Updated At:
                                                <span className={"font-semibold"}>{
                                                    (() =>
                                                    {
                                                        const date = new Date(record.updated_at);
                                                        return (`${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`);
                                                    })()}</span>
                                            </div>
                                        }
                                    </div>
                                    <Input
                                        label={"Tag Number"}
                                        value={record.tag_number.toString()}
                                        onChange={(e) => setRecord({...record, tag_number: parseInt(e.target.value)})}
                                        type={"number"}
                                    />
                                    <Autocomplete
                                        label={"Department"}
                                        onChange={(e) => setRecord({...record, department: e.target.value})}
                                        onSelectionChange={(e) =>
                                        {
                                            console.log(e)
                                            setRecord({...record, department: e as string});
                                        }}
                                        defaultItems={all_departments}
                                        defaultSelectedKey={all_departments.filter(dept => dept.name.toLowerCase() === record.department.toLowerCase())[0].name}
                                    >
                                        {({name, image}) => (
                                            <AutocompleteItem key={name} textValue={name}>
                                                <div className={"flex flex-row items-center"}>
                                                    <Avatar src={image} alt={name} size={"sm"}/>
                                                    <span className={"ml-3"}>{name}</span>
                                                </div>
                                            </AutocompleteItem>
                                        )}

                                    </Autocomplete>
                                    <Input
                                        label={"Percent"}
                                        value={record.percent.toString()}
                                        type={"number"}
                                        onChange={(e) => setRecord({...record, percent: parseFloat(e.target.value)})}
                                    />
                                    <Input
                                        label={"Mardens Price or Tag Price"}
                                        value={record.mardens_price.toString()}
                                        type={"number"}
                                        onChange={(e) => setRecord({...record, mardens_price: parseFloat(e.target.value)})}
                                    />
                                    <Input
                                        label={"Quantity"}
                                        value={record.quantity.toString()}
                                        type={"number"}
                                        onChange={(e) => setRecord({...record, quantity: parseInt(e.target.value)})}
                                    />
                                    <Textarea
                                        label={"Description"}
                                        value={record.description}
                                        onChange={(e) => setRecord({...record, description: e.target.value})}
                                    />
                                </div>
                            </ModalBody>
                            <ModalFooter>
                                <div className={"flex flex-row gap-3 mt-5"}>
                                    <Button
                                        className={""}
                                        radius={"full"}
                                        onClick={() =>
                                        {
                                            props.onClose(record);
                                            onClose();
                                        }}
                                    >
                                        Save
                                    </Button>
                                    <Button
                                        color={"danger"}
                                        variant={"light"}
                                        className={""}
                                        radius={"full"}
                                        onClick={() =>
                                        {
                                            props.onClose(null);
                                            onClose();
                                        }}
                                    >
                                        Cancel
                                    </Button>
                                </div>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </>
    );

}