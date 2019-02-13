declare namespace Jymfony.Component.DependencyInjection.ParameterBag {
    import ContainerInterface = Jymfony.Component.DependencyInjection.ContainerInterface;

    export class ContainerBagInterface extends ContainerInterface.definition {
        /**
         * Gets the service container parameters.
         */
        all(): Record<string, any>;

        /**
         * Replaces parameter placeholders (%name%) by their values.
         *
         * @throws {Jymfony.Component.DependencyInjection.Exception.ParameterNotFoundException} if a placeholder references a parameter that does not exist
         */
        resolveValue(value: any): any;

        /**
         * Escape parameter placeholders %.
         */
        escapeValue(value: any): any;

        /**
         * Unescape parameter placeholders %.
         */
        unescapeValue(value: any): any;
    }
}
