const expect = require('chai').expect;

/*
 * We are testing autoloader component here
 * cannot use the autoloader itself to load classes! :)
 */
const Finder = require('../src/Finder');
const path = require('path');

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

describe('[Autoloader] Finder', function () {
    it('findRoot', function () {
        const module = {
            parent: {
                parent: {
                    parent: undefined,
                    filename: '/var/node/foo/bar/app.js',
                },
            },
        };

        const mockedPath = {
            join: pathJoin,
            dirname: path.dirname,
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

        const finder = new Finder(fs, mockedPath, module);
        expect(finder.findRoot()).to.be.equal('/var/node/foo/bar');
    });

    it('findRoot caches result', function () {
        const module = {
            parent: {
                parent: {
                    parent: undefined,
                    filename: '/var/node/foo/bar/app.js',
                },
            },
        };

        const mockedPath = {
            join: pathJoin,
            dirname: path.dirname,
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

        const finder = new Finder(fs, mockedPath, module);

        finder.findRoot();
        finder.findRoot();

        expect(callCount).to.be.equal(1);
    });

    it('findRoot should rethrow if error is not ENOENT', function () {
        const module = {
            parent: {
                parent: {
                    parent: undefined,
                    filename: '/var/node/foo/bar/app.js',
                },
            },
        };

        const mockedPath = {
            join: pathJoin,
            dirname: path.dirname,
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

        const finder = new Finder(fs, mockedPath, module);

        expect(finder.findRoot.bind(finder)).to.throw();
    });

    it('listModules', function () {
        const module = {
            parent: undefined,
            filename: '/var/node/foo/bar/app.js',
        };

        const mockedPath = {
            join: pathJoin,
            dirname: path.dirname,
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

        const finder = new Finder(fs, mockedPath, module);
        expect(Array.from(finder.listModules())).to.be.deep.equal([
            'jymfony-autoloader',
            'chai',
            'jymfony-event-dispatcher',
            '@jymfony/dependency-injection',
            '@jymfony/framework-bundle',
        ]);
    });

    it('listModules rethrows errors', function () {
        const module = {
            parent: undefined,
            filename: '/var/node/foo/bar/app.js',
        };

        const mockedPath = {
            join: pathJoin,
            dirname: path.dirname,
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

        const finder = new Finder(fs, mockedPath, module);
        expect(() => Array.from(finder.listModules())).to.throw('TEST_ERROR');
    });

    it('listModules with no modules installed', function () {
        const module = {
            parent: undefined,
            filename: '/var/node/foo/bar/app.js',
        };

        const mockedPath = {
            join: pathJoin,
            dirname: path.dirname,
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

        const finder = new Finder(fs, mockedPath, module);
        const mods = Array.from(finder.listModules());

        expect(mods).to.be.deep.equal([]);
    });

    it('find', function () {
        const fs = {
            statSync: (fn) => {
                expect(fn).to.be.equal('/var/node/package.json');

                return {
                    isDirectory: () => false,
                };
            },
        };

        const finder = new Finder(fs, { normalize: str => str, sep: '/' }, {});
        const obj = finder.find('/var/node', 'package.json');

        expect(obj).to.be.deep.equal({
            filename: '/var/node/package.json',
            directory: false,
        });
    });

    it('find appends .js ext', function () {
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

        const finder = new Finder(fs, { normalize: str => str, sep: '/' }, {});
        const obj = finder.find('/var/node', 'index');

        expect(obj).to.be.deep.equal({
            filename: '/var/node/index.js',
            directory: false,
        });
    });

    it('find returns undefined if not found', function () {
        const fs = {
            statSync: () => {
                const e = new Error();
                e.code = 'ENOENT';

                throw e;
            },
        };

        const finder = new Finder(fs, { normalize: path.normalize, sep: '/' }, {});
        const obj = finder.find('/var/node', 'index');

        expect(obj).to.be.deep.undefined;
    });

    it('find rethrows errors', function () {
        const fs = {
            statSync: () => {
                const e = new Error();
                e.code = 'EUNK';

                throw e;
            },
        };

        const finder = new Finder(fs, { normalize: path.normalize, sep: '/' }, {});
        expect(finder.find.bind(finder, '/var/node', 'index')).to.throw();
    });
});
