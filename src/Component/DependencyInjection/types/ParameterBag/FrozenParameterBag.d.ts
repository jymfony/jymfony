declare namespace Jymfony.Component.DependencyInjection.ParameterBag {
    /**
     * Holds read-only parameters.
     */
    export class FrozenParameterBag extends ParameterBag {
        /**
         * Constructor.
         */
        __construct(params: Record<string, any>): void;

        /**
         * @inheritdoc
         */
        clear(): never;

        /**
         * @inheritdoc
         */
        add(params: Record<string, any>, overwrite?: boolean): never;

        /**
         * @inheritdoc
         */
        set(name: string, value: any): never;

        /**
         * @inheritdoc
         */
        remove(name: string): never;
    }
}
