import { accessSync, constants, statSync } from 'fs';
import { dirname, resolve, sep } from 'path';
import Mocha from 'mocha';

const GlobResource = Jymfony.Component.Config.Resource.GlobResource;
const Namespace = Jymfony.Component.Autoloader.Namespace;
const TestCase = Jymfony.Component.Testing.Framework.TestCase;

/**
 * @memberOf Jymfony.Component.Testing.Framework
 */
export default class Runner {
    /**
     * Constructor.
     *
     * @param {Mocha} mocha
     */
    __construct(mocha = new Mocha({ fullStackTrace: true })) {
        this._mocha = mocha;
    }

    /**
     * Run the test suite.
     */
    run(patterns = process.argv) {
        global.dataProvider = value => Jymfony.Component.Testing.Annotation.DataProvider(value);
        global.afterEach = Jymfony.Component.Testing.Annotation.AfterEach;
        global.beforeEach = Jymfony.Component.Testing.Annotation.BeforeEach;
        global.timeSensitive = Jymfony.Component.Testing.Annotation.TimeSensitive;

        patterns = patterns
            .filter(p => ! p.startsWith('-'))
            .map(p => resolve(p).replace(/\\/g, '/'));

        /** @type {Set<Jymfony.Component.Autoloader.Namespace>} */
        const targetNamespaces = new Set();

        /** @type {Jymfony.Component.Autoloader.Namespace[]} */
        const namespaces = Object.keys(global).filter(k => global[k] && global[k].__namespace instanceof Namespace).map(k => global[k]);
        let currentLevel = [ ...namespaces ];

        while (true) {
            const nextLevel = [];
            for (const namespace of currentLevel) {
                const ns = namespace.__namespace;
                if (0 !== ns.directories.length) {
                    targetNamespaces.add(ns);
                }

                for (const key in namespace) {
                    if ('__namespace' === key) {
                        continue;
                    }

                    if (! namespace.hasOwnProperty(key)) {
                        continue;
                    }

                    if (namespace[key] && namespace[key].__namespace instanceof Namespace) {
                        nextLevel.push(namespace[key]);
                    }
                }
            }

            if (0 === nextLevel.length) {
                break;
            }

            currentLevel = nextLevel;
        }

        const files = [];
        for (const p of patterns) {
            files.push(...this._glob(p));
        }

        const targetFiles = new Set();
        const targetClasses = new Set();
        for (const namespace of targetNamespaces) {
            const [ c, f ] = this._findClasses(namespace, files);

            f.forEach(targetFiles.add.bind(targetFiles));
            c.forEach(class_ => {
                const reflection = new ReflectionClass(class_);
                if (! reflection.isSubclassOf(TestCase) || ! reflection.name.endsWith('Test')) {
                    return;
                }

                targetClasses.add(class_);
            });
        }

        [ ...targetFiles ].forEach(f => {
            Jymfony.Component.Autoloader.ClassLoader.clearCache(f);
            this._mocha.addFile(f.replace(/\//g, sep));
        });

        for (const class_ of targetClasses) {
            const reflection = new ReflectionClass(class_);
            reflection.newInstance().runTestCase(this._mocha);
        }

        if (0 === this._mocha.suite.suites.length && 0 === this._mocha.files.length) {
            console.error('No tests found');
            process.exit(2);
        }

        this._mocha.run(failures => {
            process.exit(failures ? 1 : 0);
        });
    }

    /**
     * @internal
     */
    * _glob(pattern) {
        let i, prefix;
        if (pattern.length === (i = __jymfony.strcspn(pattern, '*?{['))) {
            prefix = pattern;
            pattern = '';
        } else if (0 === i || -1 === pattern.substr(0, i).indexOf('/')) {
            prefix = '.';
            pattern = '/'+pattern;
        } else {
            prefix = dirname(pattern.substr(0, 1 + i));
            pattern = pattern.substr(prefix.length);
        }

        const prefixLen = prefix.length;
        const regex = GlobResource.globToRegex(pattern);

        if ('' === pattern) {
            /** @type {null|Stats} */
            let stat = null;
            try {
                stat = statSync(prefix);
            } catch (e) {
                // Do nothing.
            }

            if (null !== stat && stat.isFile()) {
                yield prefix;
            }
        }

        for (const file of new RecursiveDirectoryIterator(prefix)) {
            const normalizedPath = file.replace(/\\/g, '/');
            if (! normalizedPath.substring(prefixLen).match(regex)) {
                continue;
            }

            yield normalizedPath;
        }
    }

    /**
     * Finds classes into a namespace.
     *
     * @param {Jymfony.Component.Autoloader.Namespace} namespace
     * @param {string[]} files
     *
     * @returns {[ string[], string[] ]}
     *
     * @private
     */
    _findClasses(namespace, files) {
        const classes = {};
        const tFiles = {};
        const extRegexp = /\.js$/;

        let prefixLen = null;
        for (let directory of namespace.directories) {
            directory = directory.replace(/\\/g, '/');
            for (const path of files) {
                if (! path.startsWith(directory)) {
                    continue;
                }

                if (null === prefixLen) {
                    prefixLen = directory.length;
                }

                const m = path.match(extRegexp);
                if (null === m) {
                    continue;
                }

                try {
                    accessSync(path, constants.R_OK);
                } catch (e) {
                    continue;
                }

                const Class = namespace.name + '.' + __jymfony.ltrim(path.substring(prefixLen, path.length - m[0].length).replace(/[/\\]/g, '.'), '.');
                let r = null;

                try {
                    r = new ReflectionClass(Class);
                } catch (e) {
                    if (e instanceof SyntaxError) {
                        throw e;
                    }

                    tFiles[path] = true;
                    continue;
                }

                // Check to make sure the expected class exists
                if (!r) {
                    continue;
                }

                if (!r.isTrait && !r.isInterface) {
                    classes[Class] = true;
                }
            }
        }

        return [ Object.keys(classes), Object.keys(tFiles) ];
    }
}
