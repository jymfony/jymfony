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
            },
            'Jymfony.Component.DateTime.Internal.Rule': {
                ['_fromYear']: {
                    ['1']: 2002,
                    ['2']: 2002,
                    ['3']: 2008,
                    ['4']: 2008,
                    ['5']: 2009,
                },
                ['_toYear']: {
                    ['1']: 2002,
                    ['2']: 2002,
                    ['3']: 2008,
                    ['4']: 2009,
                    ['5']: 2009,
                },
                ['_inMonth']: {
                    ['1']: 4,
                    ['2']: 10,
                    ['3']: 6,
                    ['4']: 11,
                    ['5']: 4,
                },
                ['_on']: {
                    ['1']: '2 %s this sun',
                    ['2']: '2 %s this sun',
                    ['3']: '1',
                    ['4']: '1',
                    ['5']: '15',
                },
                ['_at']: {
                    ['1']: '0:00',
                    ['2']: '0:00',
                    ['3']: '0:00',
                    ['4']: '0:00',
                    ['5']: '0:00',
                },
                ['_save']: {
                    ['1']: 3600,
                    ['2']: 0,
                    ['3']: 3600,
                    ['4']: 0,
                    ['5']: 3600,
                },
                ['_letters']: {
                    ['1']: 'S',
                    ['2']: '-',
                    ['3']: 'S',
                    ['4']: '-',
                    ['5']: 'S',
                },
            },
        },
        [
            {
                ['offset']: 16092,
                ['dst']: false,
                ['abbrev']: 'LMT',
                ['until']: -1988166492,
                ['format']: 'LMT',
            },
            {
                ['offset']: 19800,
                ['dst']: false,
                ['abbrev']: '+0530',
                ['until']: -862637400,
                ['format']: '+0530',
            },
            {
                ['until']: -764141400,
                ['ruleSet']: undefined,
                ['offset']: 19800,
                ['abbrev']: '+0630',
            },
            {
                ['offset']: 19800,
                ['dst']: false,
                ['abbrev']: '+0530',
                ['until']: -576135000,
                ['format']: '+0530',
            },
            {
                ['offset']: 18000,
                ['dst']: false,
                ['abbrev']: '+05',
                ['until']: 38775600,
                ['format']: '+05',
            },
            {
                ['until']: Infinity,
                ['ruleSet']: o[0],
                ['offset']: 18000,
                ['abbrev']: 'PK%sT',
            },
        ],
        []
    );
})();
;
