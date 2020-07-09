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
                ['_cache']: {
                    ['0']: {},
                },
            },
            'Jymfony.Component.DateTime.Internal.Rule': {
                ['_fromYear']: {
                    ['1']: 2005,
                    ['2']: 2004,
                },
                ['_toYear']: {
                    ['1']: Infinity,
                    ['2']: Infinity,
                },
                ['_inMonth']: {
                    ['1']: 3,
                    ['2']: 10,
                },
                ['_on']: {
                    ['1']: 'last sun %s',
                    ['2']: 'last sun %s',
                },
                ['_at']: {
                    ['1']: '1:00u',
                    ['2']: '1:00u',
                },
                ['_save']: {
                    ['1']: 7200,
                    ['2']: 0,
                },
                ['_letters']: {
                    ['1']: '+02',
                    ['2']: '+00',
                },
                ['_cache']: {
                    ['1']: {},
                    ['2']: {},
                },
            },
        },
        [
            {
                ['offset']: 0,
                ['dst']: false,
                ['abbrev']: '-00',
                ['until']: 1108166400,
                ['format']: '-00',
            },
            {
                ['until']: Infinity,
                ['ruleSet']: o[0],
                ['offset']: 0,
                ['abbrev']: '%s',
            },
        ],
        [
            0,
        ]
    );
})();
;
