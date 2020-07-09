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
            (new ReflectionClass('Jymfony.Component.DateTime.Internal.RuleSet')).newInstanceWithoutConstructor(),
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
                    ['8']: undefined,
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
                    ['8']: [
                        o[9],
                        o[10],
                        o[11],
                        o[12],
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
                    ['8']: {
                        ['1991']: [
                            o[10],
                            o[11],
                            o[12],
                        ],
                        ['1992']: [
                            o[11],
                            o[12],
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
                    ['9']: 1971,
                    ['10']: 1972,
                    ['11']: 1989,
                    ['12']: 1990,
                },
                ['_toYear']: {
                    ['1']: 1917,
                    ['2']: 1917,
                    ['3']: 1942,
                    ['4']: 1942,
                    ['5']: 1942,
                    ['6']: 1944,
                    ['7']: 1943,
                    ['9']: 1971,
                    ['10']: 1972,
                    ['11']: 1991,
                    ['12']: 1992,
                },
                ['_inMonth']: {
                    ['1']: 1,
                    ['2']: 3,
                    ['3']: 1,
                    ['4']: 3,
                    ['5']: 9,
                    ['6']: 3,
                    ['7']: 10,
                    ['9']: 10,
                    ['10']: 2,
                    ['11']: 10,
                    ['12']: 3,
                },
                ['_on']: {
                    ['1']: '1',
                    ['2']: '25',
                    ['3']: '1',
                    ['4']: '29',
                    ['5']: '27',
                    ['6']: 'last sun %s',
                    ['7']: '3',
                    ['9']: 'last sun %s',
                    ['10']: 'last sun %s',
                    ['11']: 'last sun %s',
                    ['12']: '1 %s this sun',
                },
                ['_at']: {
                    ['1']: '0:01',
                    ['2']: '2:00',
                    ['3']: '2:00',
                    ['4']: '2:00',
                    ['5']: '2:00',
                    ['6']: '2:00',
                    ['7']: '2:00',
                    ['9']: '2:00s',
                    ['10']: '2:00s',
                    ['11']: '2:00s',
                    ['12']: '2:00s',
                },
                ['_save']: {
                    ['1']: 3600,
                    ['2']: 0,
                    ['3']: 3600,
                    ['4']: 0,
                    ['5']: 3600,
                    ['6']: 0,
                    ['7']: 3600,
                    ['9']: 3600,
                    ['10']: 0,
                    ['11']: 3600,
                    ['12']: 0,
                },
                ['_letters']: {
                    ['1']: 'D',
                    ['2']: 'S',
                    ['3']: 'D',
                    ['4']: 'S',
                    ['5']: 'D',
                    ['6']: 'S',
                    ['7']: 'D',
                    ['9']: 'D',
                    ['10']: 'S',
                    ['11']: 'D',
                    ['12']: 'S',
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
                    ['9']: {},
                    ['10']: {
                        ['1972']: [
                            '001972-02-27T02:00:00',
                            '001972-02-27T02:00:00',
                        ],
                    },
                    ['11']: {
                        ['1991']: [
                            '001991-10-27T02:00:00',
                            '001991-10-27T03:00:00',
                        ],
                    },
                    ['12']: {
                        ['1991']: [
                            '001991-03-03T02:00:00',
                            '001991-03-03T02:00:00',
                        ],
                        ['1992']: [
                            '001992-03-01T02:00:00',
                            '001992-03-01T02:00:00',
                        ],
                    },
                },
            },
        },
        [
            {
                ['offset']: 36728,
                ['dst']: false,
                ['abbrev']: 'LMT',
                ['until']: -2366791928,
                ['format']: 'LMT',
            },
            {
                ['until']: 31496400,
                ['ruleSet']: o[0],
                ['offset']: 36000,
                ['abbrev']: 'AE%sT',
            },
            {
                ['until']: Infinity,
                ['ruleSet']: o[8],
                ['offset']: 36000,
                ['abbrev']: 'AE%sT',
            },
        ],
        [
            0,
            8,
        ]
    );
})();
;
