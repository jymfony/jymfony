/**
 * Builds {@link Jymfony.Component.Validator.ConstraintViolationInterface}
 * objects.
 *
 * Use the various methods on this interface to configure the built violation.
 * Finally, call {@link addViolation()} to add the violation to the current
 * execution context.
 *
 * @memberOf Jymfony.Component.Validator.Violation
 */
class ConstraintViolationBuilderInterface {
    /**
     * Stores the property path at which the violation should be generated.
     *
     * The passed path will be appended to the current property path of the
     * execution context.
     *
     * @param {string} path The property path
     *
     * @returns {Jymfony.Component.Validator.Violation.ConstraintViolationBuilderInterface}
     */
    atPath(path) { }

    /**
     * Sets a parameter to be inserted into the violation message.
     *
     * @param {string} key The name of the parameter
     * @param {string} value The value to be inserted in the parameter's place
     *
     * @returns {Jymfony.Component.Validator.Violation.ConstraintViolationBuilderInterface}
     */
    setParameter(key, value) { }

    /**
     * Sets all parameters to be inserted into the violation message.
     *
     * @param {Object.<string, string>} parameters An object with the parameter names as keys and
     *                                             the values to be inserted in their place as
     *                                             values
     *
     * @returns {Jymfony.Component.Validator.Violation.ConstraintViolationBuilderInterface}
     */
    setParameters(parameters) { }

    /**
     * Sets the translation domain which should be used for translating the
     * violation message.
     *
     * @param {string} translationDomain The translation domain
     *
     * @returns {Jymfony.Component.Validator.Violation.ConstraintViolationBuilderInterface}
     *
     * @see Jymfony.Contracts.Translation.TranslatorInterface
     */
    setTranslationDomain(translationDomain) { }

    /**
     * Sets the invalid value that caused this violation.
     *
     * @param {*} invalidValue The invalid value
     *
     * @returns {Jymfony.Component.Validator.Violation.ConstraintViolationBuilderInterface}
     */
    setInvalidValue(invalidValue) { }

    /**
     * Sets the number which determines how the plural form of the violation
     * message is chosen when it is translated.
     *
     * @param {int} number The number for determining the plural form
     *
     * @returns {Jymfony.Component.Validator.Violation.ConstraintViolationBuilderInterface}
     *
     * @see Jymfony.Contracts.Translation.TranslatorInterface.trans()
     */
    setPlural(number) { }

    /**
     * Sets the violation code.
     *
     * @param {string|null} code The violation code
     *
     * @returns {Jymfony.Component.Validator.Violation.ConstraintViolationBuilderInterface}
     */
    setCode(code) { }

    /**
     * Sets the cause of the violation.
     *
     * @param {*} cause The cause of the violation
     *
     * @returns {Jymfony.Component.Validator.Violation.ConstraintViolationBuilderInterface}
     */
    setCause(cause) { }

    /**
     * Adds the violation to the current execution context.
     */
    addViolation() { }
}

export default getInterface(ConstraintViolationBuilderInterface);
