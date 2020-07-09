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
                    ],
                },
                ['_cache']: {
                    ['0']: {
                        ['2010']: [
                            o[1],
                        ],
                        ['2011']: [
                            o[1],
                            o[2],
                            o[3],
                        ],
                    },
                },
            },
            'Jymfony.Component.DateTime.Internal.Rule': {
                ['_fromYear']: {
                    ['1']: 2010,
                    ['2']: 2011,
                    ['3']: 2011,
                    ['4']: 2012,
                    ['5']: 2012,
                },
                ['_toYear']: {
                    ['1']: 2010,
                    ['2']: 2011,
                    ['3']: 2011,
                    ['4']: Infinity,
                    ['5']: Infinity,
                },
                ['_inMonth']: {
                    ['1']: 9,
                    ['2']: 4,
                    ['3']: 9,
                    ['4']: 4,
                    ['5']: 9,
                },
                ['_on']: {
                    ['1']: 'last sun %s',
                    ['2']: '1 %s this sat',
                    ['3']: 'last sat %s',
                    ['4']: '1 %s this sun',
                    ['5']: 'last sun %s',
                },
                ['_at']: {
                    ['1']: '0:00',
                    ['2']: '4:00',
                    ['3']: '3:00',
                    ['4']: '4:00',
                    ['5']: '3:00',
                },
                ['_save']: {
                    ['1']: 3600,
                    ['2']: 0,
                    ['3']: 3600,
                    ['4']: 0,
                    ['5']: 3600,
                },
                ['_letters']: {
                    ['1']: '-',
                    ['2']: '-',
                    ['3']: '-',
                    ['4']: '-',
                    ['5']: '-',
                },
                ['_cache']: {
                    ['1']: {
                        ['2010']: [
                            '002010-09-26T00:00:00',
                            '002010-09-26T01:00:00',
                        ],
                    },
                    ['2']: {
                        ['2011']: [
                            '002011-04-02T04:00:00',
                            '002011-04-02T04:00:00',
                        ],
                    },
                    ['3']: {
                        ['2011']: [
                            '002011-09-24T03:00:00',
                            '002011-09-24T04:00:00',
                        ],
                    },
                    ['4']: {},
                    ['5']: {},
                },
            },
        },
        [
            {
                ['offset']: 45184,
                ['dst']: false,
                ['abbrev']: 'LMT',
                ['until']: -2445424384,
                ['format']: 'LMT',
            },
            {
                ['offset']: -41216,
                ['dst']: false,
                ['abbrev']: 'LMT',
                ['until']: -1861878784,
                ['format']: 'LMT',
            },
            {
                ['offset']: -41400,
                ['dst']: false,
                ['abbrev']: '-1130',
                ['until']: -631110600,
                ['format']: '-1130',
            },
            {
                ['until']: 1325239200,
                ['ruleSet']: o[0],
                ['offset']: -39600,
                ['abbrev']: '-11/-10',
            },
            {
                ['until']: Infinity,
                ['ruleSet']: o[0],
                ['offset']: 46800,
                ['abbrev']: '+13/+14',
            },
        ],
        [
            0,
        ]
    );
})();
;
