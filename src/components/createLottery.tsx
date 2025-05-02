'use client'

import {zodResolver} from "@hookform/resolvers/zod";
import {useForm} from "react-hook-form";
import {z} from "zod";
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
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {useState} from "react";
import {Checkbox} from "@/components/ui/checkbox";

const formSchemaObj = {
    Name: z.string().min(1, {
        message: "Name is required."
    }).max(20, {
        message: "Name is no more than 20 characters."
    }),
    Description: z.string().min(1, {
        message: "Description is required."
    }).max(100, {
        message: "Description is no more than 100 characters."
    }),
    Winners: z.coerce.number().gte(1, {
        message: "Winners are required."
    }),
    "Minimum Amount": z.coerce.number().gte(1, {
        message: "Minimum Amount is required."
    }),
    "Repeat Award": z.boolean().default(false).optional(),
};

export default function CreateLottery() {
    const [formSchema, setFormSchema] = useState(z.object(formSchemaObj)
        .refine(obj => obj["Minimum Amount"] >= obj.Winners, {
        message: "Must satisfy `Minimum Amount` >= `Winners`", path: ["Minimum Amount"]
    }));
    const [form, setForm] = useState(useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            Name: "",
            Description: "",
            Winners: 1,
            "Minimum Amount": 1,
            "Repeat Award": false
        }
    }));
    const onSubmit = (values: z.infer<typeof formSchema>) => {
        console.log(values);
    }

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline" className="cursor-pointer">Create Lottery</Button>
            </DialogTrigger>
            <DialogContent>
                <Form {...form}>
                    <DialogHeader>
                        <DialogTitle>Create Lottery</DialogTitle>
                        <DialogDescription>
                            You will serve as the initial administrator, creating a brand new draw.
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-5 items-center">
                        <FormField
                            control={form.control}
                            name="Name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Name" {...field} size={36} />
                                    </FormControl>
                                    <FormDescription>
                                        This is the name of the lottery pool.
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="Description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Description</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Description" {...field} size={36} />
                                    </FormControl>
                                    <FormDescription>
                                        This is the description of the lottery pool.
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="Winners"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Winners</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Number Of Winners" {...field} size={36} />
                                    </FormControl>
                                    <FormDescription>
                                        This is the final number of winners.
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="Minimum Amount"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Minimum Amount:</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Minimum Number Of Participants" {...field} size={36} />
                                    </FormControl>
                                    <FormDescription>
                                        This is the minimum number of participants.
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="Repeat Award"
                            render={({ field }) => (
                                <FormItem>
                                    <div className="flex gap-3 items-center">
                                        <FormLabel>Repeat Award:</FormLabel>
                                        <FormControl>
                                            <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                                        </FormControl>
                                    </div>
                                    <FormDescription className="w-76">
                                        Is it allowed for the same person to win the award repeatedly?
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <DialogFooter className="self-end items-center">
                            <Button variant="default" type="submit" className="cursor-pointer">Create</Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}