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
                    ['1']: 1992,
                    ['2']: 1993,
                },
                ['_toYear']: {
                    ['1']: 1992,
                    ['2']: 1993,
                },
                ['_inMonth']: {
                    ['1']: 11,
                    ['2']: 2,
                },
                ['_on']: {
                    ['1']: '28',
                    ['2']: '5',
                },
                ['_at']: {
                    ['1']: '0:00',
                    ['2']: '0:00',
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
                ['offset']: -21504,
                ['dst']: false,
                ['abbrev']: 'LMT',
                ['until']: -1230746496,
                ['format']: 'LMT',
            },
            {
                ['offset']: -18000,
                ['dst']: false,
                ['abbrev']: '-05',
                ['until']: 504939600,
                ['format']: '-05',
            },
            {
                ['until']: Infinity,
                ['ruleSet']: o[0],
                ['offset']: -21600,
                ['abbrev']: '-06/-05',
            },
        ],
        []
    );
})();
;
