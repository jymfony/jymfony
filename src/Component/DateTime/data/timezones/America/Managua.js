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
                    ['1']: 1979,
                    ['2']: 1979,
                    ['3']: 2005,
                    ['4']: 2005,
                    ['5']: 2006,
                    ['6']: 2006,
                },
                ['_toYear']: {
                    ['1']: 1980,
                    ['2']: 1980,
                    ['3']: 2005,
                    ['4']: 2005,
                    ['5']: 2006,
                    ['6']: 2006,
                },
                ['_inMonth']: {
                    ['1']: 3,
                    ['2']: 6,
                    ['3']: 4,
                    ['4']: 10,
                    ['5']: 4,
                    ['6']: 10,
                },
                ['_on']: {
                    ['1']: '16 %s this sun',
                    ['2']: '23 %s this mon',
                    ['3']: '10',
                    ['4']: '1 %s this sun',
                    ['5']: '30',
                    ['6']: '1 %s this sun',
                },
                ['_at']: {
                    ['1']: '0:00',
                    ['2']: '0:00',
                    ['3']: '0:00',
                    ['4']: '0:00',
                    ['5']: '2:00',
                    ['6']: '1:00',
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
                    ['1']: 'D',
                    ['2']: 'S',
                    ['3']: 'D',
                    ['4']: 'S',
                    ['5']: 'D',
                    ['6']: 'S',
                },
            },
        },
        [
            {
                ['offset']: -20708,
                ['dst']: false,
                ['abbrev']: 'LMT',
                ['until']: -2524500892,
                ['format']: 'LMT',
            },
            {
                ['offset']: -20712,
                ['dst']: false,
                ['abbrev']: 'MMT',
                ['until']: -1121105688,
                ['format']: 'MMT',
            },
            {
                ['offset']: -21600,
                ['dst']: false,
                ['abbrev']: 'CST',
                ['until']: 105084000,
                ['format']: 'CST',
            },
            {
                ['offset']: -18000,
                ['dst']: false,
                ['abbrev']: 'EST',
                ['until']: 161758800,
                ['format']: 'EST',
            },
            {
                ['until']: 694260000,
                ['ruleSet']: o[0],
                ['offset']: -21600,
                ['abbrev']: 'C%sT',
            },
            {
                ['offset']: -18000,
                ['dst']: false,
                ['abbrev']: 'EST',
                ['until']: 717310800,
                ['format']: 'EST',
            },
            {
                ['offset']: -21600,
                ['dst']: false,
                ['abbrev']: 'CST',
                ['until']: 725868000,
                ['format']: 'CST',
            },
            {
                ['offset']: -18000,
                ['dst']: false,
                ['abbrev']: 'EST',
                ['until']: 852094800,
                ['format']: 'EST',
            },
            {
                ['until']: Infinity,
                ['ruleSet']: o[0],
                ['offset']: -21600,
                ['abbrev']: 'C%sT',
            },
        ],
        []
    );
})();
;
