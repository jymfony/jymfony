declare namespace Jymfony.Bundle.FrameworkBundle.Routing {
    import AnnotationClassLoader = Jymfony.Component.Routing.Loader.AnnotationClassLoader;
    import Route = Jymfony.Component.Routing.Route;

    /**
     * AnnotatedControllerLoader is an implementation of AnnotationClassLoader
     * that sets the '_controller' default based on the class and method names.
     */
    export class AnnotatedControllerLoader extends AnnotationClassLoader {
        /**
         * Configures the _controller default parameter of a given Route instance.
         */
        protected _configureRoute(route: Route, reflectionClass: ReflectionClass, method: ReflectionMethod, annot: any): void;

        /**
         * Makes the default route name more sane by removing common keywords.
         */
        protected _getDefaultRouteName(reflectionClass: ReflectionClass, method: ReflectionMethod): string;
    }
}
