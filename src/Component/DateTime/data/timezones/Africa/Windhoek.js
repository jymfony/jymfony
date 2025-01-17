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
                ['_cache']: {
                    ['0']: {},
                },
            },
            'Jymfony.Component.DateTime.Internal.Rule': {
                ['_fromYear']: {
                    ['1']: 1994,
                    ['2']: 1994,
                    ['3']: 1995,
                },
                ['_toYear']: {
                    ['1']: 1994,
                    ['2']: 2017,
                    ['3']: 2017,
                },
                ['_inMonth']: {
                    ['1']: 3,
                    ['2']: 9,
                    ['3']: 4,
                },
                ['_on']: {
                    ['1']: '21',
                    ['2']: '1 %s this sun',
                    ['3']: '1 %s this sun',
                },
                ['_at']: {
                    ['1']: '0:00',
                    ['2']: '2:00',
                    ['3']: '2:00',
                },
                ['_save']: {
                    ['1']: -3600,
                    ['2']: 0,
                    ['3']: -3600,
                },
                ['_letters']: {
                    ['1']: 'WAT',
                    ['2']: 'CAT',
                    ['3']: 'WAT',
                },
                ['_cache']: {
                    ['1']: {},
                    ['2']: {},
                    ['3']: {},
                },
            },
        },
        [
            {
                ['offset']: 4104,
                ['dst']: false,
                ['abbrev']: 'LMT',
                ['until']: -2458170504,
                ['format']: 'LMT',
            },
            {
                ['offset']: 5400,
                ['dst']: false,
                ['abbrev']: '%z',
                ['until']: -2109288600,
                ['format']: '%z',
            },
            {
                ['offset']: 7200,
                ['dst']: false,
                ['abbrev']: 'SAST',
                ['until']: -860976000,
                ['format']: 'SAST',
            },
            {
                ['until']: -845251200,
                ['ruleSet']: undefined,
                ['offset']: 7200,
                ['abbrev']: 'SAST',
            },
            {
                ['offset']: 7200,
                ['dst']: false,
                ['abbrev']: 'SAST',
                ['until']: 637970400,
                ['format']: 'SAST',
            },
            {
                ['until']: Infinity,
                ['ruleSet']: o[0],
                ['offset']: 7200,
                ['abbrev']: '%s',
            },
        ],
        [
            0,
        ]
    );
})();
;
