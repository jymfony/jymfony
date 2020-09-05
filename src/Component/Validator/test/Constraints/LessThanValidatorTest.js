import { AbstractComparisonValidatorTestCase } from './AbstractComparisonValidatorTestCase';

const DateTime = Jymfony.Component.DateTime.DateTime;
const Fixtures = Jymfony.Component.Validator.Fixtures.Constraints;
const LessThan = Jymfony.Component.Validator.Constraints.LessThan;
const old_format = __jymfony.version_compare(process.versions.node, '12', '<');

export default class LessThanValidatorTest extends AbstractComparisonValidatorTestCase {
    createConstraint(options) {
        return new LessThan(options);
    }

    getErrorCode() {
        return LessThan.TOO_HIGH_ERROR;
    }

    provideValidComparisons() {
        return [
            [ 1, 2 ],
            [ new Date('2000-01-01'), new Date('2020-01-01') ],
            [ new Date('2000-01-01'), '2020-01-01' ],
            [ new DateTime('2000-01-01'), '2020-01-01' ],
            [ new Date('2000-01-01'), new DateTime('2020-01-01') ],
            [ new DateTime('2000-01-01'), new Date('2020-01-01') ],
            [ new Fixtures.ComparisonTest_Class(4), new Fixtures.ComparisonTest_Class(5) ],
            [ 'a', 'z' ],
            [ null, 1 ],
        ];
    }

    provideValidComparisonsToPropertyPath() {
        return [
            [ 4 ],
        ];
    }

    provideInvalidComparisons() {
        return [
            [ 2, '2', 1, '1', 'number' ],
            [ 1, '1', 1, '1', 'number' ],
            [ new Date('2000-01-01'), old_format ? '1/1/2000' : 'Jan 1, 2000, 12:00 AM', new Date('2000-01-01'), old_format ? '1/1/2000' : 'Jan 1, 2000, 12:00 AM', 'Date' ],
            [ new Date('2000-01-01'), old_format ? '1/1/2000' : 'Jan 1, 2000, 12:00 AM', '2000-01-01', '"2000-01-01"', 'string' ],
            [ new DateTime('2000-01-01'), old_format ? '1/1/2000' : 'Jan 1, 2000, 12:00 AM', '2000-01-01', '"2000-01-01"', 'string' ],
            [ new Date('2000-01-01'), old_format ? '1/1/2000' : 'Jan 1, 2000, 12:00 AM', new DateTime('2000-01-01'), old_format ? '1/1/2000' : 'Jan 1, 2000, 12:00 AM', 'Jymfony.Component.DateTime.DateTime' ],
            [ new DateTime('2000-01-01'), old_format ? '1/1/2000' : 'Jan 1, 2000, 12:00 AM', new Date('2000-01-01'), old_format ? '1/1/2000' : 'Jan 1, 2000, 12:00 AM', 'Date' ],
            [ new DateTime('2010-01-01'), old_format ? '1/1/2010' : 'Jan 1, 2010, 12:00 AM', new DateTime('2000/01/01'), old_format ? '1/1/2000' : 'Jan 1, 2000, 12:00 AM', 'Jymfony.Component.DateTime.DateTime' ],
            [ new DateTime('2010/01/01'), old_format ? '1/1/2010' : 'Jan 1, 2010, 12:00 AM', new Date('2000-01-01'), old_format ? '1/1/2000' : 'Jan 1, 2000, 12:00 AM', 'Date' ],
            [ new DateTime('2010/01/01'), old_format ? '1/1/2010' : 'Jan 1, 2010, 12:00 AM', '2000-01-01', '"2000-01-01"', 'string' ],
            [ new Fixtures.ComparisonTest_Class(5), '5', new Fixtures.ComparisonTest_Class(5), '5', 'Jymfony.Component.Validator.Fixtures.Constraints.ComparisonTest_Class' ],
            [ new Fixtures.ComparisonTest_Class(5), '5', new Fixtures.ComparisonTest_Class(4), '4', 'Jymfony.Component.Validator.Fixtures.Constraints.ComparisonTest_Class' ],
            [ 'a', '"a"', 'a', '"a"', 'string' ],
            [ 'c', '"c"', 'b', '"b"', 'string' ],
        ];
    }

    provideComparisonsToNullValueAtPropertyPath() {
        return [
            [ 5, '5', true ],
        ];
    }
}
