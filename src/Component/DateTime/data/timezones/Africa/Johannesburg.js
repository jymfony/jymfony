export default (() => {
    let o;
    return Jymfony.Component.VarExporter.Internal.Hydrator.hydrate(
        o = [
            (new ReflectionClass('Jymfony.Component.DateTime.Internal.RuleSet')).newInstanceWithoutConstructor(),
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
                    ],
                },
            },
            'Jymfony.Component.DateTime.Internal.Rule': {
                ['_fromYear']: {
                    ['1']: 1942,
                    ['2']: 1943,
                },
                ['_toYear']: {
                    ['1']: 1943,
                    ['2']: 1944,
                },
                ['_inMonth']: {
                    ['1']: 9,
                    ['2']: 3,
                },
                ['_on']: {
                    ['1']: '15 %s this sun',
                    ['2']: '15 %s this sun',
                },
                ['_at']: {
                    ['1']: '2:00',
                    ['2']: '2:00',
                },
                ['_save']: {
                    ['1']: 3600,
                    ['2']: 0,
                },
                ['_letters']: {
                    ['1']: '-',
                    ['2']: '-',
                },
            },
        },
        [
            {
                ['offset']: 6720,
                ['dst']: false,
                ['abbrev']: 'LMT',
                ['until']: -2458173120,
                ['format']: 'LMT',
            },
            {
                ['offset']: 5400,
                ['dst']: false,
                ['abbrev']: 'SAST',
                ['until']: -2109288600,
                ['format']: 'SAST',
            },
            {
                ['until']: Infinity,
                ['ruleSet']: o[0],
                ['offset']: 7200,
                ['abbrev']: 'SAST',
            },
        ],
        []
    );
})();
;
