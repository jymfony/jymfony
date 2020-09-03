const AnnotationClassLoader = Jymfony.Component.Routing.Loader.AnnotationClassLoader;
const NamespaceLoader = Jymfony.Component.Routing.Loader.NamespaceLoader;
const { expect } = require('chai');

describe('[Routing] NamespaceLoader', function () {
    /**
     * @type {Jymfony.Component.Routing.Loader.NamespaceLoader}
     */
    this._loader = undefined;

    beforeEach(() => {
        this._loader = new NamespaceLoader(new class extends AnnotationClassLoader {
            __construct() {
                super.__construct();

                this._classes = new Set();
            }

            _configureRoute(route, reflectionClass) {
                this._classes.add(reflectionClass.name);
            }
        }());
    });

    it ('should load', () => {
        const routes = this._loader.load('Jymfony.Component.Routing.Fixtures');

        expect(routes.length).to.be.greaterThan(0);
        expect([ ...this._loader._loader._classes ]).to.be.deep.equal([
            'Jymfony.Component.Routing.Fixtures.Annotation.ActionPathController',
            'Jymfony.Component.Routing.Fixtures.Annotation.BazClass',
            'Jymfony.Component.Routing.Fixtures.Annotation.DefaultValueController',
            'Jymfony.Component.Routing.Fixtures.Annotation.GlobalDefaultsClass',
            'Jymfony.Component.Routing.Fixtures.Annotation.InvokableController',
            'Jymfony.Component.Routing.Fixtures.Annotation.InvokableLocalizedController',
            'Jymfony.Component.Routing.Fixtures.Annotation.LocalizedActionPathController',
            'Jymfony.Component.Routing.Fixtures.Annotation.LocalizedMethodActionControllers',
            'Jymfony.Component.Routing.Fixtures.Annotation.LocalizedPrefixLocalizedActionController',
            'Jymfony.Component.Routing.Fixtures.Annotation.LocalizedPrefixWithRouteWithoutLocale',
            'Jymfony.Component.Routing.Fixtures.Annotation.MethodActionControllers',
            'Jymfony.Component.Routing.Fixtures.Annotation.MissingRouteNameController',
            'Jymfony.Component.Routing.Fixtures.Annotation.NothingButNameController',
            'Jymfony.Component.Routing.Fixtures.Annotation.PrefixedActionLocalizedRouteController',
            'Jymfony.Component.Routing.Fixtures.Annotation.PrefixedActionPathController',
            'Jymfony.Component.Routing.Fixtures.Annotation.RouteWithPrefixController',
        ]);
    });

    it ('should return true to support', () => {
        expect(this._loader.supports('Jymfony.Component.Routing.Fixtures.Annotation')).to.be.true;
        expect(this._loader.supports(Jymfony.Component.Routing.Fixtures.Annotation)).to.be.true;

        expect(this._loader.supports('Jymfony.Component.Routing.Fixtures.NonExisting')).to.be.false;
        expect(this._loader.supports(Object)).to.be.false;

        expect(this._loader.supports('Jymfony.Component.Routing.Fixtures.Annotation', 'namespace')).to.be.true;
        expect(this._loader.supports('Jymfony.Component.Routing.Fixtures.Annotation', 'foo')).to.be.false;
    });
});
