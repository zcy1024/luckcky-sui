'use client'

import {createSlice, ThunkDispatch, UnknownAction} from "@reduxjs/toolkit";
import {Dispatch} from "react";
import {PasskeyKeypair} from "@mysten/sui/keypairs/passkey";
import {getPasskeyProvider} from "@/configs/networkConfig";

export type initialStateType = {
    address: string,
}

const initialState: initialStateType = {
    address: "",
}

const infoStore = createSlice({
    name: "info",
    initialState,
    reducers: {
        setAddress(state, action: {payload: string}) {
            state.address = action.payload;
        },
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
        }
    }
}

const {
    setAddress,
} = infoStore.actions;

export {
    setAddress,
};

export {refreshAll};

export default infoStore.reducer;