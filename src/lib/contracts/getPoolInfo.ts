'use client'

import {network, networkConfig, suiClient} from "@/configs/networkConfig";
import {EventId} from "@mysten/sui/client";

type InitFieldType = {
    field: string,
    encryption: boolean
}

type InitPoolInfoType = {
    fields: {
        id: {
            id: string,
        },
        name: string,
        description: string,
        creation_time: string,
        minimum_participants: string,
        number_of_winners: string,
        allows_multiple_awards: boolean,
        fields: {
            fields: InitFieldType
        }[],
        application: [],
        pool: [],
        confirmed: [],
        ended: boolean
    }
}

export type FieldType = {
    fieldName: string,
    needEncryption: boolean
}

export type PoolInfoType = {
    id: string,
    name: string,
    description: string,
    creationTime: string,
    minimumParticipants: number,
    numberOfWinners: number,
    allowsMultipleAwards: boolean,
    fields: FieldType[],
    application: [],
    pool: [],
    confirmed: [],
    ended: boolean
}

async function getPoolIDs(cursor: EventId | null | undefined): Promise<string[]> {
    const data = await suiClient.queryEvents({
        query: {
            MoveEventType: `${networkConfig[network].variables.Package}::lucky::LuckyPoolCreated`
        },
        cursor
    });
    const ids = data.data.map(event => (event.parsedJson as {
        pool_id: string
    }).pool_id);
    return !data.hasNextPage ? ids : ids.concat(await getPoolIDs(data.nextCursor));
}

async function getPool(id: string): Promise<PoolInfoType> {
    const data = await suiClient.getObject({
        id,
        options: {
            showContent: true
        }
    });
    const initInfo = data.data?.content as unknown as InitPoolInfoType;
    return {
        id: initInfo.fields.id.id,
        name: initInfo.fields.name,
        description: initInfo.fields.description,
        creationTime: new Date(Number(initInfo.fields.creation_time)).toLocaleString().replaceAll('/', '-'),
        minimumParticipants: Number(initInfo.fields.minimum_participants),
        numberOfWinners: Number(initInfo.fields.number_of_winners),
        allowsMultipleAwards: initInfo.fields.allows_multiple_awards,
        fields: initInfo.fields.fields.map(item => {
            return {
                fieldName: item.fields.field,
                needEncryption: item.fields.encryption
            };
        }).sort((field1, field2) => {
            if (field1.needEncryption !== field2.needEncryption)
                return field1.needEncryption ? 1 : -1;
            return field1.fieldName < field2.fieldName ? -1 : 1;
        }),
        application: [],
        pool: [],
        confirmed: [],
        ended: initInfo.fields.ended
    };
}

export default async function getPoolInfo(): Promise<[PoolInfoType[], PoolInfoType[]]> {
    const poolIDs = await getPoolIDs(null);
    const infos: PoolInfoType[] = [];
    const endInfos: PoolInfoType[] = [];
    for (let i = 0; i < poolIDs.length; i++) {
        const info = await getPool(poolIDs[i]);
        if (!info.ended)
            infos.push(info);
        else
            endInfos.push(info);
    }
    return [infos, endInfos];
}