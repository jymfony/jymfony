const ResolverInterface = Jymfony.Component.Runtime.ResolverInterface;

/**
 * @memberof Jymfony.Component.Runtime.Resolver
 */
export default class ClosureResolver extends implementationOf(ResolverInterface) {
    /**
     * @type {Function}
     */
    #closure;

    /**
     * @type {function(): *[]}
     */
    #arguments;

    __construct(closure, args) {
        this.#closure = closure;
        this.#arguments = args;
    }

    resolve() {
        return [ this.#closure, this.#arguments() ];
    }
}
