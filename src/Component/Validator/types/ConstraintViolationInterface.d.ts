declare namespace Jymfony.Component.Validator {
    /**
     * A violation of a constraint that happened during validation.
     *
     * For each constraint that fails during validation one or more violations are
     * created. The violations store the violation message, the path to the failing
     * element in the validation graph and the root element that was originally
     * passed to the validator. For example, take the following graph:
     *
     *     (Person)---(firstName: string)
     *          \
     *       (address: Address)---(street: string)
     *
     * If the <tt>Person</tt> object is validated and validation fails for the
     * "firstName" property, the generated violation has the <tt>Person</tt>
     * instance as root and the property path "firstName". If validation fails
     * for the "street" property of the related <tt>Address</tt> instance, the root
     * element is still the person, but the property path is "address.street".
     */
    export class ConstraintViolationInterface {
        public static readonly definition: Newable<ConstraintViolationInterface>;

        /**
         * Returns the violation message.
         *
         * @returns The violation message
         */
        public readonly message: string;

        /**
         * Returns the raw violation message.
         *
         * The raw violation message contains placeholders for the parameters
         * returned by {@link parameters}. Typically you'll pass the
         * message template and parameters to a translation engine.
         *
         * @returns The raw violation message
         */
        public readonly messageTemplate: string;

        /**
         * Returns the parameters to be inserted into the raw violation message.
         *
         * @returns A possibly empty list of parameters indexed by the names that appear in the message template
         *
         * @see messageTemplate()
         */
        public readonly parameters: Record<string, string>

        /**
         * Returns a number for pluralizing the violation message.
         *
         * For example, the message template could have different translation based
         * on a parameter "choices":
         *
         * <ul>
         * <li>Please select exactly one entry. (choices=1)</li>
         * <li>Please select two entries. (choices=2)</li>
         * </ul>
         *
         * This method returns the value of the parameter for choosing the right
         * pluralization form (in this case "choices").
         *
         * @returns The number to use to pluralize of the message
         */
        public readonly plural: null | number;

        /**
         * Returns the root element of the validation.
         *
         * @returns The value that was passed originally to the validator when
         *          the validation was started. Because the validator traverses
         *          the object graph, the value at which the violation occurs
         *          is not necessarily the value that was originally validated.
         */
        public readonly root: any;

        /**
         * Returns the property path from the root element to the violation.
         *
         * @returns The property path indicates how the validator reached
         *          the invalid value from the root element. If the root
         *          element is a <tt>Person</tt> instance with a property
         *          "address" that contains an <tt>Address</tt> instance
         *          with an invalid property "street", the generated property
         *          path is "address.street".
         */
        public readonly propertyPath: string;

        /**
         * Returns the value that caused the violation.
         *
         * @returns the invalid value that caused the validated constraint to fail
         */
        public readonly invalidValue: any;

        /**
         * Returns a machine-digestible error code for the violation.
         *
         * @returns The error code
         */
        public readonly code: string | null;
    }
}
