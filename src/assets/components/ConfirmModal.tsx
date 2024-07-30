import {Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader} from "@nextui-org/react";

export interface ConfirmModalProps
{
    title: string;
    message: string;
    onClose: (value: boolean) => void;
    isOpen: boolean;
    onOpenChange: (value: boolean) => void;
    confirmText?: string;
    cancelText?: string;
}


export default function ConfirmModal(props: ConfirmModalProps)
{

    return (
        <>
            <Modal isOpen={props.isOpen} onOpenChange={props.onOpenChange}>
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader>{props.title}</ModalHeader>
                            <ModalBody>
                                <p>{props.message}</p>
                            </ModalBody>
                            <ModalFooter>
                                <div className={"flex flex-row gap-3 mt-5"}>
                                    <Button
                                        className={""}
                                        color={"danger"}
                                        radius={"full"}
                                        onClick={() =>
                                        {
                                            props.onClose(true);
                                            onClose();
                                        }}
                                    >
                                        {props.confirmText ?? "Confirm"}
                                    </Button>
                                    <Button
                                        variant={"light"}
                                        className={""}
                                        radius={"full"}
                                        onClick={() =>
                                        {
                                            props.onClose(false);
                                            onClose();
                                        }}
                                    >
                                        {props.cancelText ?? "Cancel"}
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