'use client'

import {createBetterTxFactory} from "@/configs/networkConfig";
import {FieldType} from "@/lib/contracts/getPoolInfo";

export const applyTx = createBetterTxFactory<{
    poolID: string,
    addrAndTime: string,
    fields: FieldType[],
    values: string[]
}>((tx, networkVariables, params) => {
    return tx;
})