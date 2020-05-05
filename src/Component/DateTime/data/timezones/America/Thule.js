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
                    ['1']: 1991,
                    ['2']: 1991,
                    ['3']: 1993,
                    ['4']: 1993,
                    ['5']: 2007,
                    ['6']: 2007,
                },
                ['_toYear']: {
                    ['1']: 1992,
                    ['2']: 1992,
                    ['3']: 2006,
                    ['4']: 2006,
                    ['5']: Infinity,
                    ['6']: Infinity,
                },
                ['_inMonth']: {
                    ['1']: 3,
                    ['2']: 9,
                    ['3']: 4,
                    ['4']: 10,
                    ['5']: 3,
                    ['6']: 11,
                },
                ['_on']: {
                    ['1']: 'last sun %s',
                    ['2']: 'last sun %s',
                    ['3']: '1 %s this sun',
                    ['4']: 'last sun %s',
                    ['5']: '8 %s this sun',
                    ['6']: '1 %s this sun',
                },
                ['_at']: {
                    ['1']: '2:00',
                    ['2']: '2:00',
                    ['3']: '2:00',
                    ['4']: '2:00',
                    ['5']: '2:00',
                    ['6']: '2:00',
                },
                ['_save']: {
                    ['1']: 3600,
                    ['2']: 0,
                    ['3']: 3600,
                    ['4']: 0,
                    ['5']: 3600,
                    ['6']: 0,
                },
                ['_letters']: {
                    ['1']: 'D',
                    ['2']: 'S',
                    ['3']: 'D',
                    ['4']: 'S',
                    ['5']: 'D',
                    ['6']: 'S',
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
                ['offset']: -16508,
                ['dst']: false,
                ['abbrev']: 'LMT',
                ['until']: -1686079492,
                ['format']: 'LMT',
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
