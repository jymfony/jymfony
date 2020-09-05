const ConstraintViolation = Jymfony.Component.Validator.ConstraintViolation;
const ConstraintViolationList = Jymfony.Component.Validator.ConstraintViolationList;
const ConstraintViolationBuilder = Jymfony.Component.Validator.Violation.ConstraintViolationBuilder;
const LocaleAwareInterface = Jymfony.Contracts.Translation.LocaleAwareInterface;
const TranslatorInterface = Jymfony.Contracts.Translation.TranslatorInterface;
const TranslatorTrait = Jymfony.Contracts.Translation.TranslatorTrait;
const Valid = Jymfony.Component.Validator.Constraints.Valid;
const { expect } = require('chai');

describe('[Validator] Violation.ConstraintViolationBuilder', function () {
    beforeEach(() => {
        this._messageTemplate = '%value% is invalid';
        this._root = {
            data: {
                foo: 'bar',
                baz: 'foobar',
            },
        };

        const translator = new class
            extends implementationOf(TranslatorInterface, LocaleAwareInterface, TranslatorTrait) { }();
        translator.locale = 'en';

        this._violations = new ConstraintViolationList();
        this._builder = new ConstraintViolationBuilder(this._violations, new Valid(), this._messageTemplate, [], this._root, 'data', 'foo', translator);
    });

    const assertViolationEquals = (expectedViolation) => {
        expect(this._violations).to.have.length(1);

        const violation = this._violations.get(0);

        expect(violation.message).to.be.equal(expectedViolation.message);
        expect(violation.messageTemplate).to.be.equal(expectedViolation.messageTemplate);
        expect(violation.parameters).to.be.deep.equal(expectedViolation.parameters);
        expect(violation.plural).to.be.equal(expectedViolation.plural);
        expect(violation.root).to.be.deep.equal(expectedViolation.root);
        expect(violation.propertyPath).to.be.equal(expectedViolation.propertyPath);
        expect(violation.invalidValue).to.be.equal(expectedViolation.invalidValue);
        expect(violation.code).to.be.equal(expectedViolation.code);
        expect(violation.constraint).to.be.deep.equal(expectedViolation.constraint);
        expect(violation.cause).to.be.equal(expectedViolation.cause);
    };

    it ('should add violation', () => {
        this._builder.addViolation();
        assertViolationEquals(new ConstraintViolation(this._messageTemplate, this._messageTemplate, [], this._root, 'data', 'foo', null, null, new Valid()));
    });

    it ('should append property path', () => {
        this._builder
            .atPath('foo')
            .addViolation();

        assertViolationEquals(new ConstraintViolation(this._messageTemplate, this._messageTemplate, [], this._root, 'data.foo', 'foo', null, null, new Valid()));
    });

    it ('should append multiple property path', () => {
        this._builder
            .atPath('foo')
            .atPath('bar')
            .addViolation();

        assertViolationEquals(new ConstraintViolation(this._messageTemplate, this._messageTemplate, [], this._root, 'data.foo.bar', 'foo', null, null, new Valid()));
    });

    it ('should set code', () => {
        this._builder
            .setCode('5')
            .addViolation();

        assertViolationEquals(new ConstraintViolation(this._messageTemplate, this._messageTemplate, [], this._root, 'data', 'foo', null, '5', new Valid()));
    });

    it ('should set cause', () => {
        const cause = new LogicException();
        this._builder
            .setCause(cause)
            .addViolation();

        assertViolationEquals(new ConstraintViolation(this._messageTemplate, this._messageTemplate, [], this._root, 'data', 'foo', null, null, new Valid(), cause));
    });
});
