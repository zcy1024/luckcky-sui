'use client'

import {createSlice, ThunkDispatch, UnknownAction} from "@reduxjs/toolkit";
import {Dispatch} from "react";
import {PasskeyKeypair} from "@mysten/sui/keypairs/passkey";
import {getPasskeyProvider} from "@/configs/networkConfig";
import {getBalance} from "@/lib/contracts";

export type initialStateType = {
    address: string,
    balance: string,
}

const initialState: initialStateType = {
    address: "",
    balance: "0",
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
            return;
        }
        dispatch(setAddress(""));
        dispatch(setBalance("0"));
    }
}

const refreshBalance = (owner: string) => {
    return async (dispatch: ThunkDispatch<{
        info: initialStateType
    }, undefined, UnknownAction> & Dispatch<UnknownAction>) => {
        dispatch(setBalance(await getBalance(owner)));
    }
}

const {
    setAddress,
    setBalance,
} = infoStore.actions;

export {
    setAddress,
    setBalance,
};

export {
    refreshAll,
    refreshBalance,
};

export default infoStore.reducer;