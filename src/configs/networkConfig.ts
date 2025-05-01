import {getFullnodeUrl, SuiClient} from "@mysten/sui/client";
import {createNetworkConfig} from "@mysten/dapp-kit";
import {Transaction} from "@mysten/sui/transactions";
import {BrowserPasskeyProvider, BrowserPasswordProviderOptions} from "@mysten/sui/keypairs/passkey";

type Network = "mainnet" | "testnet";

const network = (process.env.NEXT_PUBLIC_NETWORK as Network) || "testnet";

const {networkConfig, useNetworkVariable, useNetworkVariables} = createNetworkConfig({
    mainnet: {
        url: getFullnodeUrl("mainnet"),
        variables: {
            Package: "",
            Publisher: "",
            UpgradeCap: ""
        }
    },
    testnet: {
        url: getFullnodeUrl("testnet"),
        variables: {
            Package: "0x2652b2eee932906d41b413ddb6151b1c6991602a224efd72879b5c05a86c0bbc",
            Publisher: "0x6e7ad6d466677fa4a2a605c8d562dae6534236489f1a0e224426de7670cd3add",
            UpgradeCap: "0x3617cbb55260484a9a6f67030a5fb8af3906441498e9d8972cc77fa4d706ff01"
        }
    }
});

const suiClient = new SuiClient({
    url: networkConfig[network].url
});

const passkeySavedName = "Luckcky Sui";
const authenticatorAttachment = "cross-platform";
let passkeyProvider: BrowserPasskeyProvider;
function getPasskeyProvider(rpId: string) {
    if (!passkeyProvider) {
        passkeyProvider = new BrowserPasskeyProvider(passkeySavedName, {
            rpName: passkeySavedName,
            rpId,
            authenticatorSelection: {
                authenticatorAttachment,
            },
        } as BrowserPasswordProviderOptions);
    }
    return passkeyProvider;
}

type NetworkVariables = ReturnType<typeof useNetworkVariables>;

function getNetworkVariables() {
    return networkConfig[network].variables;
}

function createBetterTxFactory<T extends Record<string, unknown>>(
    fn: (tx: Transaction, networkVariables: NetworkVariables, params: T) => Transaction
) {
    return (params: T) => {
        const tx = new Transaction();
        const networkVariables = getNetworkVariables();
        return fn(tx, networkVariables, params);
    }
}

export type {NetworkVariables};
export {
    network,
    useNetworkVariable,
    useNetworkVariables,
    networkConfig,
    suiClient,
    createBetterTxFactory,
    getPasskeyProvider,
}