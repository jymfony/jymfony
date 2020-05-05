export default (() => {
    let o;
    return Jymfony.Component.VarExporter.Internal.Hydrator.hydrate(
        o = [
            (new ReflectionClass('Jymfony.Component.DateTime.Internal.RuleSet')).newInstanceWithoutConstructor(),
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
                    ],
                },
            },
            'Jymfony.Component.DateTime.Internal.Rule': {
                ['_fromYear']: {
                    ['1']: 1978,
                    ['2']: 1979,
                    ['3']: 1979,
                },
                ['_toYear']: {
                    ['1']: 1978,
                    ['2']: 1991,
                    ['3']: 1990,
                },
                ['_inMonth']: {
                    ['1']: 11,
                    ['2']: 3,
                    ['3']: 10,
                },
                ['_on']: {
                    ['1']: '12',
                    ['2']: '1 %s this sun',
                    ['3']: 'last sun %s',
                },
                ['_at']: {
                    ['1']: '0:00',
                    ['2']: '0:00',
                    ['3']: '0:00',
                },
                ['_save']: {
                    ['1']: 1800,
                    ['2']: 0,
                    ['3']: 1800,
                },
                ['_letters']: {
                    ['1']: '-',
                    ['2']: '-',
                    ['3']: '-',
                },
            },
        },
        [
            {
                ['offset']: -38344,
                ['dst']: false,
                ['abbrev']: 'LMT',
                ['until']: -2177414456,
                ['format']: 'LMT',
            },
            {
                ['offset']: -37800,
                ['dst']: false,
                ['abbrev']: '-1030',
                ['until']: 279714600,
                ['format']: '-1030',
            },
            {
                ['until']: Infinity,
                ['ruleSet']: o[0],
                ['offset']: -36000,
                ['abbrev']: '-10/-0930',
            },
        ],
        []
    );
})();
;
