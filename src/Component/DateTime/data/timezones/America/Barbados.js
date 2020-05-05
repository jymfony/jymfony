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
                    ],
                },
                ['_cache']: {
                    ['0']: {},
                },
            },
            'Jymfony.Component.DateTime.Internal.Rule': {
                ['_fromYear']: {
                    ['1']: 1977,
                    ['2']: 1977,
                    ['3']: 1978,
                    ['4']: 1979,
                    ['5']: 1980,
                },
                ['_toYear']: {
                    ['1']: 1977,
                    ['2']: 1978,
                    ['3']: 1980,
                    ['4']: 1979,
                    ['5']: 1980,
                },
                ['_inMonth']: {
                    ['1']: 6,
                    ['2']: 10,
                    ['3']: 4,
                    ['4']: 9,
                    ['5']: 9,
                },
                ['_on']: {
                    ['1']: '12',
                    ['2']: '1 %s this sun',
                    ['3']: '15 %s this sun',
                    ['4']: '30',
                    ['5']: '25',
                },
                ['_at']: {
                    ['1']: '2:00',
                    ['2']: '2:00',
                    ['3']: '2:00',
                    ['4']: '2:00',
                    ['5']: '2:00',
                },
                ['_save']: {
                    ['1']: 3600,
                    ['2']: 0,
                    ['3']: 3600,
                    ['4']: 0,
                    ['5']: 0,
                },
                ['_letters']: {
                    ['1']: 'D',
                    ['2']: 'S',
                    ['3']: 'D',
                    ['4']: 'S',
                    ['5']: 'S',
                },
                ['_cache']: {
                    ['1']: {},
                    ['2']: {},
                    ['3']: {},
                    ['4']: {},
                    ['5']: {},
                },
            },
        },
        [
            {
                ['offset']: -14309,
                ['dst']: false,
                ['abbrev']: 'LMT',
                ['until']: -1451678491,
                ['format']: 'LMT',
            },
            {
                ['offset']: -14309,
                ['dst']: false,
                ['abbrev']: 'BMT',
                ['until']: -1199217691,
                ['format']: 'BMT',
            },
            {
                ['until']: Infinity,
                ['ruleSet']: o[0],
                ['offset']: -14400,
                ['abbrev']: 'A%sT',
            },
        ],
        [
            0,
        ]
    );
})();
;
