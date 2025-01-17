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
            (new ReflectionClass('Jymfony.Component.DateTime.Internal.RuleSet')).newInstanceWithoutConstructor(),
            (new ReflectionClass('Jymfony.Component.DateTime.Internal.Rule')).newInstanceWithoutConstructor(),
            (new ReflectionClass('Jymfony.Component.DateTime.Internal.Rule')).newInstanceWithoutConstructor(),
            (new ReflectionClass('Jymfony.Component.DateTime.Internal.Rule')).newInstanceWithoutConstructor(),
            (new ReflectionClass('Jymfony.Component.DateTime.Internal.RuleSet')).newInstanceWithoutConstructor(),
            (new ReflectionClass('Jymfony.Component.DateTime.Internal.Rule')).newInstanceWithoutConstructor(),
            (new ReflectionClass('Jymfony.Component.DateTime.Internal.Rule')).newInstanceWithoutConstructor(),
        ],
        null,
        {
            'Jymfony.Component.DateTime.Internal.RuleSet': {
                ['_name']: {
                    ['0']: undefined,
                    ['6']: undefined,
                    ['10']: undefined,
                },
                ['_rules']: {
                    ['0']: [
                        o[1],
                        o[2],
                        o[3],
                        o[4],
                        o[5],
                    ],
                    ['6']: [
                        o[7],
                        o[8],
                        o[9],
                    ],
                    ['10']: [
                        o[11],
                        o[12],
                    ],
                },
                ['_cache']: {
                    ['0']: {
                        ['1988']: [
                            o[2],
                            o[3],
                            o[4],
                        ],
                        ['1989']: [
                            o[2],
                            o[3],
                            o[4],
                        ],
                        ['1990']: [
                            o[2],
                            o[3],
                            o[4],
                        ],
                        ['1991']: [
                            o[2],
                            o[3],
                            o[4],
                        ],
                        ['1992']: [
                            o[2],
                            o[3],
                            o[4],
                        ],
                        ['1993']: [
                            o[2],
                            o[3],
                            o[4],
                        ],
                        ['1994']: [
                            o[2],
                            o[3],
                            o[4],
                        ],
                        ['1995']: [
                            o[2],
                            o[3],
                            o[4],
                        ],
                        ['1998']: [
                            o[3],
                            o[4],
                            o[5],
                        ],
                        ['1999']: [
                            o[3],
                            o[4],
                            o[5],
                        ],
                        ['2003']: [
                            o[3],
                            o[4],
                            o[5],
                        ],
                        ['2004']: [
                            o[3],
                            o[4],
                            o[5],
                        ],
                        ['2010']: [
                            o[3],
                            o[4],
                            o[5],
                        ],
                        ['2011']: [
                            o[5],
                        ],
                        ['2024']: [
                            o[5],
                        ],
                        ['2025']: [
                            o[5],
                        ],
                    },
                    ['6']: {
                        ['1996']: [
                            o[8],
                            o[7],
                            o[9],
                        ],
                        ['1997']: [
                            o[8],
                            o[7],
                            o[9],
                        ],
                        ['2015']: [
                            o[8],
                            o[7],
                            o[9],
                        ],
                        ['2016']: [
                            o[8],
                            o[7],
                            o[9],
                        ],
                    },
                    ['10']: {},
                },
            },
            'Jymfony.Component.DateTime.Internal.Rule': {
                ['_fromYear']: {
                    ['1']: 1981,
                    ['2']: 1981,
                    ['3']: 1984,
                    ['4']: 1985,
                    ['5']: 1996,
                    ['7']: 1981,
                    ['8']: 1979,
                    ['9']: 1996,
                    ['11']: 1997,
                    ['12']: 1997,
                },
                ['_toYear']: {
                    ['1']: 1984,
                    ['2']: 1983,
                    ['3']: 1995,
                    ['4']: 2010,
                    ['5']: 2010,
                    ['7']: Infinity,
                    ['8']: 1995,
                    ['9']: Infinity,
                    ['11']: 2015,
                    ['12']: 2015,
                },
                ['_inMonth']: {
                    ['1']: 4,
                    ['2']: 10,
                    ['3']: 9,
                    ['4']: 3,
                    ['5']: 10,
                    ['7']: 3,
                    ['8']: 9,
                    ['9']: 10,
                    ['11']: 3,
                    ['12']: 10,
                },
                ['_on']: {
                    ['1']: '1',
                    ['2']: '1',
                    ['3']: 'last sun %s',
                    ['4']: 'last sun %s',
                    ['5']: 'last sun %s',
                    ['7']: 'last sun %s',
                    ['8']: 'last sun %s',
                    ['9']: 'last sun %s',
                    ['11']: 'last sun %s',
                    ['12']: 'last sun %s',
                },
                ['_at']: {
                    ['1']: '0:00',
                    ['2']: '0:00',
                    ['3']: '2:00s',
                    ['4']: '2:00s',
                    ['5']: '2:00s',
                    ['7']: '1:00u',
                    ['8']: '1:00u',
                    ['9']: '1:00u',
                    ['11']: '4:00',
                    ['12']: '5:00',
                },
                ['_save']: {
                    ['1']: 3600,
                    ['2']: 0,
                    ['3']: 0,
                    ['4']: 3600,
                    ['5']: 0,
                    ['7']: 3600,
                    ['8']: 0,
                    ['9']: 0,
                    ['11']: 3600,
                    ['12']: 0,
                },
                ['_letters']: {
                    ['1']: '-',
                    ['2']: '-',
                    ['3']: '-',
                    ['4']: '-',
                    ['5']: '-',
                    ['7']: 'S',
                    ['8']: '-',
                    ['9']: '-',
                    ['11']: '-',
                    ['12']: '-',
                },
                ['_cache']: {
                    ['1']: {},
                    ['2']: {
                        ['1983']: [
                            '001983-10-01T00:00:00',
                            '001983-10-01T00:00:00',
                        ],
                    },
                    ['3']: {
                        ['1988']: [
                            '001988-09-25T02:00:00',
                            '001988-09-25T02:00:00',
                        ],
                        ['1989']: [
                            '001989-09-24T02:00:00',
                            '001989-09-24T02:00:00',
                        ],
                        ['1990']: [
                            '001990-09-30T02:00:00',
                            '001990-09-30T02:00:00',
                        ],
                        ['1991']: [
                            '001991-09-29T02:00:00',
                            '001991-09-29T02:00:00',
                        ],
                        ['1992']: [
                            '001992-09-27T02:00:00',
                            '001992-09-27T02:00:00',
                        ],
                        ['1993']: [
                            '001993-09-26T02:00:00',
                            '001993-09-26T02:00:00',
                        ],
                        ['1994']: [
                            '001994-09-25T02:00:00',
                            '001994-09-25T02:00:00',
                        ],
                        ['1995']: [
                            '001995-09-24T02:00:00',
                            '001995-09-24T02:00:00',
                        ],
                    },
                    ['4']: {
                        ['1988']: [
                            '001988-03-27T02:00:00',
                            '001988-03-27T03:00:00',
                        ],
                        ['1989']: [
                            '001989-03-26T02:00:00',
                            '001989-03-26T03:00:00',
                        ],
                        ['1990']: [
                            '001990-03-25T02:00:00',
                            '001990-03-25T03:00:00',
                        ],
                        ['1991']: [
                            '001991-03-31T02:00:00',
                            '001991-03-31T03:00:00',
                        ],
                        ['1992']: [
                            '001992-03-29T02:00:00',
                            '001992-03-29T03:00:00',
                        ],
                        ['1993']: [
                            '001993-03-28T02:00:00',
                            '001993-03-28T03:00:00',
                        ],
                        ['1994']: [
                            '001994-03-27T02:00:00',
                            '001994-03-27T03:00:00',
                        ],
                        ['1995']: [
                            '001995-03-26T02:00:00',
                            '001995-03-26T03:00:00',
                        ],
                        ['1998']: [
                            '001998-03-29T02:00:00',
                            '001998-03-29T03:00:00',
                        ],
                        ['1999']: [
                            '001999-03-28T02:00:00',
                            '001999-03-28T03:00:00',
                        ],
                        ['2003']: [
                            '002003-03-30T02:00:00',
                            '002003-03-30T03:00:00',
                        ],
                        ['2004']: [
                            '002004-03-28T02:00:00',
                            '002004-03-28T03:00:00',
                        ],
                        ['2010']: [
                            '002010-03-28T02:00:00',
                            '002010-03-28T03:00:00',
                        ],
                    },
                    ['5']: {
                        ['1998']: [
                            '001998-10-25T02:00:00',
                            '001998-10-25T02:00:00',
                        ],
                        ['1999']: [
                            '001999-10-31T02:00:00',
                            '001999-10-31T02:00:00',
                        ],
                        ['2003']: [
                            '002003-10-26T02:00:00',
                            '002003-10-26T02:00:00',
                        ],
                        ['2004']: [
                            '002004-10-31T02:00:00',
                            '002004-10-31T02:00:00',
                        ],
                        ['2010']: [
                            '002010-10-31T02:00:00',
                            '002010-10-31T02:00:00',
                        ],
                    },
                    ['7']: {
                        ['1996']: [
                            '001996-03-31T01:00:00u',
                            '001996-03-31T02:00:00',
                        ],
                        ['1997']: [
                            '001997-03-30T01:00:00u',
                            '001997-03-30T02:00:00',
                        ],
                        ['2015']: [
                            '002015-03-29T01:00:00u',
                            '002015-03-29T02:00:00',
                        ],
                        ['2016']: [
                            '002016-03-27T01:00:00u',
                            '002016-03-27T02:00:00',
                        ],
                    },
                    ['8']: {
                        ['1995']: [
                            '001995-09-24T01:00:00u',
                            '001995-09-24T01:00:00',
                        ],
                    },
                    ['9']: {
                        ['1996']: [
                            '001996-10-27T01:00:00u',
                            '001996-10-27T01:00:00',
                        ],
                        ['1997']: [
                            '001997-10-26T01:00:00u',
                            '001997-10-26T01:00:00',
                        ],
                        ['2015']: [
                            '002015-10-25T01:00:00u',
                            '002015-10-25T01:00:00',
                        ],
                        ['2016']: [
                            '002016-10-30T01:00:00u',
                            '002016-10-30T01:00:00',
                        ],
                    },
                    ['11']: {},
                    ['12']: {},
                },
            },
        },
        [
            {
                ['offset']: 11964,
                ['dst']: false,
                ['abbrev']: 'LMT',
                ['until']: -1441163964,
                ['format']: 'LMT',
            },
            {
                ['offset']: 10800,
                ['dst']: false,
                ['abbrev']: '%z',
                ['until']: -405140400,
                ['format']: '%z',
            },
            {
                ['until']: 670370400,
                ['ruleSet']: o[0],
                ['offset']: 14400,
                ['abbrev']: '%z',
            },
            {
                ['until']: 1737846000,
                ['ruleSet']: o[0],
                ['offset']: 10800,
                ['abbrev']: '%z',
            },
            {
                ['offset']: 14400,
                ['dst']: false,
                ['abbrev']: '%z',
                ['until']: 820440000,
                ['format']: '%z',
            },
            {
                ['until']: 852062400,
                ['ruleSet']: o[6],
                ['offset']: 14400,
                ['abbrev']: '%z',
            },
            {
                ['until']: Infinity,
                ['ruleSet']: o[10],
                ['offset']: 14400,
                ['abbrev']: '%z',
            },
        ],
        [
            0,
            6,
            10,
        ]
    );
})();
;
