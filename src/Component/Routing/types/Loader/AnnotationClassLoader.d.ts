declare namespace Jymfony.Component.Routing.Loader {
    import LoaderInterface = Jymfony.Component.Config.Loader.LoaderInterface;
    import LoaderResolverInterface = Jymfony.Component.Config.Loader.LoaderResolverInterface;

    /**
     * AnnotationClassLoader loads routing information from a class and its methods.
     *
     * You need to define an implementation for the getRouteDefaults() method. Most of the
     * time, this method should define a function to be called for the route
     * (a controller in MVC speak).
     *
     * The @Route decorator can be set on the class (for global parameters),
     * and on each method.
     *
     * The @Route decorator main value is the route path. The annotation also
     * recognizes several parameters: requirements, options, defaults, schemes,
     * methods, host, and name.
     * Here is an example of how you should be able to use it:
     *     @Route("/Blog")
     *     export default class Blog {
     *         @Route({ path: "/", name: "blog_index" })
     *         index() {
     *         }
     *
     *         @Route({ path: "/{id}", name: "blog_post", requirements: { id: "\d+" } })
     *         show() {
     *         }
     *     }
     */
    export abstract class AnnotationClassLoader extends implementationOf(LoaderInterface) {
        public resolver: LoaderResolverInterface;
        protected _defaultRouteIndex: number;

        __construct(): void;
        constructor();

        /**
         * Loads from annotations from a class.
         *
         * @param class_ A class name
         *
         * @throws {InvalidArgumentException} When route can't be parsed
         */
        load(class_: string): RouteCollection;

        /**
         * @inheritdoc
         */
        supports(resource: any, type?: string): boolean;

        protected _addRoute(collection: RouteCollection, annotations: any[], globals: Record<string, any>, reflectionClass: ReflectionClass, method: ReflectionMethod): void;

        /**
         * Gets the default route name for a class method.
         */
        protected _getDefaultRouteName(reflectionClass: ReflectionClass, method: ReflectionMethod): string;

        protected _getGlobals(reflectionClass: ReflectionClass): Record<string, any>;

        /**
         * Gets an empty globals object.
         */
        private _resetGlobals(): Record<string, any>;

        /**
         * Creates a Route object.
         */
        protected _createRoute(path: string, defaults: Record<string, any>, requirements: Record<string, string>, options: Record<string, any>, host: string, schemes: string[], methods: string, condition: string): Route;

        protected abstract _configureRoute(route: Route, reflectionClass: ReflectionClass, method: ReflectionMethod, annot: any): void;
    }
}
