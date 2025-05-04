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
import {decrypt, FieldInfoType, FieldType, isNeedEncryption} from "@/lib/contracts";
import {timeExchange} from "@/lib/utils";
import {Label} from "@/components/ui/label";
import {Input} from "@/components/ui/input";
import {useEffect, useState} from "react";
import {useAppSelector} from "@/store";

export default function InfoDetail({objectID, fields, application, isOdd}: {objectID: string, fields: FieldType[], application: FieldInfoType, isOdd: boolean}) {
    const publicKeyStr = useAppSelector(state => state.info.publicKeyStr);
    const [needEncryption, setNeedEncryption] = useState<boolean>(false);
    const [values, setValues] = useState<string[]>([]);
    const [decrypted, setDecrypted] = useState<boolean>(false);
    useEffect(() => {
        setNeedEncryption(isNeedEncryption(fields));
        setValues(fields.map(field => {
            const fieldName = field.fieldName;
            const index = application.keys.findIndex(key => key === fieldName);
            return application.values[index];
        }));
        setDecrypted(false);
    }, [fields, application]);

    const handleDecrypt = async () => {
        const decryptedValues = await decrypt(publicKeyStr, objectID, fields, values);
        setValues(decryptedValues);
        setDecrypted(true);
    }

    return (
        <Dialog>
            <DialogTrigger asChild>
                <div className={"flex gap-3 items-center w-96 overflow-x-scroll text-nowrap border border-[#041f4b] rounded-3xl px-2 py-1 cursor-pointer " + (!isOdd ? "bg-[#fff] hover:border-[#196ae3]" : "bg-[#f9f9f9] hover:border-[#35a1f7]")}>
                    {
                        fields.map((field, index) => {
                            return (
                                <span key={index}>
                                    <b>{`${field.fieldName}: `}</b>
                                    {field.needEncryption ? "******" : values[index]}
                                </span>
                            )
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
                            return (
                                <div key={index} className="flex flex-col gap-2 items-start">
                                    <Label>{field.fieldName}</Label>
                                    <Input size={36} value={field.needEncryption && !decrypted ? "******" : values[index]} disabled />
                                </div>
                            )
                        })
                    }
                </div>
                <DialogFooter className="flex gap-3 items-center">
                    <Button variant="default" className="cursor-pointer">Edit</Button>
                    {
                        needEncryption &&
                        <Button variant="default" className="cursor-pointer" disabled={!needEncryption || decrypted} onClick={handleDecrypt}>Decrypt</Button>
                    }
                    <Button variant="default" className="cursor-pointer">Approve</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}