import * as path from 'path';
import * as vm from 'vm';
import { readFileSync } from 'fs';

const ClassLoader = Jymfony.Component.Autoloader.ClassLoader;
const ClassNotFoundException = Jymfony.Component.Autoloader.Exception.ClassNotFoundException;
const Namespace = Jymfony.Component.Autoloader.Namespace;
const TestCase = Jymfony.Component.Testing.Framework.TestCase;

const cwdOSRoot = path.parse(process.cwd()).root.toUpperCase();

export default class NamespaceTest extends TestCase {
    get testCaseName() {
        return '[Autoloader] ' + super.testCaseName;
    }

    afterEach() {
        ClassLoader.clearCache(__jymfony.Platform.isWindows() ? cwdOSRoot + 'var\\node\\foo_vendor\\' : '/var/node/foo_vendor');
    }

    testConstructsAsAProxy() {
        /*
         * ES6 Proxies are transparent virtualized objects, so
         * it is impossible to know whether an object is a
         * proxy or not, we just check that is not a Namespace
         */

        const ns = new Namespace({});
        __self.assertNotInstanceOf(Namespace, ns);
        __self.assertInstanceOf(Namespace, ns.__namespace);
    }

    testReturnsUndefinedIfASymbolIsRequested() {
        const ns = new Namespace({});
        __self.assertUndefined(ns[Symbol.iterator]);
    }

    testReturnsUndefinedIfNamespaceIsNotFound() {
        const finder = {
            find: () => {
                const e = new Error();
                e.code = 'ENOENT';
            },
        };

        const ns = new Namespace({ finder: finder });
        const subns = ns.NotValid;

        __self.assertUndefined(subns);
    }

    testThrowsIfNamespaceIsNotFoundAndDebugIsEnabled() {
        const finder = {
            find: () => {
                const e = new Error();
                e.code = 'ENOENT';
            },
        };

        const ns = new Namespace({ finder: finder });
        const subns = ns.NotValid;

        __self.assertUndefined(subns);
    }

    testThrowsIfIsNotAConstructorAndDebugIsEnabled() {
        const req = module => {
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
                __self.assertEquals('FooClass', name);
                return {
                    filename: '/var/node/foo_vendor/FooClass.js',
                    directory: false,
                };
            },
            load: (fn) => {
                __self.assertEquals(__jymfony.Platform.isWindows() ? cwdOSRoot + 'var\\node\\foo_vendor\\FooClass.js' : '/var/node/foo_vendor/FooClass.js', fn);
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

        this.expectException(ClassNotFoundException);

        const class_ = ns.FooClass;
        __self.assertUndefined(class_);
    }

    testObjectCanBeSet() {
        const ns = new Namespace({});
        ns.subNs = {
            foo: 'bar',
        };

        __self.assertEquals({
            foo: 'bar',
        }, ns.subNs);
    }

    testSearchesInAllBaseDirs() {
        const finder = {
            find: (dir, name) => {
                switch (dir) {
                    case '/var/node/vendor1/':
                        return undefined;

                    case '/var/node/foo_vendor/':
                        __self.assertEquals('FooClass', name);
                        return {
                            filename: '/var/node/foo_vendor/FooClass.js',
                            directory: false,
                        };

                    default:
                        throw new Error('Unexpected argument');
                }
            },
            load: (fn) => {
                __self.assertEquals(__jymfony.Platform.isWindows() ? cwdOSRoot + 'var\\node\\foo_vendor\\FooClass.js' : '/var/node/foo_vendor/FooClass.js', fn);
                return 'module.exports = function () { };';
            },
        };

        const req = module => {
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
        __self.assertInstanceOf(Function, func);
    }

    testInjectsReflectionMetadata() {
        const finder = {
            find: (dir, name) => {
                if ('/var/node/foo_vendor/' === dir) {
                    __self.assertEquals('FooClass', name);
                    return {
                        filename: '/var/node/foo_vendor/FooClass.js',
                        directory: false,
                    };
                }
                throw new Error('Unexpected argument');

            },
            load: fn => {
                __self.assertEquals(__jymfony.Platform.isWindows() ? cwdOSRoot + 'var\\node\\foo_vendor\\FooClass.js' : '/var/node/foo_vendor/FooClass.js', fn);
                return 'module.exports = class FooClass {}';
            },
        };

        const req = module => {
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

        __self.assertInstanceOf(Function, func);
        const { Compiler } = require('@jymfony/compiler');
        const metadata = Compiler.getReflectionData(func);

        if ('\\' === path.sep) {
            __self.assertMatchesRegularExpression(/\\var\\node\\foo_vendor\\FooClass\.js$/, metadata.filename);
        } else {
            __self.assertEquals('/var/node/foo_vendor/FooClass.js', metadata.filename);
        }

        __self.assertEquals('Foo.FooClass', metadata.fqcn);
        __self.assertNotUndefined(metadata.constructor);
        __self.assertNotUndefined(metadata.namespace);
    }

    testCalls__constructOnNewIfDefined() {
        const finder = {
            find: (dir, name) => {
                if ('/var/node/foo_vendor/' === dir) {
                    __self.assertEquals('FooClass', name);
                    return {
                        filename: '/var/node/foo_vendor/FooClass.js',
                        directory: false,
                    };
                }
                throw new Error('Unexpected argument');

            },
            load: fn => {
                __self.assertEquals(__jymfony.Platform.isWindows() ? cwdOSRoot + 'var\\node\\foo_vendor\\FooClass.js' : '/var/node/foo_vendor/FooClass.js', fn);
                return `module.exports = class FooClass {
                    __construct(arg) {
                        this.constructCalled = arg;
                    }
                };`;
            },
        };

        const req = module => {
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
        __self.assertEquals('foobar', obj.constructCalled);
    }

    testCalls__constructOnNewIfDefined2() {
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

        const req = module => {
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
            __self.assertEquals('foobar', obj.constructCalled);
            __self.assertUndefined(obj.superCalled);
        } finally {
            delete global.__ns;
        }
    }

    testResolvesCircularRequirements() {
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
                return readFileSync(fn, 'utf-8');
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

            __self.assertInstanceOf(ns.BarClass, bar);
            __self.assertInstanceOf(ns.FooClass, foo);
            __self.assertEquals('Hello, world!', ns.FooClass.HELLO);
        } finally {
            delete global.Foo;
        }
    }
}
