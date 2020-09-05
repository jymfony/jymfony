const Choice = Jymfony.Component.Validator.Constraints.Choice;
const ChoiceValidator = Jymfony.Component.Validator.Constraints.ChoiceValidator;
const ConstraintDefinitionException = Jymfony.Component.Validator.Exception.ConstraintDefinitionException;
const Fixtures = Jymfony.Component.Validator.Fixtures.Constraints;
const UnexpectedTypeException = Jymfony.Component.Validator.Exception.UnexpectedTypeException;
const { expect } = require('chai');

const choice_callback = function() {
    return [ 'foo', 'bar' ];
};

describe('[Validator] Constraints.ChoiceValidator', function () {
    it ('should throw if multiple is true and value is not an array', async () => {
        const constraint = new Choice({
            choices: [ 'foo', 'bar' ],
            multiple: true,
        });

        const validator = new ChoiceValidator();
        await expect(() => validator.validate('asdf', constraint)).to.throw(UnexpectedTypeException);
    });

    it ('null should be valid', async () => {
        await expect(null).to.be.validated.by(ChoiceValidator)
            .with.constraint(new Choice({ choices: [] }))
            .and.raise.no.violations();
    });

    it ('undefined should be valid', async () => {
        await expect(undefined).to.be.validated.by(ChoiceValidator)
            .with.constraint(new Choice({ choices: [] }))
            .and.raise.no.violations();
    });

    it ('should throw if no choices nor callback is set', async () => {
        await expect('foobar').to.be.validated.by(ChoiceValidator)
            .with.constraint(new Choice())
            .and.throw(ConstraintDefinitionException);
    });

    it ('should throw if invalid callback is passed', async () => {
        await expect('foobar').to.be.validated.by(ChoiceValidator)
            .with.constraint(new Choice({ callback: 'abcd' }))
            .and.throw(ConstraintDefinitionException);
    });

    it ('should validate against choices', async () => {
        await expect('bar').to.be.validated.by(ChoiceValidator)
            .with.constraint(new Choice({ choices: [ 'foo', 'bar' ] }))
            .and.raise.no.violations();
    });

    it ('should validate against choices loaded from callback', async () => {
        await expect('bar').to.be.validated.by(ChoiceValidator)
            .with.constraint(new Choice({ callback: choice_callback }))
            .and.raise.no.violations();
    });

    it ('should call static method as callback with callable array', async () => {
        await expect('bar').to.be.validated.by(ChoiceValidator)
            .with.constraint(new Choice({ callback: [ Fixtures.ChoiceValidatorTest_Object, 'staticCallback' ] }))
            .and.raise.no.violations();
    });

    it ('should call static method from object in context', async () => {
        const object = new Fixtures.ChoiceValidatorTest_Object();
        await expect('bar').to.be.validated.by(ChoiceValidator, { object, rootObject: object })
            .with.constraint(new Choice({ callback: 'staticCallback' }))
            .and.raise.no.violations();
    });

    it ('should call method from object in context', async () => {
        const object = new Fixtures.ChoiceValidatorTest_Object();
        await expect('bar').to.be.validated.by(ChoiceValidator, { object, rootObject: object })
            .with.constraint(new Choice({ callback: 'objectMethodCallback' }))
            .and.raise.no.violations();
    });

    it ('should validate against multiple choices', async () => {
        await expect([ 'baz', 'bar' ]).to.be.validated.by(ChoiceValidator)
            .with.constraint(new Choice({
                choices: [ 'foo', 'bar', 'baz' ],
                multiple: true,
            })).and.raise.no.violations();
    });

    it ('should raise violation on invalid choice', async () => {
        await expect([ 'foo', 'bar' ]).to.be.validated.by(ChoiceValidator)
            .with.constraint(new Choice({
                choices: [ 'baz' ],
                message: 'myMessage',
            })).and.raise.violations([ {
                message: 'myMessage',
                code: Choice.NO_SUCH_CHOICE_ERROR,
                parameters: {
                    '{{ value }}': 'array',
                    '{{ choices }}': '"baz"',
                },
                propertyPath: '',
            } ]);
    });

    it ('should raise violation if choices option is empty', async () => {
        await expect([ 'foo', 'bar' ]).to.be.validated.by(ChoiceValidator)
            .with.constraint(new Choice({
                // May happen when the choices are provided dynamically, e.g. from the DB or the model
                choices: [],
                message: 'myMessage',
            })).and.raise.violations([ {
                message: 'myMessage',
                code: Choice.NO_SUCH_CHOICE_ERROR,
                parameters: {
                    '{{ value }}': 'array',
                    '{{ choices }}': '',
                },
                propertyPath: '',
            } ]);
    });

    it ('should raise violation if one of multiple choice is invalid', async () => {
        await expect([ 'foo', 'baz' ]).to.be.validated.by(ChoiceValidator)
            .with.constraint(new Choice({
                choices: [ 'foo', 'bar' ],
                message: 'myMessage',
            })).and.raise.violations([ {
                message: 'myMessage',
                code: Choice.NO_SUCH_CHOICE_ERROR,
                parameters: {
                    '{{ value }}': 'array',
                    '{{ choices }}': '"foo", "bar"',
                },
                propertyPath: '',
            } ]);
    });

    it ('should raise violation if too few choices are selected', async () => {
        await expect([ 'foo' ]).to.be.validated.by(ChoiceValidator)
            .with.constraint(new Choice({
                choices: [ 'foo', 'bar', 'moo', 'maa' ],
                multiple: true,
                min: 2,
                minMessage: 'myMessage',
            })).and.raise.violations([ {
                message: 'myMessage',
                code: Choice.TOO_FEW_ERROR,
                parameters: {
                    '{{ limit }}': 2,
                },
                plural: 2,
                propertyPath: '',
            } ]);
    });

    it ('should raise violation if too many choices are selected', async () => {
        await expect([ 'foo', 'bar', 'moo' ]).to.be.validated.by(ChoiceValidator)
            .with.constraint(new Choice({
                choices: [ 'foo', 'bar', 'moo', 'maa' ],
                multiple: true,
                max: 2,
                maxMessage: 'myMessage',
            })).and.raise.violations([ {
                message: 'myMessage',
                code: Choice.TOO_MANY_ERROR,
                parameters: {
                    '{{ limit }}': 2,
                },
                plural: 2,
                propertyPath: '',
            } ]);
    });

    it ('should raise violation on different types', async () => {
        await expect('2').to.be.validated.by(ChoiceValidator)
            .with.constraint(new Choice({
                choices: [ 1, 2 ],
                message: 'myMessage',
            })).and.raise.violations([ {
                message: 'myMessage',
                code: Choice.NO_SUCH_CHOICE_ERROR,
                parameters: {
                    '{{ value }}': '"2"',
                    '{{ choices }}': '1, 2',
                },
                propertyPath: '',
            } ]);
    });
});
