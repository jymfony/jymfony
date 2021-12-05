import { AbstractComparisonValidatorTestCase } from './AbstractComparisonValidatorTestCase';

const DateTime = Jymfony.Component.DateTime.DateTime;
const EqualTo = Jymfony.Component.Validator.Constraints.EqualTo;
const Fixtures = Jymfony.Component.Validator.Fixtures.Constraints;

export default class EqualToValidatorTest extends AbstractComparisonValidatorTestCase {
    get testCaseName() {
        return '[Validator] ' + super.testCaseName;
    }

    createConstraint(options) {
        return new EqualTo(options);
    }

    getErrorCode() {
        return EqualTo.NOT_EQUAL_ERROR;
    }

    provideValidComparisons() {
        return [
            [ 3, 3 ],
            [ 3, '3' ],
            [ 'a', 'a' ],
            [ new Date('2000-01-01'), new Date('2000-01-01') ],
            [ new Date('2000-01-01'), new DateTime('2000-01-01') ],
            [ new DateTime('2000-01-01'), new Date('2000-01-01') ],
            [ new Fixtures.ComparisonTest_Class(4), new Fixtures.ComparisonTest_Class(4) ],
        ];
    }

    provideValidComparisonsToPropertyPath() {
        return [
            [ 5 ],
        ];
    }

    provideInvalidComparisons() {
        return [
            [ 1, '1', 2, '2', 'number' ],
            [ '22', '"22"', '333', '"333"', 'string' ],
            [ new Fixtures.ComparisonTest_Class(4), '4', new Fixtures.ComparisonTest_Class(5), '5', 'Jymfony.Component.Validator.Fixtures.Constraints.ComparisonTest_Class' ],
        ];
    }

    provideComparisonsToNullValueAtPropertyPath() {
        return [
            [ 5, '5', false ],
        ];
    }
}
