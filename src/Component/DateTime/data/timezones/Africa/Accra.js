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
                ['_cache']: {
                    ['0']: {
                        ['1941']: [
                            o[3],
                            o[2],
                            o[4],
                        ],
                        ['1942']: [
                            o[4],
                            o[2],
                        ],
                    },
                },
            },
            'Jymfony.Component.DateTime.Internal.Rule': {
                ['_fromYear']: {
                    ['1']: 1919,
                    ['2']: 1920,
                    ['3']: 1920,
                    ['4']: 1940,
                    ['5']: 1950,
                    ['6']: 1951,
                },
                ['_toYear']: {
                    ['1']: 1919,
                    ['2']: 1942,
                    ['3']: 1939,
                    ['4']: 1941,
                    ['5']: 1955,
                    ['6']: 1956,
                },
                ['_inMonth']: {
                    ['1']: 11,
                    ['2']: 1,
                    ['3']: 9,
                    ['4']: 5,
                    ['5']: 9,
                    ['6']: 1,
                },
                ['_on']: {
                    ['1']: '24',
                    ['2']: '1',
                    ['3']: '1',
                    ['4']: '1',
                    ['5']: '1',
                    ['6']: '1',
                },
                ['_at']: {
                    ['1']: '0:00',
                    ['2']: '2:00',
                    ['3']: '2:00',
                    ['4']: '2:00',
                    ['5']: '2:00',
                    ['6']: '2:00',
                },
                ['_save']: {
                    ['1']: 1200,
                    ['2']: 0,
                    ['3']: 1200,
                    ['4']: 1200,
                    ['5']: 1800,
                    ['6']: 0,
                },
                ['_letters']: {
                    ['1']: '+0020',
                    ['2']: 'GMT',
                    ['3']: '+0020',
                    ['4']: '+0020',
                    ['5']: '+0030',
                    ['6']: 'GMT',
                },
                ['_cache']: {
                    ['1']: {},
                    ['2']: {
                        ['1941']: [
                            '001941-01-01T02:00:00',
                            '001941-01-01T02:00:00',
                        ],
                        ['1942']: [
                            '001942-01-01T02:00:00',
                            '001942-01-01T02:00:00',
                        ],
                    },
                    ['3']: {
                        ['1939']: [
                            '001939-09-01T02:00:00',
                            '001939-09-01T02:20:00',
                        ],
                    },
                    ['4']: {
                        ['1941']: [
                            '001941-05-01T02:00:00',
                            '001941-05-01T02:20:00',
                        ],
                    },
                    ['5']: {},
                    ['6']: {},
                },
            },
        },
        [
            {
                ['offset']: -52,
                ['dst']: false,
                ['abbrev']: 'LMT',
                ['until']: -1709337548,
                ['format']: 'LMT',
            },
            {
                ['until']: -880329600,
                ['ruleSet']: o[0],
                ['offset']: 0,
                ['abbrev']: '%s',
            },
            {
                ['offset']: 1800,
                ['dst']: false,
                ['abbrev']: '+0030',
                ['until']: -756952200,
                ['format']: '+0030',
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
