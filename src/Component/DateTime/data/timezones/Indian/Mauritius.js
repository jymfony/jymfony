export default (() => {
    let o;
    return Jymfony.Component.VarExporter.Internal.Hydrator.hydrate(
        o = [
            (new ReflectionClass('Jymfony.Component.DateTime.Internal.RuleSet')).newInstanceWithoutConstructor(),
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
                    ],
                },
            },
            'Jymfony.Component.DateTime.Internal.Rule': {
                ['_fromYear']: {
                    ['1']: 1982,
                    ['2']: 1983,
                    ['3']: 2008,
                    ['4']: 2009,
                },
                ['_toYear']: {
                    ['1']: 1982,
                    ['2']: 1983,
                    ['3']: 2008,
                    ['4']: 2009,
                },
                ['_inMonth']: {
                    ['1']: 10,
                    ['2']: 3,
                    ['3']: 10,
                    ['4']: 3,
                },
                ['_on']: {
                    ['1']: '10',
                    ['2']: '21',
                    ['3']: 'last sun %s',
                    ['4']: 'last sun %s',
                },
                ['_at']: {
                    ['1']: '0:00',
                    ['2']: '0:00',
                    ['3']: '2:00',
                    ['4']: '2:00',
                },
                ['_save']: {
                    ['1']: 3600,
                    ['2']: 0,
                    ['3']: 3600,
                    ['4']: 0,
                },
                ['_letters']: {
                    ['1']: '-',
                    ['2']: '-',
                    ['3']: '-',
                    ['4']: '-',
                },
            },
        },
        [
            {
                ['offset']: 13800,
                ['dst']: false,
                ['abbrev']: 'LMT',
                ['until']: -1988164200,
                ['format']: 'LMT',
            },
            {
                ['until']: Infinity,
                ['ruleSet']: o[0],
                ['offset']: 14400,
                ['abbrev']: '+04/+05',
            },
        ],
        []
    );
})();
;
