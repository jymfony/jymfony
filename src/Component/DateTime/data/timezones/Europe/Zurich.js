export default (() => {
    let o;
    return Jymfony.Component.VarExporter.Internal.Hydrator.hydrate(
        o = [
            (new ReflectionClass('Jymfony.Component.DateTime.Internal.RuleSet')).newInstanceWithoutConstructor(),
            (new ReflectionClass('Jymfony.Component.DateTime.Internal.Rule')).newInstanceWithoutConstructor(),
            (new ReflectionClass('Jymfony.Component.DateTime.Internal.Rule')).newInstanceWithoutConstructor(),
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
                    ['3']: undefined,
                },
                ['_rules']: {
                    ['0']: [
                        o[1],
                        o[2],
                    ],
                    ['3']: [
                        o[4],
                        o[5],
                        o[6],
                        o[7],
                        o[8],
                        o[9],
                    ],
                },
                ['_cache']: {
                    ['0']: {
                        ['1980']: [
                            o[2],
                        ],
                        ['1981']: [
                            o[2],
                        ],
                    },
                    ['3']: {
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
                        ['1995']: [
                            o[6],
                            o[7],
                            o[8],
                        ],
                        ['1996']: [
                            o[7],
                            o[8],
                            o[9],
                        ],
                        ['1998']: [
                            o[7],
                            o[8],
                            o[9],
                        ],
                        ['1999']: [
                            o[7],
                            o[8],
                            o[9],
                        ],
                        ['2000']: [
                            o[7],
                            o[8],
                            o[9],
                        ],
                        ['2010']: [
                            o[7],
                            o[8],
                            o[9],
                        ],
                        ['2011']: [
                            o[7],
                            o[8],
                            o[9],
                        ],
                        ['2013']: [
                            o[7],
                            o[8],
                            o[9],
                        ],
                        ['2014']: [
                            o[7],
                            o[8],
                            o[9],
                        ],
                        ['2015']: [
                            o[7],
                            o[8],
                            o[9],
                        ],
                        ['2016']: [
                            o[7],
                            o[8],
                            o[9],
                        ],
                    },
                },
            },
            'Jymfony.Component.DateTime.Internal.Rule': {
                ['_fromYear']: {
                    ['1']: 1941,
                    ['2']: 1941,
                    ['4']: 1977,
                    ['5']: 1977,
                    ['6']: 1978,
                    ['7']: 1979,
                    ['8']: 1981,
                    ['9']: 1996,
                },
                ['_toYear']: {
                    ['1']: 1942,
                    ['2']: 1942,
                    ['4']: 1980,
                    ['5']: 1977,
                    ['6']: 1978,
                    ['7']: 1995,
                    ['8']: Infinity,
                    ['9']: Infinity,
                },
                ['_inMonth']: {
                    ['1']: 5,
                    ['2']: 10,
                    ['4']: 4,
                    ['5']: 9,
                    ['6']: 10,
                    ['7']: 9,
                    ['8']: 3,
                    ['9']: 10,
                },
                ['_on']: {
                    ['1']: '1 %s this mon',
                    ['2']: '1 %s this mon',
                    ['4']: '1 %s this sun',
                    ['5']: 'last sun %s',
                    ['6']: '1',
                    ['7']: 'last sun %s',
                    ['8']: 'last sun %s',
                    ['9']: 'last sun %s',
                },
                ['_at']: {
                    ['1']: '1:00',
                    ['2']: '2:00',
                    ['4']: '1:00u',
                    ['5']: '1:00u',
                    ['6']: '1:00u',
                    ['7']: '1:00u',
                    ['8']: '1:00u',
                    ['9']: '1:00u',
                },
                ['_save']: {
                    ['1']: 3600,
                    ['2']: 0,
                    ['4']: 3600,
                    ['5']: 0,
                    ['6']: 0,
                    ['7']: 0,
                    ['8']: 3600,
                    ['9']: 0,
                },
                ['_letters']: {
                    ['1']: 'S',
                    ['2']: '-',
                    ['4']: 'S',
                    ['5']: '-',
                    ['6']: '-',
                    ['7']: '-',
                    ['8']: 'S',
                    ['9']: '-',
                },
                ['_cache']: {
                    ['1']: {},
                    ['2']: {
                        ['1942']: [
                            '001942-10-05T02:00:00',
                            '001942-10-05T02:00:00',
                        ],
                    },
                    ['4']: {},
                    ['5']: {},
                    ['6']: {
                        ['1978']: [
                            '001978-10-01T01:00:00u',
                            '001978-10-01T01:00:00',
                        ],
                    },
                    ['7']: {
                        ['1992']: [
                            '001992-09-27T01:00:00u',
                            '001992-09-27T01:00:00',
                        ],
                        ['1993']: [
                            '001993-09-26T01:00:00u',
                            '001993-09-26T01:00:00',
                        ],
                        ['1995']: [
                            '001995-09-24T01:00:00u',
                            '001995-09-24T01:00:00',
                        ],
                    },
                    ['8']: {
                        ['1992']: [
                            '001992-03-29T01:00:00u',
                            '001992-03-29T02:00:00',
                        ],
                        ['1993']: [
                            '001993-03-28T01:00:00u',
                            '001993-03-28T02:00:00',
                        ],
                        ['1995']: [
                            '001995-03-26T01:00:00u',
                            '001995-03-26T02:00:00',
                        ],
                        ['1996']: [
                            '001996-03-31T01:00:00u',
                            '001996-03-31T02:00:00',
                        ],
                        ['1998']: [
                            '001998-03-29T01:00:00u',
                            '001998-03-29T02:00:00',
                        ],
                        ['1999']: [
                            '001999-03-28T01:00:00u',
                            '001999-03-28T02:00:00',
                        ],
                        ['2000']: [
                            '002000-03-26T01:00:00u',
                            '002000-03-26T02:00:00',
                        ],
                        ['2010']: [
                            '002010-03-28T01:00:00u',
                            '002010-03-28T02:00:00',
                        ],
                        ['2011']: [
                            '002011-03-27T01:00:00u',
                            '002011-03-27T02:00:00',
                        ],
                        ['2013']: [
                            '002013-03-31T01:00:00u',
                            '002013-03-31T02:00:00',
                        ],
                        ['2014']: [
                            '002014-03-30T01:00:00u',
                            '002014-03-30T02:00:00',
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
                    ['9']: {
                        ['1996']: [
                            '001996-10-27T01:00:00u',
                            '001996-10-27T01:00:00',
                        ],
                        ['1998']: [
                            '001998-10-25T01:00:00u',
                            '001998-10-25T01:00:00',
                        ],
                        ['1999']: [
                            '001999-10-31T01:00:00u',
                            '001999-10-31T01:00:00',
                        ],
                        ['2000']: [
                            '002000-10-29T01:00:00u',
                            '002000-10-29T01:00:00',
                        ],
                        ['2010']: [
                            '002010-10-31T01:00:00u',
                            '002010-10-31T01:00:00',
                        ],
                        ['2011']: [
                            '002011-10-30T01:00:00u',
                            '002011-10-30T01:00:00',
                        ],
                        ['2013']: [
                            '002013-10-27T01:00:00u',
                            '002013-10-27T01:00:00',
                        ],
                        ['2014']: [
                            '002014-10-26T01:00:00u',
                            '002014-10-26T01:00:00',
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
                },
            },
        },
        [
            {
                ['offset']: 2048,
                ['dst']: false,
                ['abbrev']: 'LMT',
                ['until']: -3675198848,
                ['format']: 'LMT',
            },
            {
                ['offset']: 1786,
                ['dst']: false,
                ['abbrev']: 'BMT',
                ['until']: -2385246586,
                ['format']: 'BMT',
            },
            {
                ['until']: 347151600,
                ['ruleSet']: o[0],
                ['offset']: 3600,
                ['abbrev']: 'CE%sT',
            },
            {
                ['until']: Infinity,
                ['ruleSet']: o[3],
                ['offset']: 3600,
                ['abbrev']: 'CE%sT',
            },
        ],
        [
            0,
            3,
        ]
    );
})();
;
