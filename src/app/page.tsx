'use client'

import {Navigation} from "@/components";

export default function Home() {
    return (
        <div className="w-screen h-screen bg-[#f1f2f5] text-[#0a0e0f]">
            <div className="flex flex-col items-center">
                <Navigation />
                <div className="flex-1">test</div>
            </div>
        </div>
    );
}
