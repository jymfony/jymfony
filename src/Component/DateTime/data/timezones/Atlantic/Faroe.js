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
            },
            'Jymfony.Component.DateTime.Internal.Rule': {
                ['_fromYear']: {
                    ['1']: 1977,
                    ['2']: 1977,
                    ['3']: 1978,
                    ['4']: 1979,
                    ['5']: 1981,
                    ['6']: 1996,
                },
                ['_toYear']: {
                    ['1']: 1980,
                    ['2']: 1977,
                    ['3']: 1978,
                    ['4']: 1995,
                    ['5']: Infinity,
                    ['6']: Infinity,
                },
                ['_inMonth']: {
                    ['1']: 4,
                    ['2']: 9,
                    ['3']: 10,
                    ['4']: 9,
                    ['5']: 3,
                    ['6']: 10,
                },
                ['_on']: {
                    ['1']: '1 %s this sun',
                    ['2']: 'last sun %s',
                    ['3']: '1',
                    ['4']: 'last sun %s',
                    ['5']: 'last sun %s',
                    ['6']: 'last sun %s',
                },
                ['_at']: {
                    ['1']: '1:00u',
                    ['2']: '1:00u',
                    ['3']: '1:00u',
                    ['4']: '1:00u',
                    ['5']: '1:00u',
                    ['6']: '1:00u',
                },
                ['_save']: {
                    ['1']: 3600,
                    ['2']: 0,
                    ['3']: 0,
                    ['4']: 0,
                    ['5']: 3600,
                    ['6']: 0,
                },
                ['_letters']: {
                    ['1']: 'S',
                    ['2']: '-',
                    ['3']: '-',
                    ['4']: '-',
                    ['5']: 'S',
                    ['6']: '-',
                },
            },
        },
        [
            {
                ['offset']: -1624,
                ['dst']: false,
                ['abbrev']: 'LMT',
                ['until']: -1955748776,
                ['format']: 'LMT',
            },
            {
                ['offset']: 0,
                ['dst']: false,
                ['abbrev']: 'WET',
                ['until']: 347155200,
                ['format']: 'WET',
            },
            {
                ['until']: Infinity,
                ['ruleSet']: o[0],
                ['offset']: 0,
                ['abbrev']: 'WE%sT',
            },
        ],
        []
    );
})();
;
