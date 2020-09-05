/**
 * Creates instances of {@link ExecutionContextInterface}.
 *
 * You can use a custom factory if you want to customize the execution context
 * that is passed through the validation run.
 *
 * @memberOf Jymfony.Component.Validator.Context
 */
class ExecutionContextFactoryInterface
{
    /**
     * Creates a new execution context.
     *
     * @param {Jymfony.Component.Validator.Validator.ValidatorInterface} validator
     * @param {*} root The root value of the validated object graph
     *
     * @returns {Jymfony.Component.Validator.Context.ExecutionContextInterface} The new execution context
     */
    createContext(validator, root) { }
}

export default getInterface(ExecutionContextFactoryInterface);
