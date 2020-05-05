export default (() => {
    let o;
    return Jymfony.Component.VarExporter.Internal.Hydrator.hydrate(
        o = [
            (new ReflectionClass('Jymfony.Component.DateTime.Internal.RuleSet')).newInstanceWithoutConstructor(),
            (new ReflectionClass('Jymfony.Component.DateTime.Internal.Rule')).newInstanceWithoutConstructor(),
            (new ReflectionClass('Jymfony.Component.DateTime.Internal.Rule')).newInstanceWithoutConstructor(),
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
                    ['5']: undefined,
                },
                ['_rules']: {
                    ['0']: [
                        o[1],
                        o[2],
                        o[3],
                        o[4],
                    ],
                    ['5']: [
                        o[6],
                        o[7],
                        o[8],
                        o[9],
                        o[10],
                        o[11],
                    ],
                },
                ['_cache']: {
                    ['0']: {
                        ['1982']: [
                            o[2],
                            o[3],
                            o[4],
                        ],
                        ['1983']: [
                            o[4],
                        ],
                    },
                    ['5']: {
                        ['1992']: [
                            o[8],
                            o[9],
                            o[10],
                        ],
                        ['1993']: [
                            o[8],
                            o[9],
                            o[10],
                        ],
                        ['1995']: [
                            o[8],
                            o[9],
                            o[10],
                        ],
                        ['1996']: [
                            o[9],
                            o[10],
                            o[11],
                        ],
                        ['1998']: [
                            o[9],
                            o[10],
                            o[11],
                        ],
                        ['1999']: [
                            o[9],
                            o[10],
                            o[11],
                        ],
                        ['2000']: [
                            o[9],
                            o[10],
                            o[11],
                        ],
                        ['2010']: [
                            o[9],
                            o[10],
                            o[11],
                        ],
                        ['2011']: [
                            o[9],
                            o[10],
                            o[11],
                        ],
                        ['2013']: [
                            o[9],
                            o[10],
                            o[11],
                        ],
                        ['2014']: [
                            o[9],
                            o[10],
                            o[11],
                        ],
                        ['2015']: [
                            o[9],
                            o[10],
                            o[11],
                        ],
                        ['2016']: [
                            o[9],
                            o[10],
                            o[11],
                        ],
                    },
                },
            },
            'Jymfony.Component.DateTime.Internal.Rule': {
                ['_fromYear']: {
                    ['1']: 1942,
                    ['2']: 1942,
                    ['3']: 1981,
                    ['4']: 1981,
                    ['6']: 1977,
                    ['7']: 1977,
                    ['8']: 1978,
                    ['9']: 1979,
                    ['10']: 1981,
                    ['11']: 1996,
                },
                ['_toYear']: {
                    ['1']: 1942,
                    ['2']: 1942,
                    ['3']: 1982,
                    ['4']: 1982,
                    ['6']: 1980,
                    ['7']: 1977,
                    ['8']: 1978,
                    ['9']: 1995,
                    ['10']: Infinity,
                    ['11']: Infinity,
                },
                ['_inMonth']: {
                    ['1']: 4,
                    ['2']: 10,
                    ['3']: 3,
                    ['4']: 9,
                    ['6']: 4,
                    ['7']: 9,
                    ['8']: 10,
                    ['9']: 9,
                    ['10']: 3,
                    ['11']: 10,
                },
                ['_on']: {
                    ['1']: '2',
                    ['2']: '4',
                    ['3']: 'last sun %s',
                    ['4']: 'last sun %s',
                    ['6']: '1 %s this sun',
                    ['7']: 'last sun %s',
                    ['8']: '1',
                    ['9']: 'last sun %s',
                    ['10']: 'last sun %s',
                    ['11']: 'last sun %s',
                },
                ['_at']: {
                    ['1']: '24:00',
                    ['2']: '1:00',
                    ['3']: '2:00',
                    ['4']: '3:00',
                    ['6']: '1:00u',
                    ['7']: '1:00u',
                    ['8']: '1:00u',
                    ['9']: '1:00u',
                    ['10']: '1:00u',
                    ['11']: '1:00u',
                },
                ['_save']: {
                    ['1']: 3600,
                    ['2']: 0,
                    ['3']: 3600,
                    ['4']: 0,
                    ['6']: 3600,
                    ['7']: 0,
                    ['8']: 0,
                    ['9']: 0,
                    ['10']: 3600,
                    ['11']: 0,
                },
                ['_letters']: {
                    ['1']: 'S',
                    ['2']: '-',
                    ['3']: 'S',
                    ['4']: '-',
                    ['6']: 'S',
                    ['7']: '-',
                    ['8']: '-',
                    ['9']: '-',
                    ['10']: 'S',
                    ['11']: '-',
                },
                ['_cache']: {
                    ['1']: {},
                    ['2']: {
                        ['1942']: [
                            '001942-10-04T01:00:00',
                            '001942-10-04T01:00:00',
                        ],
                    },
                    ['3']: {
                        ['1982']: [
                            '001982-03-28T02:00:00',
                            '001982-03-28T03:00:00',
                        ],
                    },
                    ['4']: {
                        ['1982']: [
                            '001982-09-26T03:00:00',
                            '001982-09-26T03:00:00',
                        ],
                    },
                    ['6']: {},
                    ['7']: {},
                    ['8']: {
                        ['1978']: [
                            '001978-10-01T01:00:00u',
                            '001978-10-01T01:00:00',
                        ],
                    },
                    ['9']: {
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
                    ['10']: {
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
                    ['11']: {
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
                ['offset']: 5989,
                ['dst']: false,
                ['abbrev']: 'LMT',
                ['until']: -2890258789,
                ['format']: 'LMT',
            },
            {
                ['offset']: 5989,
                ['dst']: false,
                ['abbrev']: 'HMT',
                ['until']: -1535938789,
                ['format']: 'HMT',
            },
            {
                ['until']: 410220000,
                ['ruleSet']: o[0],
                ['offset']: 7200,
                ['abbrev']: 'EE%sT',
            },
            {
                ['until']: Infinity,
                ['ruleSet']: o[5],
                ['offset']: 7200,
                ['abbrev']: 'EE%sT',
            },
        ],
        [
            0,
            5,
        ]
    );
})();
;
