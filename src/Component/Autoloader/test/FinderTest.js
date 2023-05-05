import { dirname, normalize } from 'path';

const Finder = Jymfony.Component.Autoloader.Finder;
const TestCase = Jymfony.Component.Testing.Framework.TestCase;

const pathJoin = function (...args) {
    let joined = undefined;
    for (let i = 0; i < args.length; ++i) {
        const arg = args[i];
        if (0 < arg.length) {
            if (joined === undefined) {
                joined = arg;
            } else {
                joined += '/' + arg;
            }
        }
    }

    return joined;
};

export default class FinderTest extends TestCase {
    get testCaseName() {
        return '[Autoloader] ' + super.testCaseName;
    }

    testFindRoot() {
        const require = {
            main: {
                parent: undefined,
                filename: '/var/node/foo/bar/app.js',
            },
        };

        const mockedPath = {
            join: pathJoin,
            dirname,
            normalize: str => str,
            sep: '/',
        };

        const fs = {
            statSync: (fn) => {
                if ('/var/node/foo/bar/package.json' !== fn) {
                    throw new Error('Incorrect argument "'+fn+'"');
                }

                return {
                    isDirectory: () => false,
                };
            },
        };

        const finder = new Finder(require, fs, mockedPath);
        __self.assertEquals('/var/node/foo/bar', finder.findRoot());
    }

    testFindRootCachesResult() {
        const require = {
            main: {
                parent: undefined,
                filename: '/var/node/foo/bar/app.js',
            },
        };

        const mockedPath = {
            join: pathJoin,
            dirname,
            normalize: str => str,
            sep: '/',
        };

        let callCount = 0;
        const fs = {
            statSync: () => {
                ++callCount;

                return {
                    isDirectory: () => false,
                };
            },
        };

        const finder = new Finder(require, fs, mockedPath);

        finder.findRoot();
        finder.findRoot();

        __self.assertEquals(1, callCount);
    }

    testFindRootShouldRethrowIfErrorIsNotENOENT() {
        const require = {
            main: {
                parent: undefined,
                filename: '/var/node/foo/bar/app.js',
            },
        };

        const mockedPath = {
            join: pathJoin,
            dirname,
            normalize: str => str,
            sep: '/',
        };

        const fs = {
            statSync: () => {
                const e = new Error();
                e.code = 'EUNK';

                throw e;
            },
        };

        const finder = new Finder(require, fs, mockedPath);

        this.expectException(Error);
        finder.findRoot.bind(finder);
    }

    testListModules() {
        const require = {
            main: {
                parent: undefined,
                filename: '/var/node/foo/bar/app.js',
            },
        };

        const mockedPath = {
            join: pathJoin,
            dirname,
            normalize: str => str,
            sep: '/',
        };

        const fs = {
            readdirSync: (dir) => {
                if ('/var/node/node_modules' === dir) {
                    return [
                        '.bin',
                        'jymfony-autoloader',
                        'chai',
                        'jymfony-event-dispatcher',
                        '@jymfony',
                    ];
                }

                if ('/var/node/node_modules/@jymfony' === dir) {
                    return [
                        'dependency-injection',
                        'framework-bundle',
                    ];
                }

                return [];
            },
            realpathSync: fn => fn,
            statSync: (fn) => {
                switch (fn) {
                    case '/var/node/foo/bar/package.json':
                        return {
                            isDirectory: () => false,
                        };

                    case '/var/node/foo/bar/node_modules': {
                        const e = new Error();
                        e.code = 'ENOENT';
                        throw e;
                    }

                    case '/var/node/foo/node_modules':
                        return {
                            isDirectory: () => false,
                        };

                    case '/var/node/node_modules':
                        return {
                            isDirectory: () => true,
                        };

                    case '/var/node/node_modules/@jymfony':
                        return {
                            isDirectory: () => true,
                        };

                    default:
                        throw new Error('Unexpected argument "' + fn + '"');
                }
            },
        };

        const finder = new Finder(require, fs, mockedPath);
        __self.assertEquals([
            'jymfony-autoloader',
            'chai',
            'jymfony-event-dispatcher',
            '@jymfony/dependency-injection',
            '@jymfony/framework-bundle',
        ], Array.from(finder.listModules()));
    }

    testListModulesRethrowsErrors() {
        const require = {
            main: {
                parent: undefined,
                filename: '/var/node/foo/bar/app.js',
            },
        };

        const mockedPath = {
            join: pathJoin,
            dirname,
            normalize: str => str,
            sep: '/',
        };

        const fs = {
            readdirSync: () => {
                return [
                    '.bin',
                    'jymfony-autoloader',
                    'chai',
                    'jymfony-event-dispatcher',
                ];
            },
            realpathSync: fn => fn,
            statSync: fn => {
                if ('/var/node/foo/bar/package.json' === fn) {
                    return {
                        isDirectory: () => false,
                    };
                }

                throw new Error('TEST_ERROR');
            },
        };

        const finder = new Finder(require, fs, mockedPath);

        this.expectExceptionMessage('TEST_ERROR');
        Array.from(finder.listModules());
    }

    testListModulesWithNoModulesInstalled() {
        const require = {
            main: {
                parent: undefined,
                filename: '/var/node/foo/bar/app.js',
            },
        };

        const mockedPath = {
            join: pathJoin,
            dirname,
            normalize: str => str,
            sep: '/',
        };

        const fs = {
            readdirSync: () => {
                return [];
            },
            realpathSync: fn => fn,
            statSync: () => {
                return {
                    isDirectory: () => false,
                };
            },
        };

        const finder = new Finder(require, fs, mockedPath);
        const mods = Array.from(finder.listModules());

        __self.assertEquals([], mods);
    }

    testFind() {
        const fs = {
            statSync: (fn) => {
                __self.assertEquals('/var/node/package.json', fn);

                return {
                    isDirectory: () => false,
                };
            },
        };

        const finder = new Finder({}, fs, { normalize: str => str, sep: '/' });
        const obj = finder.find('/var/node', 'package.json');

        __self.assertEquals({
            filename: '/var/node/package.json',
            directory: false,
        }, obj);
    }

    testFindAppendsJsExt() {
        const fs = {
            statSync: (fn) => {
                if ('/var/node/index' === fn) {
                    const e = new Error();
                    e.code = 'ENOENT';

                    throw e;
                } else if ('/var/node/index.js' === fn) {
                    return {
                        isDirectory: () => false,
                    };
                }

                throw new Error('Invalid argument');
            },
        };

        const finder = new Finder({}, fs, { normalize: str => str, sep: '/' });
        const obj = finder.find('/var/node', 'index');

        __self.assertEquals({
            filename: '/var/node/index.js',
            directory: false,
        }, obj);
    }

    testFindReturnsUndefinedIfNotFound() {
        const fs = {
            statSync: () => {
                const e = new Error();
                e.code = 'ENOENT';

                throw e;
            },
        };

        const finder = new Finder({}, fs, { normalize, sep: '/' });
        const obj = finder.find('/var/node', 'index');

        __self.assertUndefined(obj);
    }

    testFindRethrowsErrors() {
        const fs = {
            statSync: () => {
                const e = new Error();
                e.code = 'EUNK';

                throw e;
            },
        };

        const finder = new Finder({}, fs, { normalize, sep: '/' });
        this.expectException(Error);
        finder.find('/var/node', 'index');
    }
}
