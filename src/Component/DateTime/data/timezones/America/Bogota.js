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
                    ['1']: 5,
                    ['2']: 4,
                },
                ['_on']: {
                    ['1']: '3',
                    ['2']: '4',
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
                ['offset']: -17776,
                ['dst']: false,
                ['abbrev']: 'LMT',
                ['until']: -2707671824,
                ['format']: 'LMT',
            },
            {
                ['offset']: -17776,
                ['dst']: false,
                ['abbrev']: 'BMT',
                ['until']: -1739041424,
                ['format']: 'BMT',
            },
            {
                ['until']: Infinity,
                ['ruleSet']: o[0],
                ['offset']: -18000,
                ['abbrev']: '-05/-04',
            },
        ],
        []
    );
})();
;
