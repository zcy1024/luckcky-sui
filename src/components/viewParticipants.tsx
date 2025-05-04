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
import {useAppSelector} from "@/store";
import {useEffect, useState} from "react";
import {ParticipantsInfoDetail} from "@/components/index";

export default function ViewParticipants({name, objectID, fields, participants, administrators}: {
    name: string,
    objectID: string,
    fields: FieldType[],
    participants: FieldInfoType[],
    administrators: string[]
}) {
    const account = useAppSelector(state => state.info.address);
    const [isAdmin, setIsAdmin] = useState<boolean>(false);

    useEffect(() => {
        setIsAdmin(administrators.includes(account));
    }, [account, administrators]);

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline" className="cursor-pointer">View Participants</Button>
            </DialogTrigger>
            <DialogContent className="max-h-[45rem] overflow-y-scroll">
                <DialogHeader>
                    <DialogTitle>{`${name}'s participants`}</DialogTitle>
                    <DialogDescription>
                        {`PoolObjectID: ${objectID.slice(0, 6) + "..." + objectID.slice(-4)}`}<br/>
                        You can view all participants and administrators can operate it.
                    </DialogDescription>
                </DialogHeader>
                <ScrollArea>
                    <div className="flex flex-col gap-5 items-center">
                        {
                            participants.map((participant, index) => {
                                return (
                                    <div key={index}>
                                        <ParticipantsInfoDetail
                                            objectID={objectID}
                                            fields={fields}
                                            participant={participant}
                                            isOdd={index % 2 === 1}
                                            isAdmin={isAdmin}
                                        ></ParticipantsInfoDetail>
                                    </div>
                                )
                            })
                        }
                    </div>
                </ScrollArea>
                <DialogFooter></DialogFooter>
            </DialogContent>
        </Dialog>
    );
}