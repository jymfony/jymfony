let expect = require('chai').expect;

/*
 * We are testing autoloader component here
 * cannot use the autoloader itself to load classes! :)
 */
const Namespace = require('../src/Namespace');
const ClassNotFoundException = require('../src/Exception/ClassNotFoundException');

describe('[Autoloader] Namespace', function () {
    it('constructs as a Proxy', () => {

        /*
         * ES6 Proxies are transparent virtualized objects, so
         * it is impossible to know whether an object is a
         * proxy or not, we just check that is not a Namespace
         */

        let ns = new Namespace({});
        expect(ns).not.to.be.instanceof(Namespace);
        expect(ns.__namespace).to.be.instanceof(Namespace);
    });

    it('returns undefined if a symbol is requested', () => {
        let ns = new Namespace({});

        expect(ns[Symbol.iterator]).to.be.undefined;
    });

    it('returns undefined if namespace is not found', () => {
        let finder = {
            find: (dir, name) => {
                let e = new Error();
                e.code = 'ENOENT';
            }
        };

        let ns = new Namespace({ finder: finder });
        let subns = ns.NotValid;

        expect(subns).to.be.undefined;
    });

    it('throws if namespace is not found and debug is enabled', () => {
        let finder = {
            find: (dir, name) => {
                let e = new Error();
                e.code = 'ENOENT';
            }
        };

        let ns = new Namespace({ finder: finder });
        let subns = ns.NotValid;

        expect(subns).to.be.undefined;
    });

    it('returns undefined if is not a constructor', () => {
        let req = (module) => {
            expect(module).to.be.equal('/var/node/foo_vendor/FooClass.js');
            return undefined;
        };
        req.cache = {
            '/var/node/foo_vendor/FooClass.js': {}
        };
        req.resolve = (module) => {
            return '/var/node/foo_vendor/FooClass.js';
        };

        let finder = {
            find: (dir, name) => {
                expect(name).to.be.equal('FooClass');
                return {
                    filename: '/var/node/foo_vendor/FooClass.js',
                    directory: false
                };
            }
        };

        let ns = new Namespace({finder: finder}, 'Foo', [
            '/var/node/foo_vendor'
        ], req);
        let class_ = ns.FooClass;

        expect(class_).to.be.undefined;
    });

    it('throws if is not a constructor and debug is enabled', () => {
        let req = (module) => {
            expect(module).to.be.equal('/var/node/foo_vendor/FooClass.js');
            return undefined;
        };
        req.cache = {
            '/var/node/foo_vendor/FooClass.js': {}
        };
        req.resolve = (module) => {
            return '/var/node/foo_vendor/FooClass.js';
        };

        let finder = {
            find: (dir, name) => {
                expect(name).to.be.equal('FooClass');
                return {
                    filename: '/var/node/foo_vendor/FooClass.js',
                    directory: false
                };
            }
        };

        let ns = new Namespace({ finder: finder, debug: true }, 'Foo', [
            '/var/node/foo_vendor'
        ], req);
        try {
            let class_ = ns.FooClass;
        } catch (e) {
            expect(e).to.be.instanceOf(ClassNotFoundException);
            return;
        }

        throw Error('FAILED');
    });

    it('object can be set', () => {
        let ns = new Namespace({});
        ns.subNs = {
            foo: 'bar'
        };

        expect(ns.subNs).to.be.deep.equal({
            foo: 'bar'
        });
    });

    it('searches in all base dirs', () => {
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

        let ns = new Namespace({finder: finder}, 'Foo', [], req);

        ns.__namespace.addDirectory('/var/node/vendor1/');
        ns.__namespace.addDirectory('/var/node/foo_vendor/');

        let func = ns.FooClass;
        expect(func).to.be.a('function');
    });

    it('injects reflection metadata', () => {
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

        let ns = new Namespace({finder: finder}, 'Foo', ['/var/node/foo_vendor/'], req);

        let func = ns.FooClass;
        expect(func).to.be.a('function');
        expect(func.__reflection).to.have.property('filename').that.equals('/var/node/foo_vendor/FooClass.js');
        expect(func.__reflection).to.have.property('fqcn').that.equals('Foo.FooClass');
        expect(func.__reflection).to.have.property('constructor');
        expect(func.__reflection).to.have.property('namespace');
    });
});
