export default (() => {
    let o;
    return Jymfony.Component.VarExporter.Internal.Hydrator.hydrate(
        o = [
            (new ReflectionClass('Jymfony.Component.DateTime.Internal.RuleSet')).newInstanceWithoutConstructor(),
            (new ReflectionClass('Jymfony.Component.DateTime.Internal.Rule')).newInstanceWithoutConstructor(),
            (new ReflectionClass('Jymfony.Component.DateTime.Internal.Rule')).newInstanceWithoutConstructor(),
            (new ReflectionClass('Jymfony.Component.DateTime.Internal.Rule')).newInstanceWithoutConstructor(),
            (new ReflectionClass('Jymfony.Component.DateTime.Internal.Rule')).newInstanceWithoutConstructor(),
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
                        o[3],
                        o[4],
                        o[5],
                        o[6],
                    ],
                },
                ['_cache']: {
                    ['0']: {},
                },
            },
            'Jymfony.Component.DateTime.Internal.Rule': {
                ['_fromYear']: {
                    ['1']: 1973,
                    ['2']: 1974,
                    ['3']: 1983,
                    ['4']: 1984,
                    ['5']: 1992,
                    ['6']: 1992,
                },
                ['_toYear']: {
                    ['1']: 1973,
                    ['2']: 1974,
                    ['3']: 1991,
                    ['4']: 1991,
                    ['5']: 1993,
                    ['6']: 1992,
                },
                ['_inMonth']: {
                    ['1']: 12,
                    ['2']: 3,
                    ['3']: 9,
                    ['4']: 3,
                    ['5']: 1,
                    ['6']: 10,
                },
                ['_on']: {
                    ['1']: '22',
                    ['2']: '30',
                    ['3']: '22 %s this sat',
                    ['4']: '22 %s this sat',
                    ['5']: '22 %s this sat',
                    ['6']: '22 %s this sat',
                },
                ['_at']: {
                    ['1']: '12:00u',
                    ['2']: '12:00u',
                    ['3']: '24:00',
                    ['4']: '24:00',
                    ['5']: '24:00',
                    ['6']: '24:00',
                },
                ['_save']: {
                    ['1']: 3600,
                    ['2']: 0,
                    ['3']: 3600,
                    ['4']: 0,
                    ['5']: 0,
                    ['6']: 3600,
                },
                ['_letters']: {
                    ['1']: '-',
                    ['2']: '-',
                    ['3']: '-',
                    ['4']: '-',
                    ['5']: '-',
                    ['6']: '-',
                },
                ['_cache']: {
                    ['1']: {},
                    ['2']: {},
                    ['3']: {},
                    ['4']: {},
                    ['5']: {},
                    ['6']: {},
                },
            },
        },
        [
            {
                ['offset']: 40396,
                ['dst']: false,
                ['abbrev']: 'LMT',
                ['until']: -1829387596,
                ['format']: 'LMT',
            },
            {
                ['until']: Infinity,
                ['ruleSet']: o[0],
                ['offset']: 39600,
                ['abbrev']: '+11/+12',
            },
        ],
        [
            0,
        ]
    );
})();
;
