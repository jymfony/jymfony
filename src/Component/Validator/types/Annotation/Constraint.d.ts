declare namespace Jymfony.Component.Validator.Annotation {

    /**
     * Constraint annotation.
     *
     * @param {string|Function} class_
     * @param {object} options
     */
    export class Constraint {
        __construct(class_: string | Newable, options?: any): void;
        constructor(class_: string | Newable, options?: any);

        /**
         * Generates a new constraint object.
         *
         * @returns {Jymfony.Contracts.Validator.Constraint}
         */
        generateConstraint(): Constraint
    }
}
