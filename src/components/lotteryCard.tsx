'use client'

import {Button} from "@/components/ui/button";

export default function LotteryCard() {
    return (
        <div className="flex gap-10 items-center h-36 w-full p-2 bg-[#fff] rounded-xl border-2 hover:border-[#196ae3]">
            <div className="flex-1 flex flex-col items-start h-full">
                <h2 className="text-2xl font-bold subpixel-antialiased tracking-wider">Lottery Name</h2>
                <p className="flex-1 pt-3 pb-1 w-2/3 text-xs text-wrap">
                    Description
                </p>
                <div className="flex gap-2 items-center text-xs text-[#afb3b5]">
                    <span><b>ObjectID</b>: 0x665e...ad80</span>
                    <span><b>Time</b>: 2025-05-01 22:22:22</span>
                </div>
            </div>
            <div className="flex flex-col justify-end items-center gap-1 h-full">
                <span>number of winners: <b>100</b></span>
                <span>repeat winnings allowed: <b>true</b></span>
                <span>current number of participants: <b>100</b></span>
                <span>minimum number of participants: <b>100</b></span>
            </div>
            <div className="flex flex-col justify-end items-center gap-1 h-full">
                <Button variant="outline" className="cursor-pointer">Apply to join</Button>
                <Button variant="outline" className="cursor-pointer">View Application</Button>
                <Button variant="outline" className="cursor-pointer">View Participants</Button>
            </div>
        </div>
    );
}