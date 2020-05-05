export default (() => {
    let o;
    return Jymfony.Component.VarExporter.Internal.Hydrator.hydrate(
        o = [
            (new ReflectionClass('Jymfony.Component.DateTime.Internal.RuleSet')).newInstanceWithoutConstructor(),
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
                    ],
                },
                ['_cache']: {
                    ['0']: {},
                },
            },
            'Jymfony.Component.DateTime.Internal.Rule': {
                ['_fromYear']: {
                    ['1']: 1948,
                    ['2']: 1948,
                    ['3']: 1949,
                    ['4']: 1950,
                },
                ['_toYear']: {
                    ['1']: 1948,
                    ['2']: 1951,
                    ['3']: 1949,
                    ['4']: 1951,
                },
                ['_inMonth']: {
                    ['1']: 5,
                    ['2']: 9,
                    ['3']: 4,
                    ['4']: 5,
                },
                ['_on']: {
                    ['1']: '1 %s this sat',
                    ['2']: '8 %s this sat',
                    ['3']: '1 %s this sat',
                    ['4']: '1 %s this sat',
                },
                ['_at']: {
                    ['1']: '24:00',
                    ['2']: '25:00',
                    ['3']: '24:00',
                    ['4']: '24:00',
                },
                ['_save']: {
                    ['1']: 3600,
                    ['2']: 0,
                    ['3']: 3600,
                    ['4']: 3600,
                },
                ['_letters']: {
                    ['1']: 'D',
                    ['2']: 'S',
                    ['3']: 'D',
                    ['4']: 'D',
                },
                ['_cache']: {
                    ['1']: {},
                    ['2']: {},
                    ['3']: {},
                    ['4']: {},
                },
            },
        },
        [
            {
                ['offset']: 33539,
                ['dst']: false,
                ['abbrev']: 'LMT',
                ['until']: -2587712400,
                ['format']: 'LMT',
            },
            {
                ['until']: Infinity,
                ['ruleSet']: o[0],
                ['offset']: 32400,
                ['abbrev']: 'J%sT',
            },
        ],
        [
            0,
        ]
    );
})();
;
