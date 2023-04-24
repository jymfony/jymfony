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
                        o[15],
                        o[16],
                        o[17],
                    ],
                },
                ['_cache']: {
                    ['0']: {
                        ['1917']: [
                            o[2],
                            o[3],
                            o[4],
                        ],
                        ['1918']: [
                            o[2],
                            o[3],
                            o[4],
                        ],
                        ['1919']: [
                            o[4],
                        ],
                        ['1920']: [
                            o[4],
                        ],
                        ['1942']: [
                            o[5],
                            o[6],
                        ],
                        ['1943']: [
                            o[6],
                            o[7],
                            o[8],
                        ],
                        ['1944']: [
                            o[8],
                            o[9],
                            o[10],
                        ],
                        ['1945']: [
                            o[10],
                            o[9],
                            o[11],
                        ],
                        ['1980']: [
                            o[14],
                            o[12],
                            o[15],
                        ],
                        ['1981']: [
                            o[14],
                            o[15],
                            o[16],
                        ],
                        ['1990']: [
                            o[14],
                            o[15],
                            o[16],
                        ],
                        ['1991']: [
                            o[14],
                            o[15],
                            o[16],
                        ],
                        ['1993']: [
                            o[14],
                            o[15],
                            o[16],
                        ],
                        ['1994']: [
                            o[14],
                            o[15],
                            o[16],
                        ],
                        ['1995']: [
                            o[14],
                            o[15],
                            o[16],
                        ],
                        ['1996']: [
                            o[15],
                            o[16],
                            o[17],
                        ],
                        ['1997']: [
                            o[15],
                            o[16],
                            o[17],
                        ],
                        ['1998']: [
                            o[15],
                            o[16],
                            o[17],
                        ],
                    },
                },
            },
            'Jymfony.Component.DateTime.Internal.Rule': {
                ['_fromYear']: {
                    ['1']: 1916,
                    ['2']: 1916,
                    ['3']: 1917,
                    ['4']: 1917,
                    ['5']: 1940,
                    ['6']: 1942,
                    ['7']: 1943,
                    ['8']: 1943,
                    ['9']: 1944,
                    ['10']: 1944,
                    ['11']: 1945,
                    ['12']: 1977,
                    ['13']: 1977,
                    ['14']: 1978,
                    ['15']: 1979,
                    ['16']: 1981,
                    ['17']: 1996,
                },
                ['_toYear']: {
                    ['1']: 1916,
                    ['2']: 1916,
                    ['3']: 1918,
                    ['4']: 1918,
                    ['5']: 1940,
                    ['6']: 1942,
                    ['7']: 1943,
                    ['8']: 1943,
                    ['9']: 1945,
                    ['10']: 1944,
                    ['11']: 1945,
                    ['12']: 1980,
                    ['13']: 1977,
                    ['14']: 1978,
                    ['15']: 1995,
                    ['16']: Infinity,
                    ['17']: Infinity,
                },
                ['_inMonth']: {
                    ['1']: 4,
                    ['2']: 10,
                    ['3']: 4,
                    ['4']: 9,
                    ['5']: 4,
                    ['6']: 11,
                    ['7']: 3,
                    ['8']: 10,
                    ['9']: 4,
                    ['10']: 10,
                    ['11']: 9,
                    ['12']: 4,
                    ['13']: 9,
                    ['14']: 10,
                    ['15']: 9,
                    ['16']: 3,
                    ['17']: 10,
                },
                ['_on']: {
                    ['1']: '30',
                    ['2']: '1',
                    ['3']: '15 %s this mon',
                    ['4']: '15 %s this mon',
                    ['5']: '1',
                    ['6']: '2',
                    ['7']: '29',
                    ['8']: '4',
                    ['9']: '1 %s this mon',
                    ['10']: '2',
                    ['11']: '16',
                    ['12']: '1 %s this sun',
                    ['13']: 'last sun %s',
                    ['14']: '1',
                    ['15']: 'last sun %s',
                    ['16']: 'last sun %s',
                    ['17']: 'last sun %s',
                },
                ['_at']: {
                    ['1']: '23:00',
                    ['2']: '1:00',
                    ['3']: '2:00s',
                    ['4']: '2:00s',
                    ['5']: '2:00s',
                    ['6']: '2:00s',
                    ['7']: '2:00s',
                    ['8']: '2:00s',
                    ['9']: '2:00s',
                    ['10']: '2:00s',
                    ['11']: '2:00s',
                    ['12']: '2:00s',
                    ['13']: '2:00s',
                    ['14']: '2:00s',
                    ['15']: '2:00s',
                    ['16']: '2:00s',
                    ['17']: '2:00s',
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
                    ['11']: 0,
                    ['12']: 3600,
                    ['13']: 0,
                    ['14']: 0,
                    ['15']: 0,
                    ['16']: 3600,
                    ['17']: 0,
                },
                ['_letters']: {
                    ['1']: 'S',
                    ['2']: '-',
                    ['3']: 'S',
                    ['4']: '-',
                    ['5']: 'S',
                    ['6']: '-',
                    ['7']: 'S',
                    ['8']: '-',
                    ['9']: 'S',
                    ['10']: '-',
                    ['11']: '-',
                    ['12']: 'S',
                    ['13']: '-',
                    ['14']: '-',
                    ['15']: '-',
                    ['16']: 'S',
                    ['17']: '-',
                },
                ['_cache']: {
                    ['1']: {},
                    ['2']: {
                        ['1916']: [
                            '001916-10-01T01:00:00',
                            '001916-10-01T01:00:00',
                        ],
                    },
                    ['3']: {
                        ['1917']: [
                            '001917-04-16T02:00:00',
                            '001917-04-16T03:00:00',
                        ],
                        ['1918']: [
                            '001918-04-15T02:00:00',
                            '001918-04-15T03:00:00',
                        ],
                    },
                    ['4']: {
                        ['1917']: [
                            '001917-09-17T02:00:00',
                            '001917-09-17T02:00:00',
                        ],
                        ['1918']: [
                            '001918-09-16T02:00:00',
                            '001918-09-16T02:00:00',
                        ],
                    },
                    ['5']: {
                        ['1940']: [
                            '001940-04-01T02:00:00',
                            '001940-04-01T03:00:00',
                        ],
                    },
                    ['6']: {
                        ['1942']: [
                            '001942-11-02T02:00:00',
                            '001942-11-02T02:00:00',
                        ],
                    },
                    ['7']: {
                        ['1943']: [
                            '001943-03-29T02:00:00',
                            '001943-03-29T03:00:00',
                        ],
                    },
                    ['8']: {
                        ['1943']: [
                            '001943-10-04T02:00:00',
                            '001943-10-04T02:00:00',
                        ],
                    },
                    ['9']: {
                        ['1944']: [
                            '001944-04-03T02:00:00',
                            '001944-04-03T03:00:00',
                        ],
                        ['1945']: [
                            '001945-04-02T02:00:00',
                            '001945-04-02T03:00:00',
                        ],
                    },
                    ['10']: {
                        ['1944']: [
                            '001944-10-02T02:00:00',
                            '001944-10-02T02:00:00',
                        ],
                    },
                    ['11']: {
                        ['1945']: [
                            '001945-09-16T02:00:00',
                            '001945-09-16T02:00:00',
                        ],
                    },
                    ['12']: {
                        ['1980']: [
                            '001980-04-06T02:00:00',
                            '001980-04-06T03:00:00',
                        ],
                    },
                    ['13']: {},
                    ['14']: {
                        ['1978']: [
                            '001978-10-01T02:00:00',
                            '001978-10-01T02:00:00',
                        ],
                    },
                    ['15']: {
                        ['1980']: [
                            '001980-09-28T02:00:00',
                            '001980-09-28T02:00:00',
                        ],
                        ['1981']: [
                            '001981-09-27T02:00:00',
                            '001981-09-27T02:00:00',
                        ],
                        ['1990']: [
                            '001990-09-30T02:00:00',
                            '001990-09-30T02:00:00',
                        ],
                        ['1991']: [
                            '001991-09-29T02:00:00',
                            '001991-09-29T02:00:00',
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
                    ['16']: {
                        ['1981']: [
                            '001981-03-29T02:00:00',
                            '001981-03-29T03:00:00',
                        ],
                        ['1990']: [
                            '001990-03-25T02:00:00',
                            '001990-03-25T03:00:00',
                        ],
                        ['1991']: [
                            '001991-03-31T02:00:00',
                            '001991-03-31T03:00:00',
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
                        ['1996']: [
                            '001996-03-31T02:00:00',
                            '001996-03-31T03:00:00',
                        ],
                        ['1997']: [
                            '001997-03-30T02:00:00',
                            '001997-03-30T03:00:00',
                        ],
                        ['1998']: [
                            '001998-03-29T02:00:00',
                            '001998-03-29T03:00:00',
                        ],
                    },
                    ['17']: {
                        ['1996']: [
                            '001996-10-27T02:00:00',
                            '001996-10-27T02:00:00',
                        ],
                        ['1997']: [
                            '001997-10-26T02:00:00',
                            '001997-10-26T02:00:00',
                        ],
                        ['1998']: [
                            '001998-10-25T02:00:00',
                            '001998-10-25T02:00:00',
                        ],
                    },
                },
            },
        },
        [
            {
                ['until']: Infinity,
                ['ruleSet']: o[0],
                ['offset']: 3600,
                ['abbrev']: 'CE%sT',
            },
        ],
        [
            0,
        ]
    );
})();
;
