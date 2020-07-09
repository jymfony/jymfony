export default (() => {
    let o;
    return Jymfony.Component.VarExporter.Internal.Hydrator.hydrate(
        o = [
            (new ReflectionClass('Jymfony.Component.DateTime.Internal.RuleSet')).newInstanceWithoutConstructor(),
            (new ReflectionClass('Jymfony.Component.DateTime.Internal.Rule')).newInstanceWithoutConstructor(),
            (new ReflectionClass('Jymfony.Component.DateTime.Internal.Rule')).newInstanceWithoutConstructor(),
        ],
        null,
        {
            'Jymfony.Component.DateTime.Internal.RuleSet': {
                ['_name']: {
                    ['0']: undefined,
                },
                ['_rules']: {
                    ['0']: [
                        o[1],
                        o[2],
                    ],
                },
                ['_cache']: {
                    ['0']: {},
                },
            },
            'Jymfony.Component.DateTime.Internal.Rule': {
                ['_fromYear']: {
                    ['1']: 2009,
                    ['2']: 2009,
                },
                ['_toYear']: {
                    ['1']: 2009,
                    ['2']: 2009,
                },
                ['_inMonth']: {
                    ['1']: 6,
                    ['2']: 12,
                },
                ['_on']: {
                    ['1']: '19',
                    ['2']: '31',
                },
                ['_at']: {
                    ['1']: '23:00',
                    ['2']: '24:00',
                },
                ['_save']: {
                    ['1']: 3600,
                    ['2']: 0,
                },
                ['_letters']: {
                    ['1']: '-',
                    ['2']: '-',
                },
                ['_cache']: {
                    ['1']: {},
                    ['2']: {},
                },
            },
        },
        [
            {
                ['offset']: 21700,
                ['dst']: false,
                ['abbrev']: 'LMT',
                ['until']: -2524543300,
                ['format']: 'LMT',
            },
            {
                ['offset']: 21200,
                ['dst']: false,
                ['abbrev']: 'HMT',
                ['until']: -891582800,
                ['format']: 'HMT',
            },
            {
                ['offset']: 23400,
                ['dst']: false,
                ['abbrev']: '+0630',
                ['until']: -872058600,
                ['format']: '+0630',
            },
            {
                ['offset']: 19800,
                ['dst']: false,
                ['abbrev']: '+0530',
                ['until']: -862637400,
                ['format']: '+0530',
            },
            {
                ['offset']: 23400,
                ['dst']: false,
                ['abbrev']: '+0630',
                ['until']: -576138600,
                ['format']: '+0630',
            },
            {
                ['offset']: 21600,
                ['dst']: false,
                ['abbrev']: '+06',
                ['until']: 1230746400,
                ['format']: '+06',
            },
            {
                ['until']: Infinity,
                ['ruleSet']: o[0],
                ['offset']: 21600,
                ['abbrev']: '+06/+07',
            },
        ],
        [
            0,
        ]
    );
})();
;
