import { expect } from 'chai';

const ConstraintDefinitionException = Jymfony.Component.Validator.Exception.ConstraintDefinitionException;
const DateTime = Jymfony.Component.DateTime.DateTime;
const Fixtures = Jymfony.Component.Validator.Fixtures.Constraints;
const DataProvider = Jymfony.Component.Testing.Annotation.DataProvider;
const TestCase = Jymfony.Component.Testing.Framework.TestCase;

const DEFAULT_INVALID_CONSTRAINT_OPTIONS = [ {} ];

/**
 * @abstract
 */
export class AbstractComparisonValidatorTestCase extends TestCase {
    get testCaseName() {
        return '[Validator] ' + super.testCaseName;
    }

    provideInvalidConstraintOptions() {
        return [ DEFAULT_INVALID_CONSTRAINT_OPTIONS ];
    }

    get defaultTimeout() {
        return 10000;
    }

    @DataProvider('provideInvalidConstraintOptions')
    testThrowsContstraintExceptionIfNoValueOrPropertyPath(options) {
        expect(() => this.createConstraint(options)).to.throw(
            ConstraintDefinitionException,
            /requires either the "value" or "propertyPath" option to be set/
        );
    }

    throwsConstraintExceptionIfBothValueAndPropertyPath() {
        expect(() => this.createConstraint({
            value: 'value',
            propertyPath: 'property_path',
        })).to.throw(
            ConstraintDefinitionException,
            /requires only one of the "value" or "propertyPath" options to be set, not both/
        );
    }

    /**
     * @abstract
     */
    provideValidComparisons() {
        throw new Error('Must be implemented');
    }

    @DataProvider('provideValidComparisons')
    async testShouldNotRaiseViolationsOnValidComparison(dirtyValue, comparisonValue) {
        const constraint = this.createConstraint({ value: comparisonValue });
        await expect(dirtyValue).to.be.validated.by(constraint.validatedBy)
            .with.constraint(constraint)
            .and.raise.no.violations();
    };

    /**
     * @abstract
     */
    provideValidComparisonsToPropertyPath() {
        throw new Error('Must be implemented');
    }

    @DataProvider('provideValidComparisonsToPropertyPath')
    async testShouldNotRaiseViolationsOnPropertyPath(comparedValue) {
        const constraint = this.createConstraint({ propertyPath: 'value' });
        const object = new Fixtures.ComparisonTest_Class(5);

        await expect(comparedValue).to.be
            .validated.by(constraint.validatedBy, { object, rootObject: object })
            .with.constraint(constraint)
            .and.raise.no.violations();
    }

    async testValidComparisonOnNullObjectWithPropertyPath() {
        const constraint = this.createConstraint({ propertyPath: 'propertyPath' });
        const object = null;

        await expect('some data').to.be
            .validated.by(constraint.validatedBy, { object, rootObject: object })
            .with.constraint(constraint)
            .and.raise.no.violations();
    }

    async testInvalidValuePath() {
        const constraint = this.createConstraint({ propertyPath: 'foo' });
        const object = new Fixtures.ComparisonTest_Class(5);

        await expect('some data').to.be
            .validated.by(constraint.validatedBy, { object, rootObject: object })
            .with.constraint(constraint)
            .and.throw(ConstraintDefinitionException, /Invalid property path "foo" provided to ".+" constraint/);
    }

    /**
     * @abstract
     */
    provideInvalidComparisons() {
        throw new Error('Must be implemented');
    }

    @DataProvider('provideInvalidComparisons')
    async testShouldRaiseViolationOnInvalidValue(dirtyValue, dirtyValueAsString, comparedValue, comparedValueAsString, comparedValueType) {
        const constraint = this.createConstraint({ value: comparedValue });
        constraint.message = 'Constraint Message';

        await expect(dirtyValue)
            .to.be.validated.by(constraint.validatedBy)
            .with.constraint(constraint)
            .and.raise.violations([ {
                message: 'Constraint Message',
                code: this.getErrorCode(),
                parameters: {
                    '{{ value }}': dirtyValueAsString,
                    '{{ compared_value }}': comparedValueAsString,
                    '{{ compared_value_type }}': comparedValueType,
                },
                propertyPath: '',
            } ]);
    }

    async invalidComparisonToPropertyPathAddsPathAsParameter () {
        const [ dirtyValue, dirtyValueAsString, comparedValue, comparedValueAsString, comparedValueType ] = [ ...this.provideInvalidComparisons() ][0];
        const constraint = this.createConstraint({ propertyPath: 'value' });
        constraint.message = 'Constraint Message';

        const object = new Fixtures.ComparisonTest_Class(comparedValue);

        await expect(dirtyValue)
            .to.be.validated.by(constraint.validatedBy, { object })
            .with.constraint(constraint)
            .and.raise.violations([ {
                message: 'Constraint Message',
                code: this.getErrorCode(),
                parameters: {
                    '{{ value }}': dirtyValueAsString,
                    '{{ compared_value }}': comparedValueAsString,
                    '{{ compared_value_type }}': comparedValueType,
                    '{{ compared_value_path }}': 'value',
                },
                invalidValue: dirtyValue,
                propertyPath: '',
            } ]);
    }

    throwsOnInvalidStringDatesProvider() {
        const constraint = this.createConstraint({ value: 'foo' });

        return [
            [ constraint, /The compared value "foo" could not be converted to a "Date" instance in the ".+" constraint\./, new Date() ],
            [ constraint, /The compared value "foo" could not be converted to a "Jymfony\.Component\.DateTime\.DateTime" instance in the ".+" constraint\./, new DateTime() ],
        ];
    }

    @DataProvider('throwsOnInvalidStringDatesProvider')
    async throwsOnInvalidStringDates(constraint, expectedMessageRegex, value) {
        await expect(value)
            .to.be.validated.by(constraint.validatedBy)
            .with.constraint(constraint)
            .and.throw(ConstraintDefinitionException, expectedMessageRegex);
    }

    /**
     * @abstract
     */
    provideComparisonsToNullValueAtPropertyPath() {
        throw new Error('Must be implemented');
    }

    @DataProvider('provideComparisonsToNullValueAtPropertyPath')
    async compareWithNullValueAtPropertyAt([ dirtyValue, dirtyValueAsString, isValid ]) {
        const constraint = this.createConstraint({ propertyPath: 'value' });
        constraint.message = 'Constraint Message';

        const object = new Fixtures.ComparisonTest_Class(null);
        const expectation = expect(dirtyValue)
            .to.be.validated.by(constraint.validatedBy, { object })
            .with.constraint(constraint)
            .and.raise;

        if (isValid) {
            await expectation.no.violations();
        } else {
            await expectation.violations([ {
                message: 'Constraint Message',
                code: this.getErrorCode(),
                parameters: {
                    '{{ value }}': dirtyValueAsString,
                    '{{ compared_value }}': 'null',
                    '{{ compared_value_type }}': 'null',
                    '{{ compared_value_path }}': 'value',
                },
                invalidValue: dirtyValue,
                propertyPath: '',
            } ]);
        }
    }

    /**
     * @returns {Jymfony.Component.Validator.Constraints.AbstractComparison}
     *
     * @abstract
     */
    createConstraint(options) { // eslint-disable-line no-unused-vars
        throw new Error('Must be implemented');
    }

    getErrorCode() {
        return null;
    }
}
