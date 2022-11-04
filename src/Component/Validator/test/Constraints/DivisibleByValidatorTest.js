import { AbstractComparisonValidatorTestCase } from './AbstractComparisonValidatorTestCase';
import { expect } from 'chai';

const DivisibleBy = Jymfony.Component.Validator.Constraints.DivisibleBy;
const UnexpectedValueException = Jymfony.Component.Validator.Exception.UnexpectedValueException;

export default class DivisibleByValidatorTest extends AbstractComparisonValidatorTestCase {
    get testCaseName() {
        return '[Validator] ' + super.testCaseName;
    }

    createConstraint(options = null) {
        return new DivisibleBy(options);
    }

    getErrorCode() {
        return DivisibleBy.NOT_DIVISIBLE_BY;
    }

    /**
     * @inheritdoc
     */
    provideValidComparisons() {
        return [
            [ -7, 1 ],
            [ 0, 3.1415 ],
            [ 42, 42 ],
            [ 42, 21 ],
            [ 3.25, 0.25 ],
            [ '100', '10' ],
            [ 4.1, 0.1 ],
            [ -4.1, 0.1 ],
        ];
    }

    /**
     * @inheritdoc
     */
    provideValidComparisonsToPropertyPath() {
        return [
            [ 25 ],
        ];
    }

    /**
     * @inheritdoc
     */
    provideInvalidComparisons() {
        return [
            [ 1, '1', 2, '2', 'number' ],
            [ 10, '10', 3, '3', 'number' ],
            [ 10, '10', 0, '0', 'number' ],
            [ 42, '42', Infinity, 'Infinity', 'number' ],
            [ 4.15, '4.15', 0.1, '0.1', 'number' ],
            [ '22', '"22"', '10', '"10"', 'string' ],
        ];
    }

    @dataProvider('throwsOnNonNumericValuesProvider')
    async testThrowsOnNonNumericValues(expectedGivenType, value, comparedValue) {
        const constraint = this.createConstraint({
            value: comparedValue,
        });

        await expect(value).to.be.validated.by(constraint.validatedBy)
            .with.constraint(constraint)
            .and.throw(
                UnexpectedValueException,
                new RegExp(__jymfony.sprintf('Expected argument of type "numeric", "%s" given', expectedGivenType))
            );
    }

    throwsOnNonNumericValuesProvider() {
        return [
            [ 'object', 2, {} ],
            [ 'Set', new Set(), 12 ],
        ];
    }

    provideComparisonsToNullValueAtPropertyPath() {
        this.markTestSkipped('DivisibleByValidator rejects null values.');
    }
}
