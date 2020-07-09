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
                    ],
                },
                ['_cache']: {
                    ['0']: {
                        ['2007']: [
                            o[6],
                        ],
                        ['2008']: [
                            o[6],
                        ],
                    },
                },
            },
            'Jymfony.Component.DateTime.Internal.Rule': {
                ['_fromYear']: {
                    ['1']: 1983,
                    ['2']: 1983,
                    ['3']: 1985,
                    ['4']: 1984,
                    ['5']: 2001,
                    ['6']: 2001,
                    ['7']: 2002,
                    ['8']: 2015,
                    ['9']: 2015,
                },
                ['_toYear']: {
                    ['1']: 1984,
                    ['2']: 1983,
                    ['3']: 1998,
                    ['4']: 1998,
                    ['5']: 2001,
                    ['6']: 2006,
                    ['7']: 2006,
                    ['8']: 2016,
                    ['9']: 2016,
                },
                ['_inMonth']: {
                    ['1']: 4,
                    ['2']: 10,
                    ['3']: 3,
                    ['4']: 9,
                    ['5']: 4,
                    ['6']: 9,
                    ['7']: 3,
                    ['8']: 3,
                    ['9']: 9,
                },
                ['_on']: {
                    ['1']: '1',
                    ['2']: '1',
                    ['3']: 'last sun %s',
                    ['4']: 'last sun %s',
                    ['5']: 'last sat %s',
                    ['6']: 'last sat %s',
                    ['7']: 'last sat %s',
                    ['8']: 'last sat %s',
                    ['9']: 'last sat %s',
                },
                ['_at']: {
                    ['1']: '0:00',
                    ['2']: '0:00',
                    ['3']: '0:00',
                    ['4']: '0:00',
                    ['5']: '2:00',
                    ['6']: '2:00',
                    ['7']: '2:00',
                    ['8']: '2:00',
                    ['9']: '0:00',
                },
                ['_save']: {
                    ['1']: 3600,
                    ['2']: 0,
                    ['3']: 3600,
                    ['4']: 0,
                    ['5']: 3600,
                    ['6']: 0,
                    ['7']: 3600,
                    ['8']: 3600,
                    ['9']: 0,
                },
                ['_letters']: {
                    ['1']: '-',
                    ['2']: '-',
                    ['3']: '-',
                    ['4']: '-',
                    ['5']: '-',
                    ['6']: '-',
                    ['7']: '-',
                    ['8']: '-',
                    ['9']: '-',
                },
                ['_cache']: {
                    ['1']: {},
                    ['2']: {},
                    ['3']: {},
                    ['4']: {},
                    ['5']: {},
                    ['6']: {
                        ['2006']: [
                            '002006-09-30T02:00:00',
                            '002006-09-30T02:00:00',
                        ],
                    },
                    ['7']: {},
                    ['8']: {},
                    ['9']: {},
                },
            },
        },
        [
            {
                ['offset']: 21996,
                ['dst']: false,
                ['abbrev']: 'LMT',
                ['until']: -2032927596,
                ['format']: 'LMT',
            },
            {
                ['offset']: 21600,
                ['dst']: false,
                ['abbrev']: '+06',
                ['until']: 252439200,
                ['format']: '+06',
            },
            {
                ['until']: Infinity,
                ['ruleSet']: o[0],
                ['offset']: 25200,
                ['abbrev']: '+07/+08',
            },
        ],
        [
            0,
        ]
    );
})();
;
