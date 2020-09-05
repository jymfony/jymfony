import { AbstractComparisonValidatorTestCase } from './AbstractComparisonValidatorTestCase';

const DateTime = Jymfony.Component.DateTime.DateTime;
const Fixtures = Jymfony.Component.Validator.Fixtures.Constraints;
const NotIdenticalTo = Jymfony.Component.Validator.Constraints.NotIdenticalTo;
const old_format = __jymfony.version_compare(process.versions.node, '12', '<');

export default class NotIdenticalToValidatorTest extends AbstractComparisonValidatorTestCase {
    createConstraint(options) {
        return new NotIdenticalTo(options);
    }

    getErrorCode() {
        return NotIdenticalTo.IS_IDENTICAL_ERROR;
    }

    provideValidComparisons() {
        return [
            [ 1, 2 ],
            [ 1, '1' ],
            [ '22', '33' ],
            [ 33, '33' ],
            [ new Date('2001-01-01'), new Date('2000-01-01') ],
            [ new Date('2001-01-01'), '2000-01-01' ],
            [ new DateTime('2001-01-01'), '2000-01-01' ],
            [ new Date('2001-01-01'), new DateTime('2000-01-01') ],
            [ new DateTime('2001-01-01'), new Date('2000-01-01') ],
            [ new Fixtures.ComparisonTest_Class(4), new Fixtures.ComparisonTest_Class(5) ],
            [ 'a', 'z' ],
            [ null, 1 ],
        ];
    }

    provideValidComparisonsToPropertyPath() {
        return [
            [ 0 ],
        ];
    }

    provideInvalidComparisons() {
        return [
            [ 3, '3', 3, '3', 'number' ],
            [ 'a', '"a"', 'a', '"a"', 'string' ],
            [ new DateTime('2000-01-01'), old_format ? '1/1/2000' : 'Jan 1, 2000, 12:00 AM', new DateTime('2000/01/01'), old_format ? '1/1/2000' : 'Jan 1, 2000, 12:00 AM', 'Jymfony.Component.DateTime.DateTime' ],
            [ new DateTime('2000/01/01'), old_format ? '1/1/2000' : 'Jan 1, 2000, 12:00 AM', new Date('2000-01-01'), old_format ? '1/1/2000' : 'Jan 1, 2000, 12:00 AM', 'Date' ],
            [ new DateTime('2000/01/01'), old_format ? '1/1/2000' : 'Jan 1, 2000, 12:00 AM', '2000-01-01', '"2000-01-01"', 'string' ],
            [ new Fixtures.ComparisonTest_Class(4), '4', new Fixtures.ComparisonTest_Class(4), '4', 'Jymfony.Component.Validator.Fixtures.Constraints.ComparisonTest_Class' ],
        ];
    }

    provideComparisonsToNullValueAtPropertyPath() {
        return [
            [ 5, '5', true ],
        ];
    }
}
