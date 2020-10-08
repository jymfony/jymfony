import { @dataProvider } from '@jymfony/decorators';
import { expect } from 'chai';

const Count = Jymfony.Component.Validator.Constraints.Count;
const CountValidator = Jymfony.Component.Validator.Constraints.CountValidator;
const UnexpectedValueException = Jymfony.Component.Validator.Exception.UnexpectedValueException;
const TestCase = Jymfony.Component.Testing.Framework.TestCase;

export class CountValidatorTest extends TestCase {
    /**
     * @returns {ArrayLike}
     *
     * @abstract
     */
    createCollection(content) {
        throw new Error('Must be implemented');
    }

    testNullIsValid() {
        expect(null).to.be.validated.by(CountValidator)
            .with.constraint(new Count(1))
            .and.raise.no.violations();
    }

    testUndefinedIsValid() {
        expect(undefined).to.be.validated.by(CountValidator)
            .with.constraint(new Count(1))
            .and.raise.no.violations();
    }

    async testExpectsCountableType() {
        await expect(true).to.be.validated.by(CountValidator)
            .with.constraint(new Count(5))
            .and.throw(UnexpectedValueException);
    }

    getThreeOrLessElements() {
        return [
            [ this.createCollection([ 1 ]) ],
            [ this.createCollection([ 1, 2 ]) ],
            [ this.createCollection([ 1, 2, 3 ]) ],
            [ this.createCollection({ a: 1, b: 2, c: 3 }) ],
        ];
    }

    getFourElements() {
        return [
            [ this.createCollection([ 1, 2, 3, 4 ]) ],
            [ this.createCollection({ a: 1, b: 2, c: 3, d: 4 }) ],
        ];
    }

    getFiveOrMoreElements() {
        return [
            [ this.createCollection([ 1, 2, 3, 4, 5 ]) ],
            [ this.createCollection([ 1, 2, 3, 4, 5, 6 ]) ],
            [ this.createCollection({ a: 1, b: 2, c: 3, d: 4, e: 5 }) ],
        ];
    }

    @dataProvider('getThreeOrLessElements')
    async testValidValuesMax(value) {
        await expect(value).to.be.validated.by(CountValidator)
            .with.constraint(new Count({ max: 3 }))
            .and.raise.no.violations();
    }

    @dataProvider('getFiveOrMoreElements')
    async testValidValuesMin(value) {
        await expect(value).to.be.validated.by(CountValidator)
            .with.constraint(new Count({ min: 5 }))
            .and.raise.no.violations();
    }

    @dataProvider('getFourElements')
    async testValidValuesExact(value) {
        await expect(value).to.be.validated.by(CountValidator)
            .with.constraint(new Count(4))
            .and.raise.no.violations();
    }

    @dataProvider('getFiveOrMoreElements')
    async testTooManyValues(value) {
        await expect(value).to.be.validated.by(CountValidator)
            .with.constraint(new Count({
                max: 4,
                maxMessage: 'myMessage',
            })).and.raise.violations([ {
                message: 'myMessage',
                parameters: {
                    '{{ count }}': isObjectLiteral(value) ? Object.keys(value).length : value.size || value.length,
                    '{{ limit }}': 4,
                },
                invalidValue: value,
                plural: 4,
                code: Count.TOO_MANY_ERROR,
            } ]);
    }

    @dataProvider('getThreeOrLessElements')
    async testTooFewValues(value) {
        await expect(value).to.be.validated.by(CountValidator)
            .with.constraint(new Count({
                min: 4,
                minMessage: 'myMessage',
            })).and.raise.violations([ {
                message: 'myMessage',
                parameters: {
                    '{{ count }}': isObjectLiteral(value) ? Object.keys(value).length : value.size || value.length,
                    '{{ limit }}': 4,
                },
                invalidValue: value,
                plural: 4,
                code: Count.TOO_FEW_ERROR,
            } ]);
    }

    @dataProvider('getFiveOrMoreElements')
    async testTooManyValuesExact(value) {
        await expect(value).to.be.validated.by(CountValidator)
            .with.constraint(new Count({
                min: 4,
                max: 4,
                exactMessage: 'myMessage',
            })).and.raise.violations([ {
                message: 'myMessage',
                parameters: {
                    '{{ count }}': isObjectLiteral(value) ? Object.keys(value).length : value.size || value.length,
                    '{{ limit }}': 4,
                },
                invalidValue: value,
                plural: 4,
                code: Count.TOO_MANY_ERROR,
            } ]);
    }

    @dataProvider('getThreeOrLessElements')
    async testTooFewValuesExact(value) {
        await expect(value).to.be.validated.by(CountValidator)
            .with.constraint(new Count({
                min: 4,
                max: 4,
                exactMessage: 'myMessage',
            })).and.raise.violations([ {
                message: 'myMessage',
                parameters: {
                    '{{ count }}': isObjectLiteral(value) ? Object.keys(value).length : value.size || value.length,
                    '{{ limit }}': 4,
                },
                invalidValue: value,
                plural: 4,
                code: Count.TOO_FEW_ERROR,
            } ]);
    }

    testDefaultOption() {
        const constraint = new Count(5);

        expect(constraint.min).to.be.equal(5);
        expect(constraint.max).to.be.equal(5);
    }

    testConstraintValueOption() {
        const constraint = new Count({ value: 5, exactMessage: 'message' });

        expect(constraint.min).to.be.equal(5);
        expect(constraint.max).to.be.equal(5);
        expect(constraint.exactMessage).to.be.equal('message');
    }

    // Since the contextual validator is mocked, this test only asserts that it
    // is called with the right DivisibleBy constraint.
    async testDivisibleBy() {
        const constraint = new Count({
            divisibleBy: 3,
            divisibleByMessage: 'foo {{ compared_value }}',
        });

        await expect(['foo', 'bar', 'ccc']).to.be.validated.by(CountValidator)
            .with.constraint(constraint)
            .and.raise.no.violations();
    }
}
