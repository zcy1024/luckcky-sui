'use client'

import {createSlice, ThunkDispatch, UnknownAction} from "@reduxjs/toolkit";
import {Dispatch} from "react";
import {PasskeyKeypair} from "@mysten/sui/keypairs/passkey";
import {getPasskeyProvider} from "@/configs/networkConfig";
import {getBalance, getPoolInfo, PoolInfoType} from "@/lib/contracts";

export type initialStateType = {
    address: string,
    balance: string,
    publicKeyStr: string,
    poolInfos: PoolInfoType[],
    endedPoolInfos: PoolInfoType[]
}

const initialState: initialStateType = {
    address: "",
    balance: "0",
    publicKeyStr: "",
    poolInfos: [],
    endedPoolInfos: []
}

const infoStore = createSlice({
    name: "info",
    initialState,
    reducers: {
        setAddress(state, action: {payload: string}) {
            state.address = action.payload;
        },
        setBalance(state, action: {payload: string}) {
            state.balance = action.payload;
        },
        setPublicKeyStr(state, action: {payload: string}) {
            state.publicKeyStr = action.payload;
        },
        setPoolInfos(state, action: {payload: [PoolInfoType[], PoolInfoType[]]}) {
            state.poolInfos = action.payload[0];
            state.endedPoolInfos = action.payload[1];
        }
    }
});

const refreshAll = (publicKeyStr: string | null | undefined) => {
    return async (dispatch: ThunkDispatch<{
        info: initialStateType
    }, undefined, UnknownAction> & Dispatch<UnknownAction>) => {
        if (publicKeyStr) {
            const publicKey = new Uint8Array(publicKeyStr.split(',').map(item => Number(item)));
            const keypair = new PasskeyKeypair(publicKey, getPasskeyProvider(window.location.hostname));
            dispatch(setAddress(keypair.toSuiAddress()));
            dispatch(setBalance(await getBalance(keypair.toSuiAddress())));
            dispatch(setPublicKeyStr(publicKeyStr));
            dispatch(setPoolInfos(await getPoolInfo()));
            return;
        }
        dispatch(setAddress(""));
        dispatch(setBalance("0"));
        dispatch(setPublicKeyStr(""));
        dispatch(setPoolInfos([[], []]));
    }
}

const refreshBalance = (owner: string) => {
    return async (dispatch: ThunkDispatch<{
        info: initialStateType
    }, undefined, UnknownAction> & Dispatch<UnknownAction>) => {
        dispatch(setBalance(await getBalance(owner)));
    }
}

const refreshPoolInfos = () => {
    return async (dispatch: ThunkDispatch<{
        info: initialStateType
    }, undefined, UnknownAction> & Dispatch<UnknownAction>) => {
        dispatch(setPoolInfos(await getPoolInfo()));
    }
}

const {
    setAddress,
    setBalance,
    setPublicKeyStr,
    setPoolInfos,
} = infoStore.actions;

export {
    setAddress,
    setBalance,
    setPublicKeyStr,
    setPoolInfos,
};

export {
    refreshAll,
    refreshBalance,
    refreshPoolInfos,
};

export default infoStore.reducer;