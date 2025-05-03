import {getFullnodeUrl, SuiClient} from "@mysten/sui/client";
import {createNetworkConfig} from "@mysten/dapp-kit";
import {Transaction} from "@mysten/sui/transactions";
import {BrowserPasskeyProvider, BrowserPasswordProviderOptions, PasskeyKeypair} from "@mysten/sui/keypairs/passkey";
import {getAllowlistedKeyServers, SealClient, SessionKey} from "@mysten/seal";

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
            Package: "0x335a0fe42ec18ada24ac2639231025969c1603d950311a9c181d81500c5cb124",
            Publisher: "0x84021a9954357810ff6312176c12db31462fab5a643cf229712bb24346940184",
            UpgradeCap: "0xc871e3d71f8ee8f11ee6ed2bea527090d2d9c584d22ea0144473d7976e833610"
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

let keypair: PasskeyKeypair;
function getPasskeyKeypair(rpId: string, publicKeyStr: string) {
    if (keypair && keypair.getPublicKey().toRawBytes().toString() === publicKeyStr)
        return keypair;
    const publicKey = new Uint8Array(publicKeyStr.split(',').map(item => Number(item)));
    const passkeyProvider = getPasskeyProvider(rpId);
    keypair = new PasskeyKeypair(publicKey, passkeyProvider);
    return keypair;
}

const sealClient = new SealClient({
    suiClient,
    serverObjectIds: getAllowlistedKeyServers(network),
    verifyKeyServers: false,
});

let sessionKey: SessionKey;
async function getSessionKey(rpId: string, publicKeyStr: string) {
    // get passkey pair
    const keypair = getPasskeyKeypair(rpId, publicKeyStr);
    const address = keypair.toSuiAddress();
    // exist
    if (sessionKey && !sessionKey.isExpired() && sessionKey.getAddress() === address)
        return sessionKey;
    // new session
    sessionKey = new SessionKey({
        address,
        packageId: networkConfig[network].variables.Package,
        ttlMin: 30
    });
    // get message
    const message = sessionKey.getPersonalMessage();
    // sign message
    const {signature} = await keypair.signPersonalMessage(message);
    // set message
    await sessionKey.setPersonalMessageSignature(signature);
    return sessionKey;
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
    sealClient,
    getPasskeyKeypair,
    getSessionKey,
}