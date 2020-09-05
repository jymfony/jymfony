const Callback = Jymfony.Component.Validator.Constraints.Callback;
const CallbackValidator = Jymfony.Component.Validator.Constraints.CallbackValidator;
const Constraint = Jymfony.Component.Validator.Constraint;
const ConstraintDefinitionException = Jymfony.Component.Validator.Exception.ConstraintDefinitionException;
const Fixtures = Jymfony.Component.Validator.Fixtures.Constraints;
const { expect } = require('chai');

describe('[Validator] Constraints.CallbackValidator', function () {
    it ('null should be valid', async () => {
        await expect(null).to.be.validated.by(CallbackValidator)
            .with.constraint(Callback)
            .and.raise.no.violations();
    });

    it ('should call method', async () => {
        await expect(new Fixtures.CallbackValidatorTest_Object())
            .to.be.validated.by(CallbackValidator)
            .with.constraint(new Callback('validate'))
            .and.raise.violations([ {
                message: 'My message',
                parameters: {
                    '{{ value }}': 'foobar',
                },
                propertyPath: '',
            } ]);
    });

    it ('should call static method', async () => {
        await expect(new Fixtures.CallbackValidatorTest_Object())
            .to.be.validated.by(CallbackValidator)
            .with.constraint(new Callback('validateStatic'))
            .and.raise.violations([ {
                message: 'Static message',
                parameters: {
                    '{{ value }}': 'baz',
                },
                propertyPath: '',
            } ]);
    });

    it ('should call function', async () => {
        await expect(new Fixtures.CallbackValidatorTest_Object())
            .to.be.validated.by(CallbackValidator)
            .with.constraint(new Callback((value, context) => {
                context.addViolation('My message', {'{{ value }}': 'foobar'});

                return false;
            }))
            .and.raise.violations([ {
                message: 'My message',
                parameters: {
                    '{{ value }}': 'foobar',
                },
                propertyPath: '',
            } ]);
    });

    it ('should call function when object is null', async () => {
        await expect(null)
            .to.be.validated.by(CallbackValidator)
            .with.constraint(new Callback((value, context) => {
                context.addViolation('My message', {'{{ value }}': 'foobar'});

                return false;
            }))
            .and.raise.violations([ {
                message: 'My message',
                parameters: {
                    '{{ value }}': 'foobar',
                },
                propertyPath: '',
            } ]);
    });

    it ('should pass function passed with explicit property', async () => {
        await expect(new Fixtures.CallbackValidatorTest_Object())
            .to.be.validated.by(CallbackValidator)
            .with.constraint(new Callback({
                callback: (value, context) => {
                    context.addViolation('My message', {'{{ value }}': 'foobar'});

                    return false;
                },
            }))
            .and.raise.violations([ {
                message: 'My message',
                parameters: {
                    '{{ value }}': 'foobar',
                },
                propertyPath: '',
            } ]);
    });

    it ('should call callable array function', async () => {
        const object = new Fixtures.CallbackValidatorTest_Object();

        await expect(object)
            .to.be.validated.by(CallbackValidator)
            .with.constraint(new Callback([ object, 'validate' ]))
            .and.raise.violations([ {
                message: 'My message',
                parameters: {
                    '{{ value }}': 'foobar',
                },
                propertyPath: '',
            } ]);
    });

    it ('should throw on invalid methods', async () => {
        await expect(new Fixtures.CallbackValidatorTest_Object())
            .to.be.validated.by(CallbackValidator)
            .with.constraint(new Callback({ callback: 'foobar' }))
            .and.throw(ConstraintDefinitionException);
    });


    it ('should throw on invalid callbacks', async () => {
        await expect(new Fixtures.CallbackValidatorTest_Object())
            .to.be.validated.by(CallbackValidator)
            .with.constraint(new Callback({ callback: [ 'foo', 'bar' ] }))
            .and.throw(ConstraintDefinitionException);
    });

    it ('should target properties and classes', async () => {
        const constraint = new Callback({});

        await expect(constraint.targets).to.be.deep.equal(
            [ Constraint.CLASS_CONSTRAINT, Constraint.PROPERTY_CONSTRAINT ]
        );
    });

    it ('constraint should be constructed without arguments', async () => {
        await expect(() => new Callback()).not.to.throw();
    });

    it ('payload should be passed to callback', async () => {
        const object = {};
        let payloadCopy = null;

        const constraint = new Callback({
            callback: function (value, constraint, payload) {
                payloadCopy = payload;
            },
            payload: 'Hello world!',
        });

        await expect(object).to.be.validated.by(CallbackValidator)
            .with.constraint(constraint)
            .and.raise.no.violations();

        await expect(payloadCopy).to.be.equal('Hello world!');
    });
});
