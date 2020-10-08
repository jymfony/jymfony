import { AbstractComparisonValidatorTestCase } from './AbstractComparisonValidatorTestCase';

const DateTime = Jymfony.Component.DateTime.DateTime;
const IdenticalTo = Jymfony.Component.Validator.Constraints.IdenticalTo;

export default class IdenticalToValidatorTest extends AbstractComparisonValidatorTestCase {
    createConstraint(options) {
        return new IdenticalTo(options);
    }

    getErrorCode() {
        return IdenticalTo.NOT_IDENTICAL_ERROR;
    }

    provideValidComparisons() {
        return [
            [ 3, 3 ],
            [ 'a', 'a' ],
            [ new Date('2000-01-01'), new Date('2000-01-01') ],
            [ new Date('2000-01-01'), new DateTime('2000-01-01') ],
            [ new DateTime('2000-01-01'), new Date('2000-01-01') ],
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
            [ 3, '3', '3', '"3"', 'string' ],
            [ '22', '"22"', '333', '"333"', 'string' ],
        ];
    }

    provideComparisonsToNullValueAtPropertyPath() {
        return [
            [ 5, '5', false ],
        ];
    }
}
