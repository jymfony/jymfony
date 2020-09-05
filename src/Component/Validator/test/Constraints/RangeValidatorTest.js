const DateTime = Jymfony.Component.DateTime.DateTime;
const ConstraintDefinitionException = Jymfony.Component.Validator.Exception.ConstraintDefinitionException;
const Fixtures = Jymfony.Component.Validator.Fixtures.Constraints;
const Range = Jymfony.Component.Validator.Constraints.Range;
const RangeValidator = Jymfony.Component.Validator.Constraints.RangeValidator;
const { expect } = require('chai');

const old_format = __jymfony.version_compare(process.versions.node, '12', '<');

describe('[Validator] Constraints.RangeValidator', function () {
    it ('null should be valid', async () => {
        await expect(null).to.be.validated.by(RangeValidator)
            .with.constraint(new Range({ max: 20 }))
            .and.raise.no.violations();
    });

    it ('undefined should be valid', async () => {
        await expect(undefined).to.be.validated.by(RangeValidator)
            .with.constraint(new Range({ min: 0 }))
            .and.raise.no.violations();
    });

    const getTenToTwenty = function * () {
        yield [ 10.00001 ];
        yield [ 19.99999 ];
        yield [ '10.00001' ];
        yield [ '19.99999' ];
        yield [ 10 ];
        yield [ 20 ];
        yield [ 10.0 ];
        yield [ 20.0 ];
    };

    const getLessThanTen = function * () {
        yield [ 9.99999, '9.99999' ];
        yield [ '9.99999', '"9.99999"' ];
        yield [ 5, '5' ];
        yield [ 1.0, '1' ];
    };

    const getMoreThanTwenty = function * () {
        yield [ 20.00001, '20.00001' ];
        yield [ '20.00001', '"20.00001"' ];
        yield [ 21, '21' ];
        yield [ 30.0, '30' ];
    };

    let i = 0;
    for (const [ value ] of getTenToTwenty()) {
        it ('should validate min value: valid #' + (++i), async () => {
            await expect(value).to.be.validated.by(RangeValidator)
                .with.constraint(new Range({ min: 10 }))
                .and.raise.no.violations();
        });
    }

    i = 0;
    for (const [ value, formattedValue ] of getLessThanTen()) {
        it ('should validate min value: invalid #' + (++i), async () => {
            await expect(value).to.be.validated.by(RangeValidator)
                .with.constraint(new Range({ min: 10, minMessage: 'myMessage' }))
                .and.raise.violations([ {
                    message: 'myMessage',
                    parameters: {
                        '{{ value }}': formattedValue,
                        '{{ limit }}': '10',
                    },
                    code: Range.TOO_LOW_ERROR,
                    propertyPath: '',
                } ]);
        });
    }

    i = 0;
    for (const [ value ] of getTenToTwenty()) {
        it ('should validate max value: valid #' + (++i), async () => {
            await expect(value).to.be.validated.by(RangeValidator)
                .with.constraint(new Range({ max: 20 }))
                .and.raise.no.violations();
        });
    }

    i = 0;
    for (const [ value, formattedValue ] of getMoreThanTwenty()) {
        it ('should validate max value: invalid #' + (++i), async () => {
            await expect(value).to.be.validated.by(RangeValidator)
                .with.constraint(new Range({ max: 20, maxMessage: 'myMessage' }))
                .and.raise.violations([ {
                    message: 'myMessage',
                    parameters: {
                        '{{ value }}': formattedValue,
                        '{{ limit }}': '20',
                    },
                    code: Range.TOO_HIGH_ERROR,
                    propertyPath: '',
                } ]);
        });
    }

    i = 0;
    for (const [ value ] of getTenToTwenty()) {
        it ('should validate combined value: valid #' + (++i), async () => {
            await expect(value).to.be.validated.by(RangeValidator)
                .with.constraint(new Range({ min: 10, max: 20 }))
                .and.raise.no.violations();
        });
    }

    i = 0;
    for (const [ value, formattedValue ] of [ ...getLessThanTen(), ...getMoreThanTwenty() ]) {
        it ('should validate combined value: invalid #' + (++i), async () => {
            await expect(value).to.be.validated.by(RangeValidator)
                .with.constraint(new Range({ min: 10, max: 20, notInRangeMessage: 'myMessage' }))
                .and.raise.violations([ {
                    message: 'myMessage',
                    parameters: {
                        '{{ value }}': formattedValue,
                        '{{ min }}': '10',
                        '{{ max }}': '20',
                    },
                    code: Range.NOT_IN_RANGE_ERROR,
                    propertyPath: '',
                } ]);
        });
    }

    const getTenthToTwentiethMarch2014 = function * () {
        yield [ new DateTime('10 march 2014', 'Etc/UTC') ];
        yield [ new DateTime('15 march 2014', 'Etc/UTC') ];
        yield [ new DateTime('20 march 2014', 'Etc/UTC') ];

        let d = new Date();
        d.setUTCFullYear(2014, 2, 10);
        d.setUTCHours(0, 0, 0, 0);
        yield [ d ];

        d = new Date();
        d.setUTCFullYear(2014, 2, 15);
        d.setUTCHours(0, 0, 0, 0);
        yield [ d ];

        d = new Date();
        d.setUTCFullYear(2014, 2, 20);
        d.setUTCHours(0, 0, 0, 0);
        yield [ d ];
    };

    const getSoonerThanTenthMarch2014 = function * () {
        yield [ new DateTime('20 march 2013', 'Etc/UTC'), old_format ? '3/20/2013' : 'Mar 20, 2013, 12:00 AM' ];
        yield [ new DateTime('9 march 2014', 'Etc/UTC'), old_format ? '3/9/2014' : 'Mar 9, 2014, 12:00 AM' ];

        let d = new Date();
        d.setUTCFullYear(2013, 2, 20);
        d.setUTCHours(0, 0, 0, 0);
        yield [ d, old_format ? '3/20/2013' : 'Mar 20, 2013, 12:00 AM' ];

        d = new Date();
        d.setUTCFullYear(2014, 2, 9);
        d.setUTCHours(0, 0, 0, 0);
        yield [ d, old_format ? '3/9/2014' : 'Mar 9, 2014, 12:00 AM' ];
    };

    const getLaterThanTwentiethMarch2014 = function * () {
        yield [ new DateTime('21 march 2014', 'Etc/UTC'), old_format ? '3/21/2014' : 'Mar 21, 2014, 12:00 AM' ];
        yield [ new DateTime('9 march 2015', 'Etc/UTC'), old_format ? '3/9/2015' : 'Mar 9, 2015, 12:00 AM' ];

        let d = new Date();
        d.setUTCFullYear(2014, 2, 21);
        d.setUTCHours(0, 0, 0, 0);
        yield [ d, old_format ? '3/21/2014' : 'Mar 21, 2014, 12:00 AM' ];

        d = new Date();
        d.setUTCFullYear(2015, 2, 9);
        d.setUTCHours(0, 0, 0, 0);
        yield [ d, old_format ? '3/9/2015' : 'Mar 9, 2015, 12:00 AM' ];
    };

    i = 0;
    for (const [ value ] of getTenthToTwentiethMarch2014()) {
        it ('should validate date min: valid #'+ i++, async () => {
            await expect(value).to.be.validated.by(RangeValidator)
                .with.constraint(new Range({ min: '2014 march 10' }))
                .and.raise.no.violations();
        });
    }
    i = 0;

    for (const [ value ] of getTenthToTwentiethMarch2014()) {
        it ('should validate date max: valid #'+ i++, async () => {
            await expect(value).to.be.validated.by(RangeValidator)
                .with.constraint(new Range({ max: '2014 march 20' }))
                .and.raise.no.violations();
        });
    }
    i = 0;

    for (const [ value ] of getTenthToTwentiethMarch2014()) {
        it ('should validate date min-max: valid #'+ i++, async () => {
            await expect(value).to.be.validated.by(RangeValidator)
                .with.constraint(new Range({ min: '2014 march 10', max: '2014 march 20' }))
                .and.raise.no.violations();
        });
    }

    i = 0;
    for (const [ value, asString ] of getSoonerThanTenthMarch2014()) {
        it ('should validate date min: invalid #'+ i++, async () => {
            await expect(value).to.be.validated.by(RangeValidator)
                .with.constraint(new Range({ min: '2014 march 10', minMessage: 'myMessage' }))
                .and.raise.violations([ {
                    message: 'myMessage',
                    parameters: {
                        '{{ value }}': asString,
                        '{{ limit }}': old_format ? '3/10/2014' : 'Mar 10, 2014, 12:00 AM',
                    },
                    code: Range.TOO_LOW_ERROR,
                    propertyPath: '',
                } ]);
        });
    }

    i = 0;
    for (const [ value, asString ] of getLaterThanTwentiethMarch2014()) {
        it ('should validate date max: invalid #'+ i++, async () => {
            await expect(value).to.be.validated.by(RangeValidator)
                .with.constraint(new Range({ max: '2014 march 20', maxMessage: 'myMessage' }))
                .and.raise.violations([ {
                    message: 'myMessage',
                    parameters: {
                        '{{ value }}': asString,
                        '{{ limit }}': old_format ? '3/20/2014' : 'Mar 20, 2014, 12:00 AM',
                    },
                    code: Range.TOO_HIGH_ERROR,
                    propertyPath: '',
                } ]);
        });
    }

    i = 0;
    for (const [ value, asString ] of getLaterThanTwentiethMarch2014()) {
        it ('should validate date combined: invalid max #'+ i++, async () => {
            await expect(value).to.be.validated.by(RangeValidator)
                .with.constraint(new Range({ min: '2014 march 10', max: '2014 march 20', notInRangeMessage: 'myMessage' }))
                .and.raise.violations([ {
                    message: 'myMessage',
                    parameters: {
                        '{{ value }}': asString,
                        '{{ min }}': old_format ? '3/10/2014' : 'Mar 10, 2014, 12:00 AM',
                        '{{ max }}': old_format ? '3/20/2014' : 'Mar 20, 2014, 12:00 AM',
                    },
                    code: Range.NOT_IN_RANGE_ERROR,
                    propertyPath: '',
                } ]);
        });
    }

    i = 0;
    for (const [ value, asString ] of getSoonerThanTenthMarch2014()) {
        it ('should validate date combined: invalid min #'+ i++, async () => {
            await expect(value).to.be.validated.by(RangeValidator)
                .with.constraint(new Range({ min: '2014 march 10', max: '2014 march 20', notInRangeMessage: 'myMessage' }))
                .and.raise.violations([ {
                    message: 'myMessage',
                    parameters: {
                        '{{ value }}': asString,
                        '{{ min }}': old_format ? '3/10/2014' : 'Mar 10, 2014, 12:00 AM',
                        '{{ max }}': old_format ? '3/20/2014' : 'Mar 20, 2014, 12:00 AM',
                    },
                    code: Range.NOT_IN_RANGE_ERROR,
                    propertyPath: '',
                } ]);
        });
    }

    it ('non-numeric should be invalid', async () => {
        await expect('abcd').to.be.validated.by(RangeValidator)
            .with.constraint(new Range({ min: 10, max: 20, invalidMessage: 'myMessage' }))
            .and.raise.violations([ {
                message: 'myMessage',
                parameters: {
                    '{{ value }}': '"abcd"',
                },
                code: Range.INVALID_CHARACTERS_ERROR,
                propertyPath: '',
            } ]);
    });

    const throwsOnInvalidStringDates = function * () {
        yield [ 'The min value "foo" could not be converted to a DateTime instance in the "Jymfony.Component.Validator.Constraints.Range" constraint.', new DateTime(), 'foo', undefined ];
        yield [ 'The min value "foo" could not be converted to a DateTime instance in the "Jymfony.Component.Validator.Constraints.Range" constraint.', new Date(), 'foo', undefined ];
        yield [ 'The max value "foo" could not be converted to a DateTime instance in the "Jymfony.Component.Validator.Constraints.Range" constraint.', new DateTime(), undefined, 'foo' ];
        yield [ 'The min value "bar" could not be converted to a DateTime instance in the "Jymfony.Component.Validator.Constraints.Range" constraint.', new DateTime(), 'bar', 'ccc' ];
    };

    i = 0;
    for (const [ message, value, min, max ] of throwsOnInvalidStringDates()) {
        it ('should throw on invalid string dates #'+ i++, async () => {
            await expect(value).to.be.validated.by(RangeValidator)
                .with.constraint(new Range({ min, max }))
                .and.throw(ConstraintDefinitionException, message);
        });
    }

    i = 0;
    for (const [ value ] of getTenToTwenty()) {
        it ('should validate min value from property path: valid #' + (++i), async () => {
            const object = new Fixtures.Limit(10);

            await expect(value).to.be.validated.by(RangeValidator, { object })
                .with.constraint(new Range({ minPropertyPath: 'value' }))
                .and.raise.no.violations();
        });
    }

    i = 0;
    for (const [ value ] of getTenToTwenty()) {
        it ('should validate max value from property path: valid #' + (++i), async () => {
            const object = new Fixtures.Limit(20);

            await expect(value).to.be.validated.by(RangeValidator, { object })
                .with.constraint(new Range({ maxPropertyPath: 'value' }))
                .and.raise.no.violations();
        });
    }

    i = 0;
    for (const [ value ] of getTenToTwenty()) {
        it ('should validate combined value from property path: valid #' + (++i), async () => {
            const object = new Fixtures.MinMax(10, 20);

            await expect(value).to.be.validated.by(RangeValidator, { object })
                .with.constraint(new Range({ minPropertyPath: 'min', maxPropertyPath: 'max' }))
                .and.raise.no.violations();
        });
    }

    i = 0;
    for (const [ value, formattedValue ] of getLessThanTen()) {
        it ('should validate min value from property path: invalid #' + (++i), async () => {
            const object = new Fixtures.Limit(10);

            await expect(value).to.be.validated.by(RangeValidator, { object })
                .with.constraint(new Range({ minPropertyPath: 'value', minMessage: 'myMessage' }))
                .and.raise.violations([ {
                    message: 'myMessage',
                    parameters: {
                        '{{ value }}': formattedValue,
                        '{{ limit }}': '10',
                        '{{ min_limit_path }}': 'value',
                    },
                    invalidValue: value,
                    code: Range.TOO_LOW_ERROR,
                    propertyPath: '',
                } ]);
        });
    }

    i = 0;
    for (const [ value, formattedValue ] of getMoreThanTwenty()) {
        it ('should validate max value from property path: invalid #' + (++i), async () => {
            const object = new Fixtures.Limit(20);

            await expect(value).to.be.validated.by(RangeValidator, { object })
                .with.constraint(new Range({ maxPropertyPath: 'value', maxMessage: 'myMessage' }))
                .and.raise.violations([ {
                    message: 'myMessage',
                    parameters: {
                        '{{ value }}': formattedValue,
                        '{{ limit }}': '20',
                        '{{ max_limit_path }}': 'value',
                    },
                    invalidValue: value,
                    code: Range.TOO_HIGH_ERROR,
                    propertyPath: '',
                } ]);
        });
    }

    i = 0;
    for (const [ value, formattedValue ] of [ ...getMoreThanTwenty(), ...getLessThanTen() ]) {
        it ('should validate combined value from property path: invalid #' + (++i), async () => {
            const object = new Fixtures.MinMax(10, 20);

            await expect(value).to.be.validated.by(RangeValidator, { object })
                .with.constraint(new Range({ minPropertyPath: 'min', maxPropertyPath: 'max', notInRangeMessage: 'myMessage' }))
                .and.raise.violations([ {
                    message: 'myMessage',
                    parameters: {
                        '{{ value }}': formattedValue,
                        '{{ min }}': '10',
                        '{{ max }}': '20',
                        '{{ max_limit_path }}': 'max',
                        '{{ min_limit_path }}': 'min',
                    },
                    invalidValue: value,
                    code: Range.NOT_IN_RANGE_ERROR,
                    propertyPath: '',
                } ]);
        });
    }

    i = 0;
    for (const [ value, formattedValue ] of getLessThanTen()) {
        it ('should validate min value on null object: invalid #' + (++i), async () => {
            await expect(value).to.be.validated.by(RangeValidator, { object: null })
                .with.constraint(new Range({ min: 10, maxPropertyPath: 'value', minMessage: 'myMessage' }))
                .and.raise.violations([ {
                    message: 'myMessage',
                    parameters: {
                        '{{ value }}': formattedValue,
                        '{{ limit }}': '10',
                        '{{ max_limit_path }}': 'value',
                    },
                    code: Range.TOO_LOW_ERROR,
                    propertyPath: '',
                } ]);
        });
    }

    i = 0;
    for (const [ value, formattedValue ] of getMoreThanTwenty()) {
        it ('should validate max value on null object: invalid #' + (++i), async () => {
            await expect(value).to.be.validated.by(RangeValidator, { object: null })
                .with.constraint(new Range({ max: 20, minPropertyPath: 'value', maxMessage: 'myMessage' }))
                .and.raise.violations([ {
                    message: 'myMessage',
                    parameters: {
                        '{{ value }}': formattedValue,
                        '{{ limit }}': '20',
                        '{{ min_limit_path }}': 'value',
                    },
                    code: Range.TOO_HIGH_ERROR,
                    propertyPath: '',
                } ]);
        });
    }
});
