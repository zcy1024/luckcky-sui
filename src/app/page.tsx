'use client'

import {CreateLottery, LotteryCard, Navigation} from "@/components";
import {useDispatch} from "react-redux";
import {AppDispatch, useAppSelector} from "@/store";
import {useEffect, useState} from "react";
import {refreshAll} from "@/store/modules/info";
import {ScrollArea} from "@/components/ui/scroll-area";
import {Input} from "@/components/ui/input";
import {Search} from "lucide-react";

export default function Home() {
    const poolInfos = useAppSelector(state => state.info.poolInfos);
    const endedPoolInfos = useAppSelector(state => state.info.endedPoolInfos);
    const dispatch = useDispatch<AppDispatch>();
    useEffect(() => {
        dispatch(refreshAll(localStorage.getItem("PublicKey")));
    }, [dispatch]);

    const [objectID, setObjectID] = useState<string>();
    const handleSearch = () => {
        if (!objectID)
            return;
        console.log(objectID);
        console.log(poolInfos);
        console.log(endedPoolInfos);
    }

    return (
        <div className="w-screen h-screen bg-[#f1f2f5] text-[#0a0e0f]">
            <div className="flex flex-col items-center w-full h-full">
                <Navigation/>
                <div className="flex-1 w-full min-w-[1024px] px-32 xl:px-64 2xl:px-96 py-10 overflow-y-scroll">
                    <ScrollArea className="w-full h-full border-2 border-[#041f4b] rounded-2xl">
                        <div className="flex flex-col items-center">
                            <div className="relative flex flex-col gap-5 items-center h-36 w-full p-2 bg-[#f9f9f9] rounded-xl border-2 hover:border-[#35a1f7]">
                                <h1 className="text-5xl font-bold subpixel-antialiased tracking-wider">Luckcky Sui</h1>
                                <div className="flex gap-3 items-center">
                                    <Input type="text" placeholder="ObjectID" size={50} onChange={(e) => setObjectID(e.target.value)} />
                                    <Search size={24} className="cursor-pointer text-[#afb3b5] active:text-[#196ae3]" onClick={handleSearch} />
                                </div>
                                <div className="absolute bottom-1 right-1">
                                    <CreateLottery />
                                </div>
                            </div>
                            <LotteryCard />
                        </div>
                    </ScrollArea>
                </div>
            </div>
        </div>
    );
}
