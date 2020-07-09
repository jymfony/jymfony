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
                        o[7],
                    ],
                },
                ['_cache']: {
                    ['0']: {
                        ['1918']: [
                            o[2],
                        ],
                        ['1919']: [
                            o[2],
                        ],
                        ['1942']: [
                            o[2],
                            o[3],
                            o[4],
                            o[5],
                        ],
                        ['1943']: [
                            o[5],
                            o[6],
                            o[7],
                        ],
                        ['1966']: [
                            o[7],
                        ],
                        ['1967']: [
                            o[7],
                        ],
                        ['1970']: [
                            o[7],
                        ],
                        ['1971']: [
                            o[7],
                        ],
                    },
                },
            },
            'Jymfony.Component.DateTime.Internal.Rule': {
                ['_fromYear']: {
                    ['1']: 1917,
                    ['2']: 1917,
                    ['3']: 1942,
                    ['4']: 1942,
                    ['5']: 1942,
                    ['6']: 1943,
                    ['7']: 1943,
                },
                ['_toYear']: {
                    ['1']: 1917,
                    ['2']: 1917,
                    ['3']: 1942,
                    ['4']: 1942,
                    ['5']: 1942,
                    ['6']: 1944,
                    ['7']: 1943,
                },
                ['_inMonth']: {
                    ['1']: 1,
                    ['2']: 3,
                    ['3']: 1,
                    ['4']: 3,
                    ['5']: 9,
                    ['6']: 3,
                    ['7']: 10,
                },
                ['_on']: {
                    ['1']: '1',
                    ['2']: '25',
                    ['3']: '1',
                    ['4']: '29',
                    ['5']: '27',
                    ['6']: 'last sun %s',
                    ['7']: '3',
                },
                ['_at']: {
                    ['1']: '0:01',
                    ['2']: '2:00',
                    ['3']: '2:00',
                    ['4']: '2:00',
                    ['5']: '2:00',
                    ['6']: '2:00',
                    ['7']: '2:00',
                },
                ['_save']: {
                    ['1']: 3600,
                    ['2']: 0,
                    ['3']: 3600,
                    ['4']: 0,
                    ['5']: 3600,
                    ['6']: 0,
                    ['7']: 3600,
                },
                ['_letters']: {
                    ['1']: 'D',
                    ['2']: 'S',
                    ['3']: 'D',
                    ['4']: 'S',
                    ['5']: 'D',
                    ['6']: 'S',
                    ['7']: 'D',
                },
                ['_cache']: {
                    ['1']: {},
                    ['2']: {
                        ['1917']: [
                            '001917-03-25T02:00:00',
                            '001917-03-25T02:00:00',
                        ],
                    },
                    ['3']: {
                        ['1942']: [
                            '001942-01-01T02:00:00',
                            '001942-01-01T03:00:00',
                        ],
                    },
                    ['4']: {
                        ['1942']: [
                            '001942-03-29T02:00:00',
                            '001942-03-29T02:00:00',
                        ],
                    },
                    ['5']: {
                        ['1942']: [
                            '001942-09-27T02:00:00',
                            '001942-09-27T03:00:00',
                        ],
                    },
                    ['6']: {
                        ['1943']: [
                            '001943-03-28T02:00:00',
                            '001943-03-28T02:00:00',
                        ],
                    },
                    ['7']: {
                        ['1943']: [
                            '001943-10-03T02:00:00',
                            '001943-10-03T03:00:00',
                        ],
                    },
                },
            },
        },
        [
            {
                ['offset']: 31400,
                ['dst']: false,
                ['abbrev']: 'LMT',
                ['until']: -2364108200,
                ['format']: 'LMT',
            },
            {
                ['offset']: 32400,
                ['dst']: false,
                ['abbrev']: 'ACST',
                ['until']: -2230189200,
                ['format']: 'ACST',
            },
            {
                ['until']: Infinity,
                ['ruleSet']: o[0],
                ['offset']: 34200,
                ['abbrev']: 'AC%sT',
            },
        ],
        [
            0,
        ]
    );
})();
;
