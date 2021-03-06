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
                        o[11],
                        o[12],
                        o[13],
                        o[14],
                    ],
                },
                ['_cache']: {
                    ['0']: {
                        ['1997']: [
                            o[8],
                            o[9],
                            o[10],
                        ],
                        ['1998']: [
                            o[8],
                            o[9],
                            o[10],
                        ],
                        ['1999']: [
                            o[8],
                            o[9],
                            o[10],
                        ],
                        ['2000']: [
                            o[8],
                            o[9],
                            o[10],
                        ],
                        ['2001']: [
                            o[10],
                            o[11],
                            o[12],
                        ],
                        ['2009']: [
                            o[12],
                            o[13],
                            o[14],
                        ],
                        ['2010']: [
                            o[12],
                            o[13],
                            o[14],
                        ],
                        ['2014']: [
                            o[12],
                            o[13],
                            o[14],
                        ],
                        ['2015']: [
                            o[12],
                            o[13],
                            o[14],
                        ],
                    },
                },
            },
            'Jymfony.Component.DateTime.Internal.Rule': {
                ['_fromYear']: {
                    ['1']: 1939,
                    ['2']: 1939,
                    ['3']: 1940,
                    ['4']: 1941,
                    ['5']: 1943,
                    ['6']: 1944,
                    ['7']: 1950,
                    ['8']: 1950,
                    ['9']: 1996,
                    ['10']: 1996,
                    ['11']: 2001,
                    ['12']: 2001,
                    ['13']: 2002,
                    ['14']: 2002,
                },
                ['_toYear']: {
                    ['1']: 1939,
                    ['2']: 1939,
                    ['3']: 1940,
                    ['4']: 1941,
                    ['5']: 1943,
                    ['6']: 1944,
                    ['7']: 1950,
                    ['8']: 1950,
                    ['9']: 2000,
                    ['10']: 2000,
                    ['11']: 2001,
                    ['12']: 2001,
                    ['13']: Infinity,
                    ['14']: Infinity,
                },
                ['_inMonth']: {
                    ['1']: 2,
                    ['2']: 6,
                    ['3']: 12,
                    ['4']: 4,
                    ['5']: 12,
                    ['6']: 5,
                    ['7']: 2,
                    ['8']: 7,
                    ['9']: 4,
                    ['10']: 10,
                    ['11']: 5,
                    ['12']: 9,
                    ['13']: 4,
                    ['14']: 10,
                },
                ['_on']: {
                    ['1']: '5',
                    ['2']: '25',
                    ['3']: '9',
                    ['4']: '1',
                    ['5']: '16',
                    ['6']: '1',
                    ['7']: '12',
                    ['8']: '30',
                    ['9']: '1 %s this sun',
                    ['10']: 'last sun %s',
                    ['11']: '1 %s this sun',
                    ['12']: 'last sun %s',
                    ['13']: '1 %s this sun',
                    ['14']: 'last sun %s',
                },
                ['_at']: {
                    ['1']: '0:00',
                    ['2']: '0:00',
                    ['3']: '0:00',
                    ['4']: '0:00',
                    ['5']: '0:00',
                    ['6']: '0:00',
                    ['7']: '0:00',
                    ['8']: '0:00',
                    ['9']: '2:00',
                    ['10']: '2:00',
                    ['11']: '2:00',
                    ['12']: '2:00',
                    ['13']: '2:00',
                    ['14']: '2:00',
                },
                ['_save']: {
                    ['1']: 3600,
                    ['2']: 0,
                    ['3']: 3600,
                    ['4']: 0,
                    ['5']: 3600,
                    ['6']: 0,
                    ['7']: 3600,
                    ['8']: 0,
                    ['9']: 3600,
                    ['10']: 0,
                    ['11']: 3600,
                    ['12']: 0,
                    ['13']: 3600,
                    ['14']: 0,
                },
                ['_letters']: {
                    ['1']: 'D',
                    ['2']: 'S',
                    ['3']: 'D',
                    ['4']: 'S',
                    ['5']: 'W',
                    ['6']: 'S',
                    ['7']: 'D',
                    ['8']: 'S',
                    ['9']: 'D',
                    ['10']: 'S',
                    ['11']: 'D',
                    ['12']: 'S',
                    ['13']: 'D',
                    ['14']: 'S',
                },
                ['_cache']: {
                    ['1']: {},
                    ['2']: {},
                    ['3']: {},
                    ['4']: {},
                    ['5']: {},
                    ['6']: {},
                    ['7']: {},
                    ['8']: {
                        ['1950']: [
                            '001950-07-30T00:00:00',
                            '001950-07-30T00:00:00',
                        ],
                    },
                    ['9']: {
                        ['1997']: [
                            '001997-04-06T02:00:00',
                            '001997-04-06T03:00:00',
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
                    },
                    ['10']: {
                        ['1997']: [
                            '001997-10-26T02:00:00',
                            '001997-10-26T02:00:00',
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
                    },
                    ['11']: {
                        ['2001']: [
                            '002001-05-06T02:00:00',
                            '002001-05-06T03:00:00',
                        ],
                    },
                    ['12']: {
                        ['2001']: [
                            '002001-09-30T02:00:00',
                            '002001-09-30T02:00:00',
                        ],
                    },
                    ['13']: {
                        ['2009']: [
                            '002009-04-05T02:00:00',
                            '002009-04-05T03:00:00',
                        ],
                        ['2010']: [
                            '002010-04-04T02:00:00',
                            '002010-04-04T03:00:00',
                        ],
                        ['2014']: [
                            '002014-04-06T02:00:00',
                            '002014-04-06T03:00:00',
                        ],
                        ['2015']: [
                            '002015-04-05T02:00:00',
                            '002015-04-05T03:00:00',
                        ],
                    },
                    ['14']: {
                        ['2009']: [
                            '002009-10-25T02:00:00',
                            '002009-10-25T02:00:00',
                        ],
                        ['2010']: [
                            '002010-10-31T02:00:00',
                            '002010-10-31T02:00:00',
                        ],
                        ['2014']: [
                            '002014-10-26T02:00:00',
                            '002014-10-26T02:00:00',
                        ],
                        ['2015']: [
                            '002015-10-25T02:00:00',
                            '002015-10-25T02:00:00',
                        ],
                    },
                },
            },
        },
        [
            {
                ['offset']: -20824,
                ['dst']: false,
                ['abbrev']: 'LMT',
                ['until']: -1514743200,
                ['format']: 'LMT',
            },
            {
                ['offset']: -21600,
                ['dst']: false,
                ['abbrev']: 'CST',
                ['until']: 377935200,
                ['format']: 'CST',
            },
            {
                ['until']: 902037600,
                ['ruleSet']: o[0],
                ['offset']: -18000,
                ['abbrev']: 'E%sT',
            },
            {
                ['until']: 1422777600,
                ['ruleSet']: o[0],
                ['offset']: -21600,
                ['abbrev']: 'C%sT',
            },
            {
                ['offset']: -18000,
                ['dst']: false,
                ['abbrev']: 'EST',
                ['until']: Infinity,
                ['format']: 'EST',
            },
        ],
        [
            0,
        ]
    );
})();
;
