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
                                    <Input
                                        label={"Tag Number"}
                                        value={record.tag_number.toString()}
                                        onChange={(e) => setRecord({...record, tag_number: parseInt(e.target.value)})}
                                        type={"number"}
                                    />
                                    <Autocomplete
                                        label={"Department"}
                                        onChange={(e) => setRecord({...record, department: e.target.value})}
                                        defaultItems={all_departments}
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
                                        value={(record.percent * 100).toFixed(2)}
                                        type={"number"}
                                        onChange={(e) => setRecord({...record, percent: parseFloat(e.target.value) / 100})}
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