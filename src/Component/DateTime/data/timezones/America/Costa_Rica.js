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
                    ['1']: 1979,
                    ['2']: 1979,
                    ['3']: 1991,
                    ['4']: 1991,
                    ['5']: 1992,
                },
                ['_toYear']: {
                    ['1']: 1980,
                    ['2']: 1980,
                    ['3']: 1992,
                    ['4']: 1991,
                    ['5']: 1992,
                },
                ['_inMonth']: {
                    ['1']: 2,
                    ['2']: 6,
                    ['3']: 1,
                    ['4']: 7,
                    ['5']: 3,
                },
                ['_on']: {
                    ['1']: 'last sun %s',
                    ['2']: '1 %s this sun',
                    ['3']: '15 %s this sat',
                    ['4']: '1',
                    ['5']: '15',
                },
                ['_at']: {
                    ['1']: '0:00',
                    ['2']: '0:00',
                    ['3']: '0:00',
                    ['4']: '0:00',
                    ['5']: '0:00',
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
                ['offset']: -20173,
                ['dst']: false,
                ['abbrev']: 'LMT',
                ['until']: -2524501427,
                ['format']: 'LMT',
            },
            {
                ['offset']: -20173,
                ['dst']: false,
                ['abbrev']: 'SJMT',
                ['until']: -1545071027,
                ['format']: 'SJMT',
            },
            {
                ['until']: Infinity,
                ['ruleSet']: o[0],
                ['offset']: -21600,
                ['abbrev']: 'C%sT',
            },
        ],
        [
            0,
        ]
    );
})();
;
