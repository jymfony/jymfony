const { expect } = require('chai');
const path = require('path');
const fs = require('fs');
const vm = require('vm');

const cwdOSRoot = path.parse(process.cwd()).root.toUpperCase();

/*
 * We are testing autoloader component here
 * cannot use the autoloader itself to load classes! :)
 */
const Namespace = require('../src/Namespace');
const ClassLoader = require('../src/ClassLoader');
const ClassNotFoundException = require('../src/Exception/ClassNotFoundException');

describe('[Autoloader] Namespace', function () {
    afterEach(() => {
        ClassLoader.clearCache(__jymfony.Platform.isWindows() ? cwdOSRoot + 'var\\node\\foo_vendor\\' : '/var/node/foo_vendor');
    });

    it('constructs as a Proxy', () => {
        /*
         * ES6 Proxies are transparent virtualized objects, so
         * it is impossible to know whether an object is a
         * proxy or not, we just check that is not a Namespace
         */

        const ns = new Namespace({});
        expect(ns).not.to.be.instanceof(Namespace);
        expect(ns.__namespace).to.be.instanceof(Namespace);
    });

    it('returns undefined if a symbol is requested', () => {
        const ns = new Namespace({});

        expect(ns[Symbol.iterator]).to.be.undefined;
    });

    it('returns undefined if namespace is not found', () => {
        const finder = {
            find: () => {
                const e = new Error();
                e.code = 'ENOENT';
            },
        };

        const ns = new Namespace({ finder: finder });
        const subns = ns.NotValid;

        expect(subns).to.be.undefined;
    });

    it('throws if namespace is not found and debug is enabled', () => {
        const finder = {
            find: () => {
                const e = new Error();
                e.code = 'ENOENT';
            },
        };

        const ns = new Namespace({ finder: finder });
        const subns = ns.NotValid;

        expect(subns).to.be.undefined;
    });

    it('throws if is not a constructor and debug is enabled', () => {
        const req = (module) => {
            if ('path' === module || 'vm' === module) {
                return require(module);
            }
        };
        req.cache = {
            '/var/node/foo_vendor/FooClass.js': {},
        };
        req.resolve = () => {
            return '/var/node/foo_vendor/FooClass.js';
        };

        const finder = {
            find: (dir, name) => {
                expect(name).to.be.equal('FooClass');
                return {
                    filename: '/var/node/foo_vendor/FooClass.js',
                    directory: false,
                };
            },
            load: (fn) => {
                expect(fn).to.be.equal(__jymfony.Platform.isWindows() ? cwdOSRoot + 'var\\node\\foo_vendor\\FooClass.js' : '/var/node/foo_vendor/FooClass.js');
                return '';
            },
        };

        const ns = new Namespace({
            classLoader: new ClassLoader(finder, path, vm),
            debug: true,
            finder: finder,
        }, 'Foo', [
            '/var/node/foo_vendor',
        ], req);

        expect(() => {
            const class_ = ns.FooClass;
            expect(class_).to.be.undefined;
        }).to.throw(ClassNotFoundException);
    });

    it('object can be set', () => {
        const ns = new Namespace({});
        ns.subNs = {
            foo: 'bar',
        };

        expect(ns.subNs).to.be.deep.equal({
            foo: 'bar',
        });
    });

    it('searches in all base dirs', () => {
        const finder = {
            find: (dir, name) => {
                switch (dir) {
                    case '/var/node/vendor1/':
                        return undefined;

                    case '/var/node/foo_vendor/':
                        expect(name).to.be.equal('FooClass');
                        return {
                            filename: '/var/node/foo_vendor/FooClass.js',
                            directory: false,
                        };

                    default:
                        throw new Error('Unexpected argument');
                }
            },
            load: (fn) => {
                expect(fn).to.be.equal(__jymfony.Platform.isWindows() ? cwdOSRoot + 'var\\node\\foo_vendor\\FooClass.js' : '/var/node/foo_vendor/FooClass.js');
                return 'module.exports = function () { };';
            },
        };

        const req = (module) => {
            if ('path' === module || 'vm' === module) {
                return require(module);
            }
        };
        req.cache = {
            '/var/node/foo_vendor/FooClass.js': {},
        };
        req.resolve = () => {
            return '/var/node/foo_vendor/FooClass.js';
        };

        const ns = new Namespace({
            classLoader: new ClassLoader(finder, path, vm),
            finder: finder,
        }, 'Foo', [], req);

        ns.__namespace.addDirectory('/var/node/vendor1/');
        ns.__namespace.addDirectory('/var/node/foo_vendor/');

        const func = ns.FooClass;
        expect(func).to.be.instanceOf(Function);
    });

    it('injects reflection metadata', () => {
        const finder = {
            find: (dir, name) => {
                if ('/var/node/foo_vendor/' === dir) {
                    expect(name).to.be.equal('FooClass');
                    return {
                        filename: '/var/node/foo_vendor/FooClass.js',
                        directory: false,
                    };
                }
                throw new Error('Unexpected argument');

            },
            load: fn => {
                expect(fn).to.be.equal(__jymfony.Platform.isWindows() ? cwdOSRoot + 'var\\node\\foo_vendor\\FooClass.js' : '/var/node/foo_vendor/FooClass.js');
                return 'module.exports = class FooClass {}';
            },
        };

        const req = (module) => {
            if ('path' === module || 'vm' === module) {
                return require(module);
            }
        };
        req.cache = {
            '/var/node/foo_vendor/FooClass.js': {},
        };
        req.resolve = () => {
            return '/var/node/foo_vendor/FooClass.js';
        };

        const ns = new Namespace({
            classLoader: new ClassLoader(finder, path, vm),
            finder: finder,
        }, 'Foo', [ '/var/node/foo_vendor/' ], req);

        const func = ns.FooClass;

        expect(func).to.be.instanceOf(Function);
        expect(func[Symbol.reflection]).to.have.property('filename').that.equals('/var/node/foo_vendor/FooClass.js');
        expect(func[Symbol.reflection]).to.have.property('fqcn').that.equals('Foo.FooClass');
        expect(func[Symbol.reflection]).to.have.property('constructor');
        expect(func[Symbol.reflection]).to.have.property('namespace');
    });

    it('calls __construct on new if defined', () => {
        const finder = {
            find: (dir, name) => {
                if ('/var/node/foo_vendor/' === dir) {
                    expect(name).to.be.equal('FooClass');
                    return {
                        filename: '/var/node/foo_vendor/FooClass.js',
                        directory: false,
                    };
                }
                throw new Error('Unexpected argument');

            },
            load: fn => {
                expect(fn).to.be.equal(__jymfony.Platform.isWindows() ? cwdOSRoot + 'var\\node\\foo_vendor\\FooClass.js' : '/var/node/foo_vendor/FooClass.js');
                return `module.exports = class FooClass {
                    __construct(arg) {
                        this.constructCalled = arg;
                    }
                };`;
            },
        };

        const req = (module) => {
            if ('path' === module || 'vm' === module) {
                return require(module);
            }
        };
        req.cache = {
            '/var/node/foo_vendor/FooClass.js': {},
        };
        req.resolve = () => {
            return '/var/node/foo_vendor/FooClass.js';
        };

        const ns = new Namespace({
            classLoader: new ClassLoader(finder, path, vm),
            finder: finder,
        }, 'Foo', [ '/var/node/foo_vendor/' ], req);

        const obj = new ns.FooClass('foobar');
        expect(obj.constructCalled).to.be.equal('foobar');
    });

    it('calls __construct on new if defined', () => {
        const finder = {
            find: (dir, name) => {
                if ('/var/node/foo_vendor/' === dir) {
                    if ('FooClass' === name) {
                        return {
                            filename: '/var/node/foo_vendor/FooClass.js',
                            directory: false,
                        };
                    } else if ('BarClass' === name) {
                        return {
                            filename: '/var/node/foo_vendor/BarClass.js',
                            directory: false,
                        };
                    }
                }

                throw new Error('Unexpected argument');
            },
            load: fn => {
                if ((__jymfony.Platform.isWindows() ? cwdOSRoot + 'var\\node\\foo_vendor\\FooClass.js' : '/var/node/foo_vendor/FooClass.js') === fn) {
                    return `module.exports = class FooClass extends __ns.BarClass {
                        __construct(arg) {
                            this.constructCalled = arg;
                        }
                    }`;
                } else if ((__jymfony.Platform.isWindows() ? cwdOSRoot + 'var\\node\\foo_vendor\\BarClass.js' : '/var/node/foo_vendor/BarClass.js') === fn) {
                    return `module.exports = class BarClass {
                        __construct(arg) {
                            this.superCalled = arg;
                        }
                    };`;
                }
            },
        };

        const req = (module) => {
            if ('path' === module || 'vm' === module) {
                return require(module);
            }
        };
        req.cache = {
            '/var/node/foo_vendor/BarClass.js': {},
            '/var/node/foo_vendor/FooClass.js': {},
        };
        req.resolve = (module) => module;

        const ns = new Namespace({
            classLoader: new ClassLoader(finder, path, vm),
            finder: finder,
        }, 'Foo', [ '/var/node/foo_vendor/' ], req);

        try {
            global.__ns = ns;

            const obj = new ns.FooClass('foobar');
            expect(obj.constructCalled).to.be.equal('foobar');
            expect(obj.superCalled).to.be.undefined;
        } finally {
            delete global.__ns;
        }
    });

    it('resolves circular requirements', () => {
        const finder = {
            find: (dir, name) => {
                if ('FooClass' === name) {
                    return {
                        filename: path.join(__dirname, '..', 'fixtures', 'FooClass.js'),
                        directory: false,
                    };
                } else if ('BarClass' === name) {
                    return {
                        filename: path.join(__dirname, '..', 'fixtures', 'BarClass.js'),
                        directory: false,
                    };
                }

                throw new Error('Unexpected argument');
            },
            load: fn => {
                return fs.readFileSync(fn, 'utf-8');
            },
        };

        const ns = new Namespace({
            classLoader: new ClassLoader(finder, path, vm),
            finder: finder,
        }, 'Foo', path.join(__dirname, '..', 'fixtures'), __jymfony.autoload.classLoader._internalRequire);
        try {
            global.Foo = ns;

            const foo = new ns.FooClass();
            const bar = foo.bar;

            expect(bar).to.be.instanceOf(ns.BarClass);
            expect(foo).to.be.instanceOf(ns.FooClass);
            expect(ns.FooClass.HELLO).to.be.equal('Hello, world!');
        } finally {
            delete global.Foo;
        }
    });
});
