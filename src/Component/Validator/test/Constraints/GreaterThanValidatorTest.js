import { AbstractComparisonValidatorTestCase } from './AbstractComparisonValidatorTestCase';

const DateTime = Jymfony.Component.DateTime.DateTime;
const Fixtures = Jymfony.Component.Validator.Fixtures.Constraints;
const GreaterThan = Jymfony.Component.Validator.Constraints.GreaterThan;
const old_format = __jymfony.version_compare(process.versions.node, '12', '<');

export default class GreaterThanValidatorTest extends AbstractComparisonValidatorTestCase {
    createConstraint(options) {
        return new GreaterThan(options);
    }

    getErrorCode() {
        return GreaterThan.TOO_LOW_ERROR;
    }

    provideValidComparisons() {
        return [
            [ 2, 1 ],
            [ '333', '22' ],
            [ null, 1 ],
            [ new Date('2005-01-01'), new Date('2001-01-01') ],
            [ new Date('2005-01-01'), '2001-01-01' ],
            [ new DateTime('2005-01-01'), '2001-01-01' ],
            [ new Date('2005-01-01'), new DateTime('2001-01-01') ],
            [ new DateTime('2005-01-01'), new Date('2001-01-01') ],
            [ new Fixtures.ComparisonTest_Class(5), new Fixtures.ComparisonTest_Class(4) ],
        ];
    }

    provideValidComparisonsToPropertyPath() {
        return [
            [ 6 ],
        ];
    }

    provideInvalidComparisons() {
        return [
            [ 1, '1', 2, '2', 'number' ],
            [ 2, '2', 2, '2', 'number' ],
            [ new DateTime('2000/01/01'), old_format ? '1/1/2000' : 'Jan 1, 2000, 12:00 AM', new DateTime('2005/01/01'), old_format ? '1/1/2005' : 'Jan 1, 2005, 12:00 AM', 'Jymfony.Component.DateTime.DateTime' ],
            [ new DateTime('2000/01/01'), old_format ? '1/1/2000' : 'Jan 1, 2000, 12:00 AM', new DateTime('2000/01/01'), old_format ? '1/1/2000' : 'Jan 1, 2000, 12:00 AM', 'Jymfony.Component.DateTime.DateTime' ],
            [ new DateTime('2000/01/01'), old_format ? '1/1/2000' : 'Jan 1, 2000, 12:00 AM', new Date('2005-01-01'), old_format ? '1/1/2005' : 'Jan 1, 2005, 12:00 AM', 'Date' ],
            [ new DateTime('2000/01/01'), old_format ? '1/1/2000' : 'Jan 1, 2000, 12:00 AM', new Date('2000-01-01'), old_format ? '1/1/2000' : 'Jan 1, 2000, 12:00 AM', 'Date' ],
            [ new DateTime('2000/01/01'), old_format ? '1/1/2000' : 'Jan 1, 2000, 12:00 AM', '2005-01-01', '"2005-01-01"', 'string' ],
            [ new DateTime('2000/01/01'), old_format ? '1/1/2000' : 'Jan 1, 2000, 12:00 AM', '2000-01-01', '"2000-01-01"', 'string' ],
            [ new Fixtures.ComparisonTest_Class(4), '4', new Fixtures.ComparisonTest_Class(5), '5', 'Jymfony.Component.Validator.Fixtures.Constraints.ComparisonTest_Class' ],
            [ new Fixtures.ComparisonTest_Class(5), '5', new Fixtures.ComparisonTest_Class(5), '5', 'Jymfony.Component.Validator.Fixtures.Constraints.ComparisonTest_Class' ],
            [ '22', '"22"', '333', '"333"', 'string' ],
            [ '22', '"22"', '22', '"22"', 'string' ],
        ];
    }

    provideComparisonsToNullValueAtPropertyPath() {
        return [
            [ 5, '5', true ],
        ];
    }
}
