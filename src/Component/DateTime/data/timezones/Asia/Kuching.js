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
                    ['0']: {
                        ['1941']: [
                            o[1],
                            o[2],
                        ],
                        ['1942']: [
                            o[2],
                        ],
                    },
                },
            },
            'Jymfony.Component.DateTime.Internal.Rule': {
                ['_fromYear']: {
                    ['1']: 1935,
                    ['2']: 1935,
                },
                ['_toYear']: {
                    ['1']: 1941,
                    ['2']: 1941,
                },
                ['_inMonth']: {
                    ['1']: 9,
                    ['2']: 12,
                },
                ['_on']: {
                    ['1']: '14',
                    ['2']: '14',
                },
                ['_at']: {
                    ['1']: '0:00',
                    ['2']: '0:00',
                },
                ['_save']: {
                    ['1']: 1200,
                    ['2']: 0,
                },
                ['_letters']: {
                    ['1']: '-',
                    ['2']: '-',
                },
                ['_cache']: {
                    ['1']: {
                        ['1941']: [
                            '001941-09-14T00:00:00',
                            '001941-09-14T00:20:00',
                        ],
                    },
                    ['2']: {
                        ['1941']: [
                            '001941-12-14T00:00:00',
                            '001941-12-14T00:00:00',
                        ],
                    },
                },
            },
        },
        [
            {
                ['offset']: 26480,
                ['dst']: false,
                ['abbrev']: 'LMT',
                ['until']: -1383463280,
                ['format']: 'LMT',
            },
            {
                ['offset']: 27000,
                ['dst']: false,
                ['abbrev']: '%z',
                ['until']: -1167636600,
                ['format']: '%z',
            },
            {
                ['until']: -879667200,
                ['ruleSet']: o[0],
                ['offset']: 28800,
                ['abbrev']: '%z',
            },
            {
                ['offset']: 32400,
                ['dst']: false,
                ['abbrev']: '%z',
                ['until']: -767005200,
                ['format']: '%z',
            },
            {
                ['offset']: 28800,
                ['dst']: false,
                ['abbrev']: '%z',
                ['until']: Infinity,
                ['format']: '%z',
            },
        ],
        [
            0,
        ]
    );
})();
;
