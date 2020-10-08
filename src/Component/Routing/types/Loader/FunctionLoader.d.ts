declare namespace Jymfony.Component.Routing.Loader {
    import Loader = Jymfony.Component.Config.Loader.Loader;

    /**
     * ClosureLoader loads routes from a function.
     *
     * The closure must return a RouteCollection instance.
     */
    export class FunctionLoader extends Loader {
        /**
         * Loads a Closure.
         */
        load(closure: Invokable<any>): RouteCollection;

        /**
         * @inheritdoc
         */
        supports(resource: any, type?: string | null): boolean;
    }
}
