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
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";

export default function CreateLottery() {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline" className="cursor-pointer">Create Lottery</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Create Lottery</DialogTitle>
                    <DialogDescription>
                        You will serve as the initial administrator, creating a brand new draw.
                    </DialogDescription>
                </DialogHeader>
                <div className="flex flex-col gap-3 items-center">
                    <div className="flex gap-3 items-center">
                        <Label className="w-52">Name:</Label>
                        <Input type="text" placeholder="Name" />
                    </div>
                    <div className="flex gap-3 items-center">
                        <Label className="w-52">Description:</Label>
                        <Input type="text" placeholder="Description" />
                    </div>
                    <div className="flex gap-3 items-center">
                        <Label className="w-52">Winners:</Label>
                        <Input type="number" placeholder="Number Of Winners" />
                    </div>
                    <div className="flex gap-3 items-center">
                        <Label className="w-52">Minimum Amount:</Label>
                        <Input type="number" placeholder="Minimum Number Of Participants" />
                    </div>
                    <div className="flex gap-3 items-center">
                        <Label className="w-52">Repeat Award:</Label>
                        <Input placeholder="Repeat Winnings Allowed" />
                    </div>
                </div>
                <DialogFooter className="flex gap-3 items-center">
                    <span className="text-xs text-red-600">Error!!!</span>
                    <Button variant="default" className="cursor-pointer">Create</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}