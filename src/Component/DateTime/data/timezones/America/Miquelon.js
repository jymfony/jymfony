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
                        o[8],
                        o[9],
                        o[10],
                    ],
                },
                ['_cache']: {
                    ['0']: {
                        ['1918']: [
                            o[1],
                            o[2],
                        ],
                        ['1919']: [
                            o[2],
                        ],
                        ['1932']: [
                            o[2],
                        ],
                        ['1933']: [
                            o[2],
                        ],
                        ['1939']: [
                            o[2],
                        ],
                        ['1940']: [
                            o[2],
                        ],
                        ['1945']: [
                            o[3],
                            o[4],
                            o[5],
                        ],
                        ['1946']: [
                            o[5],
                        ],
                        ['1947']: [
                            o[5],
                        ],
                        ['1952']: [
                            o[5],
                        ],
                        ['1953']: [
                            o[5],
                        ],
                        ['1969']: [
                            o[5],
                        ],
                        ['1970']: [
                            o[5],
                        ],
                        ['1975']: [
                            o[5],
                            o[6],
                            o[7],
                        ],
                        ['1976']: [
                            o[5],
                            o[6],
                            o[7],
                        ],
                        ['1992']: [
                            o[6],
                            o[7],
                            o[8],
                        ],
                        ['1993']: [
                            o[6],
                            o[7],
                            o[8],
                        ],
                        ['1998']: [
                            o[6],
                            o[7],
                            o[8],
                        ],
                        ['1999']: [
                            o[6],
                            o[7],
                            o[8],
                        ],
                        ['2000']: [
                            o[6],
                            o[7],
                            o[8],
                        ],
                        ['2005']: [
                            o[6],
                            o[7],
                            o[8],
                        ],
                        ['2006']: [
                            o[6],
                            o[7],
                            o[8],
                        ],
                        ['2014']: [
                            o[7],
                            o[9],
                            o[10],
                        ],
                        ['2015']: [
                            o[7],
                            o[9],
                            o[10],
                        ],
                        ['2019']: [
                            o[7],
                            o[9],
                            o[10],
                        ],
                        ['2020']: [
                            o[7],
                            o[9],
                            o[10],
                        ],
                        ['2021']: [
                            o[7],
                            o[9],
                            o[10],
                        ],
                    },
                },
            },
            'Jymfony.Component.DateTime.Internal.Rule': {
                ['_fromYear']: {
                    ['1']: 1918,
                    ['2']: 1918,
                    ['3']: 1942,
                    ['4']: 1945,
                    ['5']: 1945,
                    ['6']: 1974,
                    ['7']: 1974,
                    ['8']: 1987,
                    ['9']: 2007,
                    ['10']: 2007,
                },
                ['_toYear']: {
                    ['1']: 1918,
                    ['2']: 1918,
                    ['3']: 1942,
                    ['4']: 1945,
                    ['5']: 1945,
                    ['6']: 1986,
                    ['7']: 2006,
                    ['8']: 2006,
                    ['9']: Infinity,
                    ['10']: Infinity,
                },
                ['_inMonth']: {
                    ['1']: 4,
                    ['2']: 10,
                    ['3']: 2,
                    ['4']: 8,
                    ['5']: 9,
                    ['6']: 4,
                    ['7']: 10,
                    ['8']: 4,
                    ['9']: 3,
                    ['10']: 11,
                },
                ['_on']: {
                    ['1']: '14',
                    ['2']: '27',
                    ['3']: '9',
                    ['4']: '14',
                    ['5']: '30',
                    ['6']: 'last sun %s',
                    ['7']: 'last sun %s',
                    ['8']: '1 %s this sun',
                    ['9']: '8 %s this sun',
                    ['10']: '1 %s this sun',
                },
                ['_at']: {
                    ['1']: '2:00',
                    ['2']: '2:00',
                    ['3']: '2:00',
                    ['4']: '23:00u',
                    ['5']: '2:00',
                    ['6']: '2:00',
                    ['7']: '2:00',
                    ['8']: '2:00',
                    ['9']: '2:00',
                    ['10']: '2:00',
                },
                ['_save']: {
                    ['1']: 3600,
                    ['2']: 0,
                    ['3']: 3600,
                    ['4']: 3600,
                    ['5']: 0,
                    ['6']: 3600,
                    ['7']: 0,
                    ['8']: 3600,
                    ['9']: 3600,
                    ['10']: 0,
                },
                ['_letters']: {
                    ['1']: 'D',
                    ['2']: 'S',
                    ['3']: 'W',
                    ['4']: 'P',
                    ['5']: 'S',
                    ['6']: 'D',
                    ['7']: 'S',
                    ['8']: 'D',
                    ['9']: 'D',
                    ['10']: 'S',
                },
                ['_cache']: {
                    ['1']: {
                        ['1918']: [
                            '001918-04-14T02:00:00',
                            '001918-04-14T03:00:00',
                        ],
                    },
                    ['2']: {
                        ['1918']: [
                            '001918-10-27T02:00:00',
                            '001918-10-27T02:00:00',
                        ],
                    },
                    ['3']: {
                        ['1942']: [
                            '001942-02-09T02:00:00',
                            '001942-02-09T03:00:00',
                        ],
                    },
                    ['4']: {
                        ['1945']: [
                            '001945-08-14T23:00:00u',
                            '001945-08-15T00:00:00',
                        ],
                    },
                    ['5']: {
                        ['1945']: [
                            '001945-09-30T02:00:00',
                            '001945-09-30T02:00:00',
                        ],
                    },
                    ['6']: {
                        ['1975']: [
                            '001975-04-27T02:00:00',
                            '001975-04-27T03:00:00',
                        ],
                        ['1976']: [
                            '001976-04-25T02:00:00',
                            '001976-04-25T03:00:00',
                        ],
                        ['1986']: [
                            '001986-04-27T02:00:00',
                            '001986-04-27T03:00:00',
                        ],
                    },
                    ['7']: {
                        ['1975']: [
                            '001975-10-26T02:00:00',
                            '001975-10-26T02:00:00',
                        ],
                        ['1976']: [
                            '001976-10-31T02:00:00',
                            '001976-10-31T02:00:00',
                        ],
                        ['1992']: [
                            '001992-10-25T02:00:00',
                            '001992-10-25T02:00:00',
                        ],
                        ['1993']: [
                            '001993-10-31T02:00:00',
                            '001993-10-31T02:00:00',
                        ],
                        ['1998']: [
                            '001998-10-25T02:00:00',
                            '001998-10-25T02:00:00',
                        ],
                        ['1999']: [
                            '001999-10-31T02:00:00',
                            '001999-10-31T02:00:00',
                        ],
                        ['2000']: [
                            '002000-10-29T02:00:00',
                            '002000-10-29T02:00:00',
                        ],
                        ['2005']: [
                            '002005-10-30T02:00:00',
                            '002005-10-30T02:00:00',
                        ],
                        ['2006']: [
                            '002006-10-29T02:00:00',
                            '002006-10-29T02:00:00',
                        ],
                    },
                    ['8']: {
                        ['1992']: [
                            '001992-04-05T02:00:00',
                            '001992-04-05T03:00:00',
                        ],
                        ['1993']: [
                            '001993-04-04T02:00:00',
                            '001993-04-04T03:00:00',
                        ],
                        ['1998']: [
                            '001998-04-05T02:00:00',
                            '001998-04-05T03:00:00',
                        ],
                        ['1999']: [
                            '001999-04-04T02:00:00',
                            '001999-04-04T03:00:00',
                        ],
                        ['2000']: [
                            '002000-04-02T02:00:00',
                            '002000-04-02T03:00:00',
                        ],
                        ['2005']: [
                            '002005-04-03T02:00:00',
                            '002005-04-03T03:00:00',
                        ],
                        ['2006']: [
                            '002006-04-02T02:00:00',
                            '002006-04-02T03:00:00',
                        ],
                    },
                    ['9']: {
                        ['2014']: [
                            '002014-03-09T02:00:00',
                            '002014-03-09T03:00:00',
                        ],
                        ['2015']: [
                            '002015-03-08T02:00:00',
                            '002015-03-08T03:00:00',
                        ],
                        ['2019']: [
                            '002019-03-10T02:00:00',
                            '002019-03-10T03:00:00',
                        ],
                        ['2020']: [
                            '002020-03-08T02:00:00',
                            '002020-03-08T03:00:00',
                        ],
                        ['2021']: [
                            '002021-03-14T02:00:00',
                            '002021-03-14T03:00:00',
                        ],
                    },
                    ['10']: {
                        ['2014']: [
                            '002014-11-02T02:00:00',
                            '002014-11-02T02:00:00',
                        ],
                        ['2015']: [
                            '002015-11-01T02:00:00',
                            '002015-11-01T02:00:00',
                        ],
                        ['2019']: [
                            '002019-11-03T02:00:00',
                            '002019-11-03T02:00:00',
                        ],
                        ['2020']: [
                            '002020-11-01T02:00:00',
                            '002020-11-01T02:00:00',
                        ],
                        ['2021']: [
                            '002021-11-07T02:00:00',
                            '002021-11-07T02:00:00',
                        ],
                    },
                },
            },
        },
        [
            {
                ['offset']: -13480,
                ['dst']: false,
                ['abbrev']: 'LMT',
                ['until']: -1850328920,
                ['format']: 'LMT',
            },
            {
                ['offset']: -14400,
                ['dst']: false,
                ['abbrev']: 'AST',
                ['until']: 326001600,
                ['format']: 'AST',
            },
            {
                ['offset']: -10800,
                ['dst']: false,
                ['abbrev']: '-03',
                ['until']: 536468400,
                ['format']: '-03',
            },
            {
                ['until']: Infinity,
                ['ruleSet']: o[0],
                ['offset']: -10800,
                ['abbrev']: '-03/-02',
            },
        ],
        [
            0,
        ]
    );
})();
;
