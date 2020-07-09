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
                    ['1']: 1987,
                    ['2']: 1987,
                    ['3']: 2006,
                    ['4']: 2006,
                },
                ['_toYear']: {
                    ['1']: 1988,
                    ['2']: 1988,
                    ['3']: 2006,
                    ['4']: 2006,
                },
                ['_inMonth']: {
                    ['1']: 5,
                    ['2']: 9,
                    ['3']: 5,
                    ['4']: 8,
                },
                ['_on']: {
                    ['1']: '1 %s this sun',
                    ['2']: 'last sun %s',
                    ['3']: '1 %s this sun',
                    ['4']: '1 %s this mon',
                },
                ['_at']: {
                    ['1']: '0:00',
                    ['2']: '0:00',
                    ['3']: '0:00',
                    ['4']: '0:00',
                },
                ['_save']: {
                    ['1']: 3600,
                    ['2']: 0,
                    ['3']: 3600,
                    ['4']: 0,
                },
                ['_letters']: {
                    ['1']: 'D',
                    ['2']: 'S',
                    ['3']: 'D',
                    ['4']: 'S',
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
                ['offset']: -20932,
                ['dst']: false,
                ['abbrev']: 'LMT',
                ['until']: -1538503868,
                ['format']: 'LMT',
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
