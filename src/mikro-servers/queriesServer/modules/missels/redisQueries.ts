import { redisClient as client } from '../../redisClient';
import { SchemaFieldTypes, AggregateGroupByReducers, AggregateSteps } from 'redis';

// initial indexing
const setSchema = async () => {
    await client.connect();
    try {
        await client.ft.create('idx:missels', {

            '$.Rounds': {
                type: SchemaFieldTypes.NUMERIC,
                SORTABLE: true,
                AS: 'Rounds'
            },
            '$.missileAmount': {
                type: SchemaFieldTypes.NUMERIC,
                AS: 'missileAmount'
            },
            '$.creationTime': {
                type: SchemaFieldTypes.TEXT,
                SORTABLE: true,
                AS: 'creationTime'
            },
            '$.lastUpdateTime': {
                type: SchemaFieldTypes.TEXT,
                AS: 'lastUpdateTime'
            },
            '$.source': {
                type: SchemaFieldTypes.TEXT,
                SORTABLE: true,
                AS: 'source'
            },
            '$.destination': {
                type: SchemaFieldTypes.TEXT,
                SORTABLE: true,
                AS: 'destination'
            },

        }, {
            ON: 'JSON',
            PREFIX: 'country'
        });
    } catch (e) {
        if (e instanceof Error && e.message === 'Index already exists') {
            console.log('Index exists already, skipped creation.');
        } else {
            // Something went wrong, perhaps RediSearch isn't installed...
            console.error(e);
            process.exit(1);
        }
    }
    await client.quit();
}


export const getMaxCountry = async () => {
    const data = await client.ft.aggregate('idx:missels', '*', {
        STEPS: [{
            type: AggregateSteps.GROUPBY,
            properties: '@source',

            REDUCE:
            {
                type: AggregateGroupByReducers.SUM,
                property: '@missileAmount',
                AS: 'theMostAttacks'
            },
        },
        {
            type: AggregateSteps.SORTBY,
            BY: [{ BY: "@theMostAttacks", DIRECTION: 'DESC' }],
            MAX: 1
        },
        ]

    })
    return { source: data.results[0].source, theMostAttacks: data.results[0].theMostAttacks }
}

export const getMaxRoundsCountry = async () => {
    const data = await client.ft.aggregate('idx:missels', '*', {
        STEPS: [{
            type: AggregateSteps.GROUPBY,
            properties: '@source',

            REDUCE:
            {
                type: AggregateGroupByReducers.SUM,
                property: '@Rounds',
                AS: 'theMostRounds'
            },
        },
        {
            type: AggregateSteps.SORTBY,
            BY: [{ BY: "@theMostRounds", DIRECTION: 'DESC' }],
            MAX: 1
        },
        ]

    })
    return { source: data.results[0].source, theMostRounds: data.results[0].theMostRounds }
}


export const getFirstOrLastCountry = async (order: 'ASC' | 'DESC') => {
    const data = await client.ft.aggregate('idx:missels', '*', {
        LOAD: ['@source', '@creationTime'],
        STEPS: [
            {
                type: AggregateSteps.SORTBY,
                MAX: 1,
                BY: [{ BY: `@creationTime`, DIRECTION: `${order}` }],
            }
        ]

    })
    return { source: data.results[0].source, attackTime: data.results[0].creationTime }
}
export const getCountryList = async () => {
    const data = await client.ft.aggregate('idx:missels', '*', {
        LOAD: ['@source'],
        STEPS: [
            {
                type: AggregateSteps.GROUPBY,
                properties: '@source',

                REDUCE:
                {
                    type: AggregateGroupByReducers.COUNT_DISTINCT,
                    property: '@source',
                },
            }

        ]

    })
    const distinctCountries = data.results.map((item) => item.source);
    return distinctCountries

}

export const getTheMostOrTheLeastAttackedArea = async (order: 'ASC' | 'DESC') => {
    const data = await client.ft.aggregate('idx:missels', '*', {
        STEPS: [{
            type: AggregateSteps.GROUPBY,
            properties: '@destination',

            REDUCE:
            {
                type: AggregateGroupByReducers.SUM,
                property: '@missileAmount',
                AS: 'totalMisslesToArea'
            },
        },
        {
            type: AggregateSteps.SORTBY,
            BY: [{ BY: "@totalMisslesToArea", DIRECTION: `${order}` }],
            MAX: 1
        },
        ]

    })
    return { area: data.results[0].destination, totalMisslesToArea: data.results[0].totalMisslesToArea }
}


export const getAvgOfMisselsForArea = async () => {
    const data = await client.ft.aggregate('idx:missels', '*', {
        STEPS: [{
            type: AggregateSteps.GROUPBY,
            properties: '@destination',

            REDUCE: [
                {
                    type: AggregateGroupByReducers.SUM,
                    property: '@missileAmount',
                    AS: 'totalMisslesToArea'

                },
                {
                    type: AggregateGroupByReducers.SUM,
                    property: '@Rounds',
                    AS: 'totalRoundsToArea'

                }
            ]


        }, {
            type: AggregateSteps.APPLY,
            AS: 'areaAvgMissels',
            expression: "@totalMisslesToArea/@totalRoundsToArea"
        }

        ]

    })
    const areaAvgMissels = data.results.map((item) => { return { destination: item.destination, areaAvgMissels: Number(Number(item.areaAvgMissels).toFixed(2)) } });
    return areaAvgMissels
}


