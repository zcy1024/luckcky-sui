'use client'

import {Button} from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {ScrollArea} from "@/components/ui/scroll-area";
import {FieldInfoType, FieldType} from "@/lib/contracts";
import {InfoDetail} from "@/components";
import {useCallback, useEffect, useState} from "react";
import {useAppSelector} from "@/store";

export default function ViewApplication({name, objectID, fields, applications, administrators}: {
    name: string,
    objectID: string,
    fields: FieldType[],
    applications: FieldInfoType[],
    administrators: string[]
}) {
    const account = useAppSelector(state => state.info.address);
    const [isAdmin, setIsAdmin] = useState<boolean>(false);
    const [open, setOpen] = useState<boolean>(false);
    const [approveList, setApproveList] = useState<string[]>([]);
    const [rejectList, setRejectList] = useState<string[]>([]);

    useEffect(() => {
        setIsAdmin(administrators.includes(account));
    }, [account, administrators]);

    const clearList = useCallback(() => {
        setApproveList([]);
        setRejectList([]);
    }, [])
    useEffect(() => {
        clearList();
    }, [objectID, clearList]);

    const changeApproveList = (key: string, isAdd: boolean) => {
        if (isAdd) {
            setApproveList([
                ...approveList,
                key
            ]);
        } else {
            setApproveList(approveList.filter(item => item !== key));
        }
    }
    const changeRejectList = (key: string, isAdd: boolean) => {
        if (isAdd) {
            setRejectList([
                ...rejectList,
                key
            ]);
        } else {
            setRejectList(rejectList.filter(item => item !== key));
        }
    }

    const handleConfirm = async () => {
        console.log(approveList);
        console.log(rejectList);
    }

    const getAllApplications = () => {
        return applications.map(application => application.sender + application.index);
    }

    const handleApproveAll = async () => {
        console.log(getAllApplications());
    }

    const handleRejectAll = async () => {
        console.log(getAllApplications());
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" className="cursor-pointer">View Application</Button>
            </DialogTrigger>
            <DialogContent className="max-h-[45rem] overflow-y-scroll">
                <DialogHeader>
                    <DialogTitle>{`${name}'s application`}</DialogTitle>
                    <DialogDescription>
                        {`PoolObjectID: ${objectID.slice(0, 6) + "..." + objectID.slice(-4)}`}<br/>
                        You can view all pending applications and administrators can operate it.
                    </DialogDescription>
                </DialogHeader>
                <ScrollArea>
                    <div className="flex flex-col gap-5 items-center">
                        {
                            applications.map((application, index) => {
                                return (
                                    <div key={index}>
                                        <InfoDetail
                                            objectID={objectID}
                                            fields={fields}
                                            application={application}
                                            isOdd={index % 2 === 1}
                                            changeApproveList={changeApproveList}
                                            changeRejectList={changeRejectList}
                                            isAdmin={isAdmin}
                                        ></InfoDetail>
                                    </div>
                                )
                            })
                        }
                    </div>
                </ScrollArea>
                <DialogFooter>
                    {
                        isAdmin &&
                        <>
                            <Button variant="default" className="cursor-pointer" disabled={approveList.length === 0 && rejectList.length === 0} onClick={handleConfirm}>Confirm Selection</Button>
                            <Button variant="default" className="cursor-pointer" disabled={applications.length === 0 || approveList.length > 0 || rejectList.length > 0} onClick={handleApproveAll}>Approve All</Button>
                            <Button variant="default" className="cursor-pointer" disabled={applications.length === 0 || approveList.length > 0 || rejectList.length > 0} onClick={handleRejectAll}>Reject All</Button>
                        </>
                    }
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}