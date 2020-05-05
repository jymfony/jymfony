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
                    ],
                },
            },
            'Jymfony.Component.DateTime.Internal.Rule': {
                ['_fromYear']: {
                    ['1']: 1999,
                    ['2']: 2000,
                    ['3']: 2000,
                    ['4']: 2001,
                    ['5']: 2016,
                    ['6']: 2017,
                },
                ['_toYear']: {
                    ['1']: 1999,
                    ['2']: 2000,
                    ['3']: 2001,
                    ['4']: 2002,
                    ['5']: 2016,
                    ['6']: 2017,
                },
                ['_inMonth']: {
                    ['1']: 10,
                    ['2']: 3,
                    ['3']: 11,
                    ['4']: 1,
                    ['5']: 11,
                    ['6']: 1,
                },
                ['_on']: {
                    ['1']: '7',
                    ['2']: '19',
                    ['3']: '1 %s this sun',
                    ['4']: 'last sun %s',
                    ['5']: '1 %s this sun',
                    ['6']: '15 %s this sun',
                },
                ['_at']: {
                    ['1']: '2:00s',
                    ['2']: '2:00s',
                    ['3']: '2:00',
                    ['4']: '2:00',
                    ['5']: '2:00',
                    ['6']: '3:00',
                },
                ['_save']: {
                    ['1']: 3600,
                    ['2']: 0,
                    ['3']: 3600,
                    ['4']: 0,
                    ['5']: 3600,
                    ['6']: 0,
                },
                ['_letters']: {
                    ['1']: '-',
                    ['2']: '-',
                    ['3']: '-',
                    ['4']: '-',
                    ['5']: '-',
                    ['6']: '-',
                },
            },
        },
        [
            {
                ['offset']: 44360,
                ['dst']: false,
                ['abbrev']: 'LMT',
                ['until']: -2177497160,
                ['format']: 'LMT',
            },
            {
                ['offset']: 44400,
                ['dst']: false,
                ['abbrev']: '+1220',
                ['until']: -915193200,
                ['format']: '+1220',
            },
            {
                ['offset']: 46800,
                ['dst']: false,
                ['abbrev']: '+13',
                ['until']: 915102000,
                ['format']: '+13',
            },
            {
                ['until']: Infinity,
                ['ruleSet']: o[0],
                ['offset']: 46800,
                ['abbrev']: '+13/+14',
            },
        ],
        []
    );
})();
;
