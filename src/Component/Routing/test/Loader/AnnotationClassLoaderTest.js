require('../../fixtures/namespace');

const ActionPathController = Jymfony.Component.Routing.Fixtures.Annotation.ActionPathController;
const BazClass = Jymfony.Component.Routing.Fixtures.Annotation.BazClass;
const DefaultValueController = Jymfony.Component.Routing.Fixtures.Annotation.DefaultValueController;
const GlobalDefaultsClass = Jymfony.Component.Routing.Fixtures.Annotation.GlobalDefaultsClass;
const InvokableController = Jymfony.Component.Routing.Fixtures.Annotation.InvokableController;
const InvokableLocalizedController = Jymfony.Component.Routing.Fixtures.Annotation.InvokableLocalizedController;
const LocalizedActionPathController = Jymfony.Component.Routing.Fixtures.Annotation.LocalizedActionPathController;
const LocalizedMethodActionControllers = Jymfony.Component.Routing.Fixtures.Annotation.LocalizedMethodActionControllers;
const LocalizedPrefixLocalizedActionController = Jymfony.Component.Routing.Fixtures.Annotation.LocalizedPrefixLocalizedActionController;
const LocalizedPrefixMissingLocaleActionController = Jymfony.Component.Routing.Fixtures.Annotation.LocalizedPrefixMissingLocaleActionController;
const LocalizedPrefixMissingRouteLocaleActionController = Jymfony.Component.Routing.Fixtures.Annotation.LocalizedPrefixMissingRouteLocaleActionController;
const LocalizedPrefixWithRouteWithoutLocale = Jymfony.Component.Routing.Fixtures.Annotation.LocalizedPrefixWithRouteWithoutLocale;
const MethodActionControllers = Jymfony.Component.Routing.Fixtures.Annotation.MethodActionControllers;
const MissingRouteNameController = Jymfony.Component.Routing.Fixtures.Annotation.MissingRouteNameController;
const NothingButNameController = Jymfony.Component.Routing.Fixtures.Annotation.NothingButNameController;
const PrefixedActionLocalizedRouteController = Jymfony.Component.Routing.Fixtures.Annotation.PrefixedActionLocalizedRouteController;
const PrefixedActionPathController = Jymfony.Component.Routing.Fixtures.Annotation.PrefixedActionPathController;
const RouteWithPrefixController = Jymfony.Component.Routing.Fixtures.Annotation.RouteWithPrefixController;
const AnnotationClassLoader = Jymfony.Component.Routing.Loader.AnnotationClassLoader;
const { expect } = require('chai');

describe('[Routing] AnnotationClassLoader', function () {
    /**
     * @type {Jymfony.Component.Routing.Loader.AnnotationClassLoader}
     */
    this._loader = undefined;

    beforeEach(() => {
        this._loader = new class extends AnnotationClassLoader {
            _configureRoute() {
            }
        }();
    });

    const supportsChecksResource = [
        [ 'Object', true ],
        [ 'Jymfony.Component.Routing.Route', true ],
        [ 'Jymfony.Component.Routing', false ],
        [ '5', false ],
        [ 'foo\\foo', false ],
        [ '.leading.dot', false ],
        [ null, false ],
    ];

    for (const [ i, [ resource, expectedSupports ] ] of __jymfony.getEntries(supportsChecksResource)) {
        it ('supports should work #' + i, () => {
            expect(this._loader.supports(resource)).to.be
                .equal(expectedSupports, '.supports() returns true if the resource is loadable');
        });
    }

    it ('supports should check type if passed', () => {
        expect(this._loader.supports('class', 'annotation')).to.be.true;
        expect(this._loader.supports('class', 'foo')).to.be.false;
    });

    it ('should load simple route', () => {
        const routes = this._loader.load(ActionPathController);
        expect(routes).to.have.length(1);
        expect(routes.get('action').path).to.be.equal('/path');
    });

    it ('should load invokable controller class', () => {
        const routes = this._loader.load(InvokableController);
        expect(routes).to.have.length(1);
        expect(routes.get('lol').path).to.be.equal('/here');
        expect(routes.get('lol').methods).to.be.deep.equal([ 'GET', 'POST' ]);
        expect(routes.get('lol').schemes).to.be.deep.equal([ 'https' ]);
    });

    it ('should load invokable controller class with localized paths', () => {
        const routes = this._loader.load(InvokableLocalizedController);
        expect(routes).to.have.length(2);
        expect(routes.get('action.en').path).to.be.equal('/here');
        expect(routes.get('action.nl').path).to.be.equal('/hier');
    });

    it ('should load localized path routes', () => {
        const routes = this._loader.load(LocalizedActionPathController);
        expect(routes).to.have.length(2);
        expect(routes.get('action.en').path).to.be.equal('/path');
        expect(routes.get('action.nl').path).to.be.equal('/pad');
    });

    it ('should load default values for methods', () => {
        const routes = this._loader.load(DefaultValueController);
        expect(routes).to.have.length(3);
        expect(routes.get('action').path).to.be.equal('/{$default}/path');
        expect(routes.get('action').getDefault('$default')).to.be.equal('value');
        expect(routes.get('hello_with_default').getDefault('name')).to.be.equal('Jymfony');
        expect(routes.get('hello_without_default').path).to.be.equal('/hello/{name}');
        expect(routes.get('hello_without_default').getDefault('name')).to.be.equal('World');
    });

    it ('should load routes with methods', () => {
        const routes = this._loader.load(MethodActionControllers);
        expect(routes).to.have.length(2);
        expect(routes.get('put').path).to.be.equal('/the/path');
        expect(routes.get('post').path).to.be.equal('/the/path');
    });

    it ('should load localized routes with methods', () => {
        const routes = this._loader.load(LocalizedMethodActionControllers);
        expect(routes).to.have.length(4);
        expect(routes.get('put.en').path).to.be.equal('/the/path');
        expect(routes.get('post.en').path).to.be.equal('/the/path');
        expect(routes.get('put.nl').path).to.be.equal('/het/pad');
        expect(routes.get('post.nl').path).to.be.equal('/het/pad');
    });

    it ('should load annotations with global defaults', () => {
        /** @type {Jymfony.Component.Routing.RouteCollection} */
        const routes = this._loader.load(GlobalDefaultsClass);
        expect(routes).to.have.length(2);

        const specificLocaleRoute = routes.get('specific_locale');

        expect(specificLocaleRoute.path).to.be.equal('/defaults/specific-locale');
        expect(specificLocaleRoute.getDefault('_locale')).to.be.equal('s_locale');
        expect(specificLocaleRoute.getDefault('_format')).to.be.equal('g_format');

        const specificFormatRoute = routes.get('specific_format');

        expect(specificFormatRoute.path).to.be.equal('/defaults/specific-format');
        expect(specificFormatRoute.getDefault('_locale')).to.be.equal('g_locale');
        expect(specificFormatRoute.getDefault('_format')).to.be.equal('s_format');
    });

    it ('should load routes with path with prefix', () => {
        /** @type {Jymfony.Component.Routing.RouteCollection} */
        const routes = this._loader.load(PrefixedActionPathController);
        expect(routes).to.have.length(1);
        const route = routes.get('action');

        expect(route.path).to.be.equal('/prefix/path');
        // @todo: expect(route.condition).to.be.equal('lol=fun');
        expect(route.host).to.be.equal('frankdejonge.nl');
    });

    it ('should load localized route with path with prefix', () => {
        const routes = this._loader.load(PrefixedActionLocalizedRouteController);
        expect(routes).to.have.length(2);
        expect(routes.get('action.en').path).to.be.equal('/prefix/path');
        expect(routes.get('action.nl').path).to.be.equal('/prefix/pad');
    });

    it ('should load localized prefix routes', () => {
        const routes = this._loader.load(LocalizedPrefixLocalizedActionController);
        expect(routes).to.have.length(2);
        expect(routes.get('action.nl').path).to.be.equal('/nl/actie');
        expect(routes.get('action.en').path).to.be.equal('/en/action');
    });

    it ('should load invokable class with multiple routes', () => {
        const classRouteData1 = {
            name: 'route1',
            path: '/1',
            schemes: [ 'https' ],
            methods: [ 'GET' ],
        };

        const classRouteData2 = {
            name: 'route2',
            path: '/2',
            schemes: [ 'https' ],
            methods: [ 'GET' ],
        };

        /** @type {Jymfony.Component.Routing.RouteCollection} */
        const routes = this._loader.load(BazClass);
        let route = routes.get(classRouteData1.name);

        expect(route.path).to.be.equal(classRouteData1.path, '.load preserves class route path');
        expect(route.schemes).to.be.deep.equal(classRouteData1.schemes, '.load preserves class route schemes');
        expect(route.methods).to.be.deep.equal(classRouteData1.methods, '.load preserves class route methods');

        route = routes.get(classRouteData2.name);

        expect(route.path).to.be.equal(classRouteData2.path, '.load preserves class route path');
        expect(route.schemes).to.be.deep.equal(classRouteData2.schemes, '.load preserves class route schemes');
        expect(route.methods).to.be.deep.equal(classRouteData2.methods, '.load preserves class route methods');
    });

    it ('should throw loading localized controller with missing prefix', () => {
        expect(() => this._loader.load(LocalizedPrefixMissingLocaleActionController)).to.throw(LogicException);
    });

    it ('should throw loading localized controller with missing path', () => {
        expect(() => this._loader.load(LocalizedPrefixMissingRouteLocaleActionController)).to.throw(LogicException);
    });

    it ('should load route without name', () => {
        const routes = Object.entries(this._loader.load(MissingRouteNameController).all());
        expect(routes).to.have.length(1);
        expect(routes[0][1].path).to.be.equal('/path');
        expect(routes[0][0]).to.be.equal('jymfony_component_routing_fixtures_annotation_missingroutenamecontroller_action');
    });

    it ('should load route with nothing but name', () => {
        const routes = [ ...Object.values(this._loader.load(NothingButNameController).all()) ];
        expect(routes).to.have.length(1);
        expect(routes[0].path).to.be.equal('/');
    });

    it ('should throw if trying to load non-existing class', () => {
        expect(() => this._loader.load('NonExistingClass')).to.throw(InvalidArgumentException);
    });

    it ('should load localized prefix routes without route locale', () => {
        const routes = this._loader.load(LocalizedPrefixWithRouteWithoutLocale);
        expect(routes).to.have.length(2);
        expect(routes.get('action.en').path).to.be.equal('/en/suffix');
        expect(routes.get('action.nl').path).to.be.equal('/nl/suffix');
    });

    it ('should load route with prefix', () => {
        const routes = this._loader.load(RouteWithPrefixController);
        expect(routes).to.have.length(1);
        expect(routes.get('action').path).to.be.equal('/prefix/path');
    });
});
