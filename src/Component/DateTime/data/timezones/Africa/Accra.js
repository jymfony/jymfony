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
                    ['1']: 1920,
                    ['2']: 1920,
                },
                ['_toYear']: {
                    ['1']: 1942,
                    ['2']: 1942,
                },
                ['_inMonth']: {
                    ['1']: 9,
                    ['2']: 12,
                },
                ['_on']: {
                    ['1']: '1',
                    ['2']: '31',
                },
                ['_at']: {
                    ['1']: '0:00',
                    ['2']: '0:00',
                },
                ['_save']: {
                    ['1']: 1200,
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
                ['offset']: -52,
                ['dst']: false,
                ['abbrev']: 'LMT',
                ['until']: -1640995148,
                ['format']: 'LMT',
            },
            {
                ['until']: Infinity,
                ['ruleSet']: o[0],
                ['offset']: 0,
                ['abbrev']: 'GMT/+0020',
            },
        ],
        []
    );
})();
;
