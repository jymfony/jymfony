let expect = require('chai').expect;

/*
 * We are testing autoloader component here
 * cannot use the autoloader itself to load classes! :)
 */
const Namespace = require('../src/Namespace');

describe('Namespace', function () {
    it('constructs as a Proxy', function () {

        /*
         * ES6 Proxies are transparent virtualized objects, so
         * it is impossible to know whether an object is a
         * proxy or not, we just check that is not a Namespace
         */

        let ns = new Namespace({});
        expect(ns).not.to.be.instanceof(Namespace);
        expect(ns.__namespace).to.be.instanceof(Namespace);
    });

    it('object can be set', function () {
        let ns = new Namespace({});
        ns.subNs = {
            foo: 'bar'
        };

        expect(ns.subNs).to.be.deep.equal({
            foo: 'bar'
        });
    });

    it('searches in all base dirs', function () {
        let finder = {
            find: (dir, name) => {
                switch (dir) {
                    case '/var/node/vendor1/':
                        return undefined;

                    case '/var/node/foo_vendor/':
                        expect(name).to.be.equal('FooClass');
                        return {
                            filename: '/var/node/foo_vendor/FooClass.js',
                            directory: false
                        };

                    default:
                        throw new Error('Unexpected argument');
                }
            }
        };

        let req = (module) => {
            expect(module).to.be.equal('/var/node/foo_vendor/FooClass.js');
            return function () { };
        };
        req.cache = {
            '/var/node/foo_vendor/FooClass.js': {}
        };
        req.resolve = (module) => {
            return '/var/node/foo_vendor/FooClass.js';
        };

        let ns = new Namespace(finder, 'Foo', [], req);

        ns.__namespace.addDirectory('/var/node/vendor1/');
        ns.__namespace.addDirectory('/var/node/foo_vendor/');

        let func = ns.FooClass;
        expect(func).to.be.a('function');
    });

    it('injects reflection metadata', function () {
        let finder = {
            find: (dir, name) => {
                if (dir === '/var/node/foo_vendor/') {
                    expect(name).to.be.equal('FooClass');
                    return {
                        filename: '/var/node/foo_vendor/FooClass.js',
                        directory: false
                    };
                } else {
                    throw new Error('Unexpected argument');
                }
            }
        };

        let constructor = class FooClass {};

        let req = (module) => {
            expect(module).to.be.equal('/var/node/foo_vendor/FooClass.js');
            return constructor;
        };
        req.cache = {
            '/var/node/foo_vendor/FooClass.js': {}
        };
        req.resolve = (module) => {
            return '/var/node/foo_vendor/FooClass.js';
        };

        let ns = new Namespace(finder, 'Foo', ['/var/node/foo_vendor/'], req);

        let func = ns.FooClass;
        expect(func).to.be.a('function');
        expect(func.__reflection).to.be.deep.equal({
            filename: '/var/node/foo_vendor/FooClass.js',
            fqcn: 'Foo.FooClass',
            module: {},
            constructor: func
        })
    });
});
