'use client'

import {Navigation} from "@/components";
import {useDispatch} from "react-redux";
import {AppDispatch} from "@/store";
import {useEffect} from "react";
import {refreshAll} from "@/store/modules/info";

export default function Home() {
    const dispatch = useDispatch<AppDispatch>();
    useEffect(() => {
        dispatch(refreshAll(localStorage.getItem("PublicKey")));
    }, [dispatch]);

    return (
        <div className="w-screen h-screen bg-[#f1f2f5] text-[#0a0e0f]">
            <div className="flex flex-col items-center">
                <Navigation/>
                <div className="flex-1">test</div>
            </div>
        </div>
    );
}
