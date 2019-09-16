const FileLocator = Jymfony.Component.Config.FileLocator;
const FileResource = Jymfony.Component.Config.Resource.FileResource;
const JsonFileLoader = Jymfony.Component.Routing.Loader.JsonFileLoader;
const Route = Jymfony.Component.Routing.Route;
const RouteCollection = Jymfony.Component.Routing.RouteCollection;
const { realpathSync } = require('fs');
const { expect } = require('chai');

const fixturesDir = __dirname + '/../../fixtures';

describe('[Routing] JsonFileLoader', function () {
    it ('should support json files', () => {
        const loader = new JsonFileLoader(null);

        expect(loader.supports('foo.json'), 'supports() returns true if the resource is loadable').to.be.true;
        expect(loader.supports('foo.foo'), 'supports() returns true if the resource is loadable').to.be.false;

        expect(loader.supports('foo.json', 'json'), 'supports() checks the resource type if specified').to.be.true;
        expect(loader.supports('foo.json', 'foo'), 'supports() checks the resource type if specified').to.be.false;
    });

    it ('should do nothing if file is empty', () => {
        const loader = new JsonFileLoader(new FileLocator([ fixturesDir ]));
        const collection = loader.load('empty.json');

        expect(collection.all()).to.be.deep.eq({});
        expect(collection.resources).to.be.deep.eq([ new FileResource(realpathSync(fixturesDir + '/empty.json')) ]);
    });

    const invalidFiles = [
        'nonvalid.json', 'nonvalid2.json',
        'incomplete.json', 'nonvalidkeys.json',
        'nonesense_resource_plus_path.json',
        'nonesense_type_without_resource.json',
    ];

    for (const file of invalidFiles) {
        it ('should throw on invalid file: ' + file, () => {
            const loader = new JsonFileLoader(new FileLocator([ fixturesDir ]));
            expect(() => loader.load(file)).to.throw(InvalidArgumentException);
        });
    }

    it ('should load special route name', () => {
        const loader = new JsonFileLoader(new FileLocator([ fixturesDir ]));
        const routeCollection = loader.load('special_route_name.json');
        const route = routeCollection.get('#$péß^a|');

        expect(route).to.be.instanceOf(Route);
        expect(route.path).to.be.eq('/true');
    });

    it ('should load routes', () => {
        const loader = new JsonFileLoader(new FileLocator([ fixturesDir ]));
        const routeCollection = loader.load('validpattern.json');
        const route = routeCollection.get('blog_show');

        expect(route).to.be.instanceOf(Route);
        expect(route.path).to.be.eq('/blog/{slug}');
        expect(route.host).to.be.eq('{locale}.example.com');
        expect(route.getDefault('_controller')).to.be.eq('MyBundle:Blog:show');
        expect(route.getRequirement('locale')).to.be.deep.eq(/\w+/);
        expect(route.getOption('compiler_class')).to.be.eq('RouteCompiler');
        expect(route.methods).to.be.deep.eq([ 'GET', 'POST', 'PUT', 'OPTIONS' ]);
        expect(route.schemes).to.be.deep.eq([ 'https' ]);
    });

    it ('should load resources', () => {
        const loader = new JsonFileLoader(new FileLocator([ fixturesDir ]));
        const routeCollection = loader.load('validresource.json');
        const routes = Object.values(routeCollection.all());

        expect(routes).to.have.length(2, 'Two routes are loaded');

        for (const route of routes) {
            expect(route.path).to.be.eq('/{foo}/blog/{slug}');
            expect(route.getDefault('foo')).to.be.eq('123');
            expect(route.getRequirement('foo')).to.be.deep.eq(/\d+/);
            expect(route.getOption('foo')).to.be.eq('bar');
            expect(route.host).to.be.eq('');
        }
    });

    it ('should load route with controller attribute', () => {
        const loader = new JsonFileLoader(new FileLocator([ fixturesDir + '/controller' ]));
        const routeCollection = loader.load('routing.json');

        const route = routeCollection.get('app_homepage');

        expect(route.getDefault('_controller')).to.be.eq('AppBundle:Homepage:show');
    });

    it ('should load route without controller attribute', () => {
        const loader = new JsonFileLoader(new FileLocator([ fixturesDir + '/controller' ]));
        const routeCollection = loader.load('routing.json');

        const route = routeCollection.get('app_logout');

        expect(route.getDefault('_controller')).to.be.undefined;
    });

    it ('should load route with controller set in defaults', () => {
        const loader = new JsonFileLoader(new FileLocator([ fixturesDir + '/controller' ]));
        const routeCollection = loader.load('routing.json');

        const route = routeCollection.get('app_blog');

        expect(route.getDefault('_controller')).to.be.eq('AppBundle:Blog:list');
    });

    it ('should throw with controller set in defaults and controller attribute', () => {
        const loader = new JsonFileLoader(new FileLocator([ fixturesDir + '/controller' ]));
        expect(() => loader.load('override_defaults.json')).to.throw(
            InvalidArgumentException,
            /The routing file "[^"]*" must not specify both the "controller" key and the defaults key "_controller" for "app_blog"/
        );
    });

    const importFile = [
        'import_controller.json',
        'import__controller.json',
    ];

    for (const file of importFile) {
        it ('should import routes with controller', () => {
            const loader = new JsonFileLoader(new FileLocator([ fixturesDir + '/controller' ]));
            const routeCollection = loader.load(file);

            let route = routeCollection.get('app_homepage');
            expect(route.getDefault('_controller')).to.be.eq('FrameworkBundle:Template:template');

            route = routeCollection.get('app_blog');
            expect(route.getDefault('_controller')).to.be.eq('FrameworkBundle:Template:template');

            route = routeCollection.get('app_logout');
            expect(route.getDefault('_controller')).to.be.eq('FrameworkBundle:Template:template');
        });
    }

    it ('should throw on import routes with overridden controller', () => {
        const loader = new JsonFileLoader(new FileLocator([ fixturesDir + '/controller' ]));
        expect(() => loader.load('import_override_defaults.json')).to.throw(
            InvalidArgumentException,
            /The routing file "[^"]*" must not specify both the "controller" key and the defaults key "_controller" for "_static"/
        );
    });

    it ('should import routes with glob matching single file', () => {
        const loader = new JsonFileLoader(new FileLocator([ fixturesDir + '/glob' ]));
        const routeCollection = loader.load('import_single.json');

        const route = routeCollection.get('bar_route');
        expect(route.getDefault('_controller')).to.be.eq('AppBundle:Bar:view');
    });

    it ('should import routes with glob matching multiple file', () => {
        const loader = new JsonFileLoader(new FileLocator([ fixturesDir + '/glob' ]));
        const routeCollection = loader.load('import_multiple.json');

        let route = routeCollection.get('bar_route');
        expect(route.getDefault('_controller')).to.be.eq('AppBundle:Bar:view');

        route = routeCollection.get('baz_route');
        expect(route.getDefault('_controller')).to.be.eq('AppBundle:Baz:view');
    });

    it ('should import routes with name prefix', () => {
        const loader = new JsonFileLoader(new FileLocator([ fixturesDir + '/import_with_name_prefix' ]));
        const routeCollection = loader.load('routing.json');

        expect(routeCollection.get('app_blog')).not.to.be.undefined;
        expect(routeCollection.get('app_blog').path).to.be.deep.eq('/blog');
        expect(routeCollection.get('api_app_blog')).not.to.be.undefined;
        expect(routeCollection.get('api_app_blog').path).to.be.deep.eq('/api/blog');
    });

    it ('should throw trying to load a remote file', () => {
        const loader = new JsonFileLoader({
            locate: file => file,
        });

        expect(() => loader.load('http://remote.com/here.yml')).to.throw(InvalidArgumentException);
    });

    it ('should load route with defaults', () => {
        const loader = new JsonFileLoader(new FileLocator([ fixturesDir ]));
        const routes = loader.load('defaults.json');

        expect(routes).to.have.length(1);

        const defaultsRoute = routes.get('defaults');

        expect(defaultsRoute.path).to.be.eq('/defaults');
        expect(defaultsRoute.getDefault('_locale')).to.be.eq('en');
        expect(defaultsRoute.getDefault('_format')).to.be.eq('html');
    });

    it ('should import routes with defaults', () => {
        const loader = new JsonFileLoader(new FileLocator([ fixturesDir ]));
        const routes = loader.load('importer-with-defaults.json');

        expect(routes).to.have.length(2);

        const expectedRoutes = new RouteCollection();
        const localeRoute = new Route('/defaults/one');
        expectedRoutes.add('one', localeRoute);
        localeRoute.setDefault('_locale', 'g_locale');
        localeRoute.setDefault('_format', 'g_format');
        const formatRoute = new Route('/defaults/two');
        expectedRoutes.add('two', formatRoute);
        formatRoute.setDefault('_locale', 'g_locale');
        formatRoute.setDefault('_format', 'g_format');
        formatRoute.setDefault('specific', 'imported');

        expectedRoutes.addResource(new FileResource(fixturesDir + '/imported-with-defaults.json'));
        expectedRoutes.addResource(new FileResource(fixturesDir + '/importer-with-defaults.json'));

        expect(routes).to.be.deep.eq(expectedRoutes);
    });

    it ('should load localized routes', () => {
        const loader = new JsonFileLoader(new FileLocator([ fixturesDir + '/localized' ]));
        const routes = loader.load('localized-route.json');

        expect(routes).to.have.length(3);
    });

    it ('should load imported localized routes', () => {
        const loader = new JsonFileLoader(new FileLocator([ fixturesDir + '/localized' ]));
        const routes = loader.load('importing-localized-route.json');

        expect(routes).to.have.length(3);
        expect(routes.get('home.nl').path).to.be.deep.eq('/nl');
        expect(routes.get('home.en').path).to.be.deep.eq('/en');
        expect(routes.get('not_localized').path).to.be.deep.eq('/here');
    });

    it ('should load import routes with locale', () => {
        const loader = new JsonFileLoader(new FileLocator([ fixturesDir + '/localized' ]));
        const routes = loader.load('importer-with-locale.json');

        expect(routes).to.have.length(2);
        expect(routes.get('imported.nl').path).to.be.deep.eq('/nl/voorbeeld');
        expect(routes.get('imported.en').path).to.be.deep.eq('/en/example');
    });

    it ('should load import non-localized routes with locale', () => {
        const loader = new JsonFileLoader(new FileLocator([ fixturesDir + '/localized' ]));
        const routes = loader.load('importer-with-locale-imports-non-localized-route.json');

        expect(routes).to.have.length(2);
        expect(routes.get('imported.nl').path).to.be.deep.eq('/nl/imported');
        expect(routes.get('imported.en').path).to.be.deep.eq('/en/imported');
    });

    it ('should load import routes with official locale', () => {
        const loader = new JsonFileLoader(new FileLocator([ fixturesDir + '/localized' ]));
        const routes = loader.load('officially_formatted_locales.json');

        expect(routes).to.have.length(3);
        expect(routes.get('official.fr.UTF-8').path).to.be.deep.eq('/omelette-au-fromage');
        expect(routes.get('official.pt-PT').path).to.be.deep.eq('/eu-não-sou-espanhol');
        expect(routes.get('official.pt_BR').path).to.be.deep.eq('/churrasco');
    });

    it ('should throw importing routes with missing locale prefix', () => {
        const loader = new JsonFileLoader(new FileLocator([ fixturesDir + '/localized' ]));
        expect(() => loader.load('missing-locale-in-importer.json')).to.throw(InvalidArgumentException);
    });

    it ('should throw importing routes without path or locales', () => {
        const loader = new JsonFileLoader(new FileLocator([ fixturesDir + '/localized' ]));
        expect(() => loader.load('route-without-path-or-locales.json')).to.throw(InvalidArgumentException);
    });

    it ('should import with controller default', () => {
        const loader = new JsonFileLoader(new FileLocator([ fixturesDir + '/localized' ]));
        const routes = loader.load('importer-with-controller-default.json');
        expect(routes).to.have.length(3);
        expect(routes.get('home.en').getDefault('_controller')).to.be.eq('DefaultController::defaultAction');
        expect(routes.get('home.nl').getDefault('_controller')).to.be.eq('DefaultController::defaultAction');
        expect(routes.get('not_localized').getDefault('_controller')).to.be.eq('DefaultController::defaultAction');
    });

    it ('should import routes with no trailing slash', () => {
        const loader = new JsonFileLoader(new FileLocator([ fixturesDir + '/import_with_no_trailing_slash' ]));
        const routeCollection = loader.load('routing.json');

        expect(routeCollection.get('a_app_homepage').path).to.be.eq('/slash/');
        expect(routeCollection.get('b_app_homepage').path).to.be.eq('/no-slash');
    });
});
