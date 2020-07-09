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
                    ['10']: undefined,
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
                    ],
                    ['10']: [
                        o[11],
                        o[12],
                        o[13],
                    ],
                },
                ['_cache']: {
                    ['0']: {
                        ['1997']: [
                            o[7],
                            o[8],
                            o[9],
                        ],
                        ['1998']: [
                            o[8],
                            o[9],
                        ],
                    },
                    ['10']: {
                        ['1996']: [
                            o[12],
                            o[11],
                            o[13],
                        ],
                        ['1997']: [
                            o[12],
                            o[11],
                            o[13],
                        ],
                        ['2015']: [
                            o[12],
                            o[11],
                            o[13],
                        ],
                        ['2016']: [
                            o[12],
                            o[11],
                            o[13],
                        ],
                    },
                },
            },
            'Jymfony.Component.DateTime.Internal.Rule': {
                ['_fromYear']: {
                    ['1']: 1975,
                    ['2']: 1975,
                    ['3']: 1976,
                    ['4']: 1976,
                    ['5']: 1977,
                    ['6']: 1977,
                    ['7']: 1978,
                    ['8']: 1979,
                    ['9']: 1981,
                    ['11']: 1981,
                    ['12']: 1979,
                    ['13']: 1996,
                },
                ['_toYear']: {
                    ['1']: 1975,
                    ['2']: 1975,
                    ['3']: 1976,
                    ['4']: 1976,
                    ['5']: 1980,
                    ['6']: 1977,
                    ['7']: 1978,
                    ['8']: 1997,
                    ['9']: 1998,
                    ['11']: Infinity,
                    ['12']: 1995,
                    ['13']: Infinity,
                },
                ['_inMonth']: {
                    ['1']: 4,
                    ['2']: 10,
                    ['3']: 5,
                    ['4']: 10,
                    ['5']: 4,
                    ['6']: 9,
                    ['7']: 10,
                    ['8']: 9,
                    ['9']: 3,
                    ['11']: 3,
                    ['12']: 9,
                    ['13']: 10,
                },
                ['_on']: {
                    ['1']: '13',
                    ['2']: '12',
                    ['3']: '15',
                    ['4']: '11',
                    ['5']: '1 %s this sun',
                    ['6']: '25',
                    ['7']: '2',
                    ['8']: 'last sun %s',
                    ['9']: 'last sun %s',
                    ['11']: 'last sun %s',
                    ['12']: 'last sun %s',
                    ['13']: 'last sun %s',
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
                    ['9']: '0:00',
                    ['11']: '1:00u',
                    ['12']: '1:00u',
                    ['13']: '1:00u',
                },
                ['_save']: {
                    ['1']: 3600,
                    ['2']: 0,
                    ['3']: 3600,
                    ['4']: 0,
                    ['5']: 3600,
                    ['6']: 0,
                    ['7']: 0,
                    ['8']: 0,
                    ['9']: 3600,
                    ['11']: 3600,
                    ['12']: 0,
                    ['13']: 0,
                },
                ['_letters']: {
                    ['1']: 'S',
                    ['2']: '-',
                    ['3']: 'S',
                    ['4']: '-',
                    ['5']: 'S',
                    ['6']: '-',
                    ['7']: '-',
                    ['8']: '-',
                    ['9']: 'S',
                    ['11']: 'S',
                    ['12']: '-',
                    ['13']: '-',
                },
                ['_cache']: {
                    ['1']: {},
                    ['2']: {},
                    ['3']: {},
                    ['4']: {},
                    ['5']: {},
                    ['6']: {},
                    ['7']: {
                        ['1978']: [
                            '001978-10-02T00:00:00',
                            '001978-10-02T00:00:00',
                        ],
                    },
                    ['8']: {
                        ['1997']: [
                            '001997-09-28T00:00:00',
                            '001997-09-28T00:00:00',
                        ],
                    },
                    ['9']: {
                        ['1997']: [
                            '001997-03-30T00:00:00',
                            '001997-03-30T01:00:00',
                        ],
                        ['1998']: [
                            '001998-03-29T00:00:00',
                            '001998-03-29T01:00:00',
                        ],
                    },
                    ['11']: {
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
                    ['12']: {
                        ['1995']: [
                            '001995-09-24T01:00:00u',
                            '001995-09-24T01:00:00',
                        ],
                    },
                    ['13']: {
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
                },
            },
        },
        [
            {
                ['offset']: 8008,
                ['dst']: false,
                ['abbrev']: 'LMT',
                ['until']: -1518920008,
                ['format']: 'LMT',
            },
            {
                ['until']: 904597200,
                ['ruleSet']: o[0],
                ['offset']: 7200,
                ['abbrev']: 'EE%sT',
            },
            {
                ['until']: Infinity,
                ['ruleSet']: o[10],
                ['offset']: 7200,
                ['abbrev']: 'EE%sT',
            },
        ],
        [
            0,
            10,
        ]
    );
})();
;
