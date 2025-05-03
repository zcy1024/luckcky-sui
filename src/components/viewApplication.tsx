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

export default function ViewApplication({name, objectID, fields, applications}: {name: string, objectID: string, fields: FieldType[], applications: FieldInfoType[]}) {
    return (
        <Dialog>
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
                                    <div key={index}><InfoDetail objectID={objectID} fields={fields} application={application} isOdd={index % 2 === 1}></InfoDetail></div>
                                )
                            })
                        }
                    </div>
                </ScrollArea>
                <DialogFooter>
                    {/*<Button variant="default" className="cursor-pointer">Decrypt</Button>*/}
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}