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
                    ['1']: 1983,
                    ['2']: 1984,
                    ['3']: 1984,
                    ['4']: 1985,
                    ['5']: 1992,
                    ['6']: 1992,
                },
                ['_toYear']: {
                    ['1']: 1983,
                    ['2']: 1991,
                    ['3']: 1984,
                    ['4']: 1991,
                    ['5']: 1993,
                    ['6']: 1992,
                },
                ['_inMonth']: {
                    ['1']: 9,
                    ['2']: 3,
                    ['3']: 10,
                    ['4']: 9,
                    ['5']: 1,
                    ['6']: 10,
                },
                ['_on']: {
                    ['1']: '25',
                    ['2']: '23 %s this sun',
                    ['3']: '23',
                    ['4']: '23 %s this sun',
                    ['5']: '23 %s this sun',
                    ['6']: '23 %s this sun',
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
                    ['4']: 3600,
                    ['5']: 0,
                    ['6']: 3600,
                },
                ['_letters']: {
                    ['1']: '-',
                    ['2']: '-',
                    ['3']: '-',
                    ['4']: '-',
                    ['5']: '-',
                    ['6']: '-',
                },
            },
        },
        [
            {
                ['offset']: 40396,
                ['dst']: false,
                ['abbrev']: 'LMT',
                ['until']: -1829387596,
                ['format']: 'LMT',
            },
            {
                ['until']: Infinity,
                ['ruleSet']: o[0],
                ['offset']: 39600,
                ['abbrev']: '+11/+12',
            },
        ],
        []
    );
})();
;
