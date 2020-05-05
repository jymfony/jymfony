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
                    ['1']: 1936,
                    ['2']: 1937,
                    ['3']: 1954,
                    ['4']: 1954,
                    ['5']: 1978,
                    ['6']: 1978,
                },
                ['_toYear']: {
                    ['1']: 1936,
                    ['2']: 1937,
                    ['3']: 1954,
                    ['4']: 1954,
                    ['5']: 1978,
                    ['6']: 1978,
                },
                ['_inMonth']: {
                    ['1']: 11,
                    ['2']: 2,
                    ['3']: 4,
                    ['4']: 7,
                    ['5']: 3,
                    ['6']: 9,
                },
                ['_on']: {
                    ['1']: '1',
                    ['2']: '1',
                    ['3']: '12',
                    ['4']: '1',
                    ['5']: '22',
                    ['6']: '21',
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
            },
        },
        [
            {
                ['offset']: -57360,
                ['dst']: false,
                ['abbrev']: 'LMT',
                ['until']: -3944621040,
                ['format']: 'LMT',
            },
            {
                ['offset']: 29040,
                ['dst']: false,
                ['abbrev']: 'LMT',
                ['until']: -2229321840,
                ['format']: 'LMT',
            },
            {
                ['until']: -873273600,
                ['ruleSet']: o[0],
                ['offset']: 28800,
                ['abbrev']: 'P%sT',
            },
            {
                ['offset']: 32400,
                ['dst']: false,
                ['abbrev']: 'JST',
                ['until']: -794221200,
                ['format']: 'JST',
            },
            {
                ['until']: Infinity,
                ['ruleSet']: o[0],
                ['offset']: 28800,
                ['abbrev']: 'P%sT',
            },
        ],
        []
    );
})();
;
