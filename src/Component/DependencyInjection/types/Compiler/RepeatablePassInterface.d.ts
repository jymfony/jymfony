declare namespace Jymfony.Component.DependencyInjection.Compiler {
    /**
     * A pass that might be run repeatedly.
     */
    export class RepeatablePassInterface extends CompilerPassInterface.definition implements MixinInterface {
        public static readonly definition: Newable<RepeatablePassInterface>;

        /**
         * Sets the RepeatedPass interface.
         */
        setRepeatedPass(pass: RepeatedPass): void;
    }
}
