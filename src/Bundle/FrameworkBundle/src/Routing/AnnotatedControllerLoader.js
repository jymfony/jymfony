const AnnotationClassLoader = Jymfony.Component.Routing.Loader.AnnotationClassLoader;

/**
 * AnnotatedControllerLoader is an implementation of AnnotationClassLoader
 * that sets the '_controller' default based on the class and method names.
 *
 * @memberOf Jymfony.Bundle.FrameworkBundle.Routing
 */
export default class AnnotatedControllerLoader extends AnnotationClassLoader {
    /**
     * Configures the _controller default parameter of a given Route instance.
     */
    _configureRoute(route, reflectionClass, method, annot) { // eslint-disable-line no-unused-vars
        if ('__invoke' === method.name) {
            route.setDefault('_controller', reflectionClass.name);
        } else {
            route.setDefault('_controller', reflectionClass.name + ':' + method.name);
        }
    }

    /**
     * Makes the default route name more sane by removing common keywords.
     *
     * @return {string}
     */
    _getDefaultRouteName(reflectionClass, method) {
        return super._getDefaultRouteName(reflectionClass, method)
            .replace(/(bundle|controller)_/g, '_')
            .replace(/action(_\d+)?/g, '$1')
            .replace(/__/g, '_')
        ;
    }
}
