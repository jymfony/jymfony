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
                    ['1']: 1981,
                    ['2']: 1981,
                    ['3']: 1984,
                    ['4']: 1985,
                    ['5']: 1996,
                },
                ['_toYear']: {
                    ['1']: 1984,
                    ['2']: 1983,
                    ['3']: 1995,
                    ['4']: 2010,
                    ['5']: 2010,
                },
                ['_inMonth']: {
                    ['1']: 4,
                    ['2']: 10,
                    ['3']: 9,
                    ['4']: 3,
                    ['5']: 10,
                },
                ['_on']: {
                    ['1']: '1',
                    ['2']: '1',
                    ['3']: 'last sun %s',
                    ['4']: 'last sun %s',
                    ['5']: 'last sun %s',
                },
                ['_at']: {
                    ['1']: '0:00',
                    ['2']: '0:00',
                    ['3']: '2:00s',
                    ['4']: '2:00s',
                    ['5']: '2:00s',
                },
                ['_save']: {
                    ['1']: 3600,
                    ['2']: 0,
                    ['3']: 0,
                    ['4']: 3600,
                    ['5']: 0,
                },
                ['_letters']: {
                    ['1']: '-',
                    ['2']: '-',
                    ['3']: '-',
                    ['4']: '-',
                    ['5']: '-',
                },
            },
        },
        [
            {
                ['offset']: 15712,
                ['dst']: false,
                ['abbrev']: 'LMT',
                ['until']: -1441167712,
                ['format']: 'LMT',
            },
            {
                ['offset']: 14400,
                ['dst']: false,
                ['abbrev']: '+04',
                ['until']: -1247544000,
                ['format']: '+04',
            },
            {
                ['offset']: 18000,
                ['dst']: false,
                ['abbrev']: '+05',
                ['until']: 354913200,
                ['format']: '+05',
            },
            {
                ['until']: 370724400,
                ['ruleSet']: undefined,
                ['offset']: 18000,
                ['abbrev']: '+06',
            },
            {
                ['offset']: 21600,
                ['dst']: false,
                ['abbrev']: '+06',
                ['until']: 386445600,
                ['format']: '+06',
            },
            {
                ['until']: 670366800,
                ['ruleSet']: o[0],
                ['offset']: 18000,
                ['abbrev']: '+05/+06',
            },
            {
                ['until']: 686091600,
                ['ruleSet']: o[0],
                ['offset']: 14400,
                ['abbrev']: '+04/+05',
            },
            {
                ['until']: 695768400,
                ['ruleSet']: o[0],
                ['offset']: 18000,
                ['abbrev']: '+05/+06',
            },
            {
                ['until']: 701812800,
                ['ruleSet']: o[0],
                ['offset']: 21600,
                ['abbrev']: '+06/+07',
            },
            {
                ['until']: 1099166400,
                ['ruleSet']: o[0],
                ['offset']: 18000,
                ['abbrev']: '+05/+06',
            },
            {
                ['offset']: 21600,
                ['dst']: false,
                ['abbrev']: '+06',
                ['until']: 1545328800,
                ['format']: '+06',
            },
            {
                ['offset']: 18000,
                ['dst']: false,
                ['abbrev']: '+05',
                ['until']: Infinity,
                ['format']: '+05',
            },
        ],
        []
    );
})();
;
