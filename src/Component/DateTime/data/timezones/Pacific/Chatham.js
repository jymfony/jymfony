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
                    ['0']: {},
                },
            },
            'Jymfony.Component.DateTime.Internal.Rule': {
                ['_fromYear']: {
                    ['1']: 1974,
                    ['2']: 1975,
                    ['3']: 1975,
                    ['4']: 1976,
                    ['5']: 1989,
                    ['6']: 1990,
                    ['7']: 1990,
                    ['8']: 2007,
                    ['9']: 2008,
                },
                ['_toYear']: {
                    ['1']: 1974,
                    ['2']: 1975,
                    ['3']: 1988,
                    ['4']: 1989,
                    ['5']: 1989,
                    ['6']: 2006,
                    ['7']: 2007,
                    ['8']: Infinity,
                    ['9']: Infinity,
                },
                ['_inMonth']: {
                    ['1']: 11,
                    ['2']: 2,
                    ['3']: 10,
                    ['4']: 3,
                    ['5']: 10,
                    ['6']: 10,
                    ['7']: 3,
                    ['8']: 9,
                    ['9']: 4,
                },
                ['_on']: {
                    ['1']: '1 %s this sun',
                    ['2']: 'last sun %s',
                    ['3']: 'last sun %s',
                    ['4']: '1 %s this sun',
                    ['5']: '8 %s this sun',
                    ['6']: '1 %s this sun',
                    ['7']: '15 %s this sun',
                    ['8']: 'last sun %s',
                    ['9']: '1 %s this sun',
                },
                ['_at']: {
                    ['1']: '2:45s',
                    ['2']: '2:45s',
                    ['3']: '2:45s',
                    ['4']: '2:45s',
                    ['5']: '2:45s',
                    ['6']: '2:45s',
                    ['7']: '2:45s',
                    ['8']: '2:45s',
                    ['9']: '2:45s',
                },
                ['_save']: {
                    ['1']: 3600,
                    ['2']: 0,
                    ['3']: 3600,
                    ['4']: 0,
                    ['5']: 3600,
                    ['6']: 3600,
                    ['7']: 0,
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
                    ['6']: {},
                    ['7']: {},
                    ['8']: {},
                    ['9']: {},
                },
            },
        },
        [
            {
                ['offset']: 44028,
                ['dst']: false,
                ['abbrev']: 'LMT',
                ['until']: -3192437628,
                ['format']: 'LMT',
            },
            {
                ['offset']: 44100,
                ['dst']: false,
                ['abbrev']: '+1215',
                ['until']: -757426500,
                ['format']: '+1215',
            },
            {
                ['until']: Infinity,
                ['ruleSet']: o[0],
                ['offset']: 45900,
                ['abbrev']: '+1245/+1345',
            },
        ],
        [
            0,
        ]
    );
})();
;
