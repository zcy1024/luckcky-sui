'use client'

import {createBetterTxFactory} from "@/configs/networkConfig";

export const approveTx = createBetterTxFactory<{
    poolID: string,
    keys: string[]
}>((tx, networkVariables, params) => {
    tx.moveCall({
        package: networkVariables.Package,
        module: "lucky",
        function: "approve",
        arguments: [
            tx.object(params.poolID),
            tx.pure.vector('string', params.keys)
        ]
    });
    return tx;
})