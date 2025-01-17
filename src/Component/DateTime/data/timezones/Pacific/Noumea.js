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
                    ['1']: 1977,
                    ['2']: 1978,
                    ['3']: 1996,
                    ['4']: 1997,
                },
                ['_toYear']: {
                    ['1']: 1978,
                    ['2']: 1979,
                    ['3']: 1996,
                    ['4']: 1997,
                },
                ['_inMonth']: {
                    ['1']: 12,
                    ['2']: 2,
                    ['3']: 12,
                    ['4']: 3,
                },
                ['_on']: {
                    ['1']: '1 %s this sun',
                    ['2']: '27',
                    ['3']: '1',
                    ['4']: '2',
                },
                ['_at']: {
                    ['1']: '0:00',
                    ['2']: '0:00',
                    ['3']: '2:00s',
                    ['4']: '2:00s',
                },
                ['_save']: {
                    ['1']: 3600,
                    ['2']: 0,
                    ['3']: 3600,
                    ['4']: 0,
                },
                ['_letters']: {
                    ['1']: '-',
                    ['2']: '-',
                    ['3']: '-',
                    ['4']: '-',
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
                ['offset']: 39948,
                ['dst']: false,
                ['abbrev']: 'LMT',
                ['until']: -1829387148,
                ['format']: 'LMT',
            },
            {
                ['until']: Infinity,
                ['ruleSet']: o[0],
                ['offset']: 39600,
                ['abbrev']: '%z',
            },
        ],
        [
            0,
        ]
    );
})();
;
