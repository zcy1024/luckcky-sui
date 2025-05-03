'use client'

import {Button} from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog";
import {FieldInfoType, FieldType} from "@/lib/contracts";
import {timeExchange} from "@/lib/utils";
import {Label} from "@/components/ui/label";
import {Input} from "@/components/ui/input";

export default function InfoDetail({objectID, fields, application, isOdd}: {objectID: string, fields: FieldType[], application: FieldInfoType, isOdd: boolean}) {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <div className={"flex gap-3 items-center w-96 overflow-x-scroll text-nowrap border border-[#041f4b] rounded-3xl px-2 py-1 cursor-pointer " + (!isOdd ? "bg-[#fff] hover:border-[#196ae3]" : "bg-[#f9f9f9] hover:border-[#35a1f7]")}>
                    {
                        fields.map((field, index) => {
                            const idx = application.keys.findIndex(key => key === field.fieldName);
                            const key = application.keys[idx];
                            const value = field.needEncryption ? "******" : application.values[idx];
                            return <span key={index}><b>{`${key}: `}</b>{value}</span>
                        })
                    }
                    <span><b>Apply Time: </b>{timeExchange(application.index)}</span>
                    <span><b>Sender: </b>{application.sender.slice(0, 6) + "..." + application.sender.slice(-4)}</span>
                </div>
            </DialogTrigger>
            <DialogContent className="max-h-[45rem] overflow-y-scroll">
                <DialogHeader>
                    <DialogTitle>Application</DialogTitle>
                    <DialogDescription>
                        Application details.
                    </DialogDescription>
                </DialogHeader>
                <div className="flex flex-col gap-5 items-center">
                    <div className="flex flex-col gap-2 items-start">
                        <Label>Apply Time</Label>
                        <Input size={36} value={timeExchange(application.index)} disabled />
                    </div>
                    <div className="flex flex-col gap-2 items-start">
                        <Label>Sender</Label>
                        <Input size={36} value={application.sender} disabled />
                    </div>
                    {
                        fields.map((field, index) => {
                            const idx = application.keys.findIndex(key => key === field.fieldName);
                            const key = application.keys[idx];
                            const value = field.needEncryption ? "******" : application.values[idx];
                            return (
                                <div key={index} className="flex flex-col gap-2 items-start">
                                    <Label>{key}</Label>
                                    <Input size={36} value={value} disabled />
                                </div>
                            )
                        })
                    }
                </div>
                <DialogFooter className="flex gap-3 items-center">
                    <Button variant="default" className="cursor-pointer">Edit</Button>
                    <Button variant="default" className="cursor-pointer">Decrypt</Button>
                    <Button variant="default" className="cursor-pointer">Approve</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}