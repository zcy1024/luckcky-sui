'use client'

import {Button} from "@/components/ui/button";
import {findCommonPublicKey, PasskeyKeypair} from "@mysten/sui/keypairs/passkey";
import {getPasskeyProvider} from "@/configs/networkConfig";
import {useAppSelector, AppDispatch} from "@/store";
import {useDispatch} from "react-redux";
import {setAddress} from "@/store/modules/info";
import {Copy} from "lucide-react";

export default function PassKey() {
    const address = useAppSelector(state => state.info.address);
    const dispatch = useDispatch<AppDispatch>();

    const handleCreateWallet = async () => {
        try {
            const passkeyProvider = getPasskeyProvider(window.location.hostname);
            const passkey = await PasskeyKeypair.getPasskeyInstance(passkeyProvider);
            dispatch(setAddress(passkey.toSuiAddress()));
            localStorage.setItem("PublicKey", passkey.getPublicKey().toRawBytes().toString());
        } catch (err) {
            console.error(err);
        }
    }

    const handleLoadWallet = async () => {
        const passkeyProvider = getPasskeyProvider(window.location.hostname);

        const testMessage = new TextEncoder().encode("Hello Luckcky!");
        const possiblePks = await PasskeyKeypair.signAndRecover(
            passkeyProvider,
            testMessage
        );

        const testMessage2 = new TextEncoder().encode("Hello Luckcky Sui!");
        const possiblePks2 = await PasskeyKeypair.signAndRecover(
            passkeyProvider,
            testMessage2
        );

        const commonPk = findCommonPublicKey(possiblePks, possiblePks2);
        const passkey = new PasskeyKeypair(commonPk.toRawBytes(), passkeyProvider);
        dispatch(setAddress(passkey.toSuiAddress()));
        localStorage.setItem("PublicKey", passkey.getPublicKey().toRawBytes().toString());
    }

    return (
        <div className="flex gap-10 items-center">
            <div className="flex gap-3 items-center">
                <span>{address ? address.slice(0, 6) + "..." + address.slice(-4) : ""}</span>
                {
                    address &&
                    <Copy size={16} className="cursor-pointer active:text-[#196ae3]" onClick={() => navigator.clipboard.writeText(address)} />
                }
            </div>
            <Button variant="ghost" className="cursor-pointer" onClick={handleCreateWallet}>Create Passkey Wallet</Button>
            <Button variant="ghost" className="cursor-pointer" onClick={handleLoadWallet}>Load Passkey Wallet</Button>
        </div>
    );
}