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
                    ['1']: 1918,
                    ['2']: 1919,
                    ['3']: 1973,
                    ['4']: 1974,
                    ['5']: 1982,
                    ['6']: 1983,
                },
                ['_toYear']: {
                    ['1']: 1942,
                    ['2']: 1943,
                    ['3']: 1973,
                    ['4']: 1974,
                    ['5']: 1982,
                    ['6']: 1983,
                },
                ['_inMonth']: {
                    ['1']: 10,
                    ['2']: 2,
                    ['3']: 12,
                    ['4']: 2,
                    ['5']: 12,
                    ['6']: 2,
                },
                ['_on']: {
                    ['1']: '2 %s this sun',
                    ['2']: '9 %s this sun',
                    ['3']: '5',
                    ['4']: '9',
                    ['5']: '18',
                    ['6']: '12',
                },
                ['_at']: {
                    ['1']: '0:00',
                    ['2']: '0:00',
                    ['3']: '0:00',
                    ['4']: '0:00',
                    ['5']: '0:00',
                    ['6']: '0:00',
                },
                ['_save']: {
                    ['1']: 1800,
                    ['2']: 0,
                    ['3']: 3600,
                    ['4']: 0,
                    ['5']: 3600,
                    ['6']: 0,
                },
                ['_letters']: {
                    ['1']: '-0530',
                    ['2']: 'CST',
                    ['3']: 'CDT',
                    ['4']: 'CST',
                    ['5']: 'CDT',
                    ['6']: 'CST',
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
                ['offset']: -21168,
                ['dst']: false,
                ['abbrev']: 'LMT',
                ['until']: -1822500432,
                ['format']: 'LMT',
            },
            {
                ['until']: Infinity,
                ['ruleSet']: o[0],
                ['offset']: -21600,
                ['abbrev']: '%s',
            },
        ],
        [
            0,
        ]
    );
})();
;
