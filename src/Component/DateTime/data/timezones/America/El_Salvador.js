export default (() => {
    let o;
    return Jymfony.Component.VarExporter.Internal.Hydrator.hydrate(
        o = [
            (new ReflectionClass('Jymfony.Component.DateTime.Internal.RuleSet')).newInstanceWithoutConstructor(),
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
                    ],
                },
            },
            'Jymfony.Component.DateTime.Internal.Rule': {
                ['_fromYear']: {
                    ['1']: 1987,
                    ['2']: 1987,
                },
                ['_toYear']: {
                    ['1']: 1988,
                    ['2']: 1988,
                },
                ['_inMonth']: {
                    ['1']: 5,
                    ['2']: 9,
                },
                ['_on']: {
                    ['1']: '1 %s this sun',
                    ['2']: 'last sun %s',
                },
                ['_at']: {
                    ['1']: '0:00',
                    ['2']: '0:00',
                },
                ['_save']: {
                    ['1']: 3600,
                    ['2']: 0,
                },
                ['_letters']: {
                    ['1']: 'D',
                    ['2']: 'S',
                },
            },
        },
        [
            {
                ['offset']: -21408,
                ['dst']: false,
                ['abbrev']: 'LMT',
                ['until']: -1546279392,
                ['format']: 'LMT',
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
