import { accessSync, constants, readFileSync, statSync } from 'fs';

const FormatException = Jymfony.Component.Dotenv.Exception.FormatException;
const FormatExceptionContext = Jymfony.Component.Dotenv.Exception.FormatExceptionContext;
const PathException = Jymfony.Component.Dotenv.Exception.PathException;

const isFile = path => {
    try {
        statSync(path);
    } catch (e) {
        return false;
    }

    return true;
};

/**
 * Manages .env files.
 *
 * @memberOf Jymfony.Component.Dotenv
 */
export default class Dotenv {
    /**
     * @param {string} envKey
     * @param {string} debugKey
     */
    __construct(envKey = 'APP_ENV', debugKey = 'APP_DEBUG') {
        /**
         * @type {string}
         *
         * @private
         */
        this._path = undefined;

        /**
         * @type {int}
         *
         * @private
         */
        this._cursor = undefined;

        /**
         * @type {int}
         *
         * @private
         */
        this._lineno = undefined;

        /**
         * @type {string}
         *
         * @private
         */
        this._data = undefined;

        /**
         * @type {int}
         *
         * @private
         */
        this._end = undefined;

        /**
         * @type {Object.<string, string>}
         *
         * @private
         */
        this._values = undefined;

        /**
         * @type {string}
         *
         * @private
         */
        this._envKey = envKey;

        /**
         * @type {string}
         *
         * @private
         */
        this._debugKey = debugKey;

        /**
         * @type {string[]}
         *
         * @private
         */
        this._prodEnvs = [ 'prod' ];
    }

    /**
     * Sets the prod environment names.
     *
     * @param {string[]} prodEnvs
     *
     * @returns {Jymfony.Component.Dotenv.Dotenv}
     */
    setProdEnvs(prodEnvs) {
        this._prodEnvs = prodEnvs;

        return this;
    }

    /**
     * Loads one or several .env files.
     *
     * @param {string} path A file to load
     * @param {...string} extraPaths A list of additional files to load
     *
     * @throws {Jymfony.Component.Dotenv.Exception.FormatException} when a file has a syntax error
     * @throws {Jymfony.Component.Dotenv.Exception.PathException} when a file does not exist or is not readable
     */
    load(path, ...extraPaths) {
        this._doLoad(false, [ path, ...extraPaths ]);
    }

    /**
     * Loads a .env file and the corresponding .env.local, .env.$env and .env.$env.local files if they exist.
     *
     * .env.local is always ignored in test env because tests should produce the same results for everyone.
     * .env.dist is loaded when it exists and .env is not found.
     *
     * @param {string} path A file to load
     * @param {string|null} envKey The name of the env vars that defines the app env
     * @param {string} defaultEnv The app env to use when none is defined
     * @param {string[]} testEnvs A list of app envs for which .env.local should be ignored
     *
     * @throws {Jymfony.Component.Dotenv.Exception.FormatException} when a file has a syntax error
     * @throws {Jymfony.Component.Dotenv.Exception.PathException} when a file does not exist or is not readable
     */
    loadEnv(path, envKey = null, defaultEnv = 'dev', testEnvs = [ 'test' ]) {
        const k = envKey || this._envKey;
        let p = path + '.dist';
        if (isFile(path) || ! isFile(p)) {
            this.load(path);
        } else {
            this.load(p);
        }

        let env = process.env[k] || undefined;
        if (undefined === env) {
            this.populate({[k]: env = defaultEnv});
        }

        if (! testEnvs.includes(env) && isFile(p = path + '.local')) {
            this.load(p);
            env = process.env[k] || env;
        }

        if ('local' === env) {
            return;
        }

        if (isFile(p = path + '.' + env)) {
            this.load(p);
        }

        if (isFile(p = path + '.' + env + '.local')) {
            this.load(p);
        }
    }

    /**
     * Loads env vars from .env.local.php if the file exists or from the other .env files otherwise.
     *
     * This method also configures the APP_DEBUG env var according to the current APP_ENV.
     *
     * See method loadEnv() for rules related to .env files.
     *
     * @param {string} path
     * @param {string} defaultEnv
     * @param {string[]} testEnvs
     */
    bootEnv(path, defaultEnv = 'dev', testEnvs = [ 'test' ]) {
        const p = path + '.local.js';
        const env = isFile(p) ? __jymfony.autoload.classLoader.loadFile(p) : undefined;
        let k = this._envKey;

        if (isArray(env) && undefined === env[k] || (process.env[k] || env[k]) === env[k]) {
            this.populate(env);
        } else {
            this.loadEnv(path, k, defaultEnv, testEnvs);
        }

        k = this._debugKey;
        const debug = process.env[k] === undefined ? ! this._prodEnvs.includes(process.env[this._envKey]) : process.env[k];
        process.env[k] = isBoolean(debug) ? (debug ? '1' : '0') : debug;
    }

    /**
     * Loads one or several .env files and enables override existing vars.
     *
     * @param {string} path A file to load
     * @param {...string} extraPaths A list of additional files to load
     *
     * @throws {Jymfony.Component.Dotenv.Exception.FormatException} when a file has a syntax error
     * @throws {Jymfony.Component.Dotenv.Exception.PathException} when a file does not exist or is not readable
     */
    overload(path, ...extraPaths) {
        this._doLoad(true, [ path, ...extraPaths ]);
    }

    /**
     * Sets values as environment variables.
     *
     * @param {Object.<string, string>} values An array of env variables
     * @param {boolean} overrideExistingVars true when existing environment variables must be overridden
     */
    populate(values, overrideExistingVars = false) {
        let updateLoadedVars = false;
        const loadedVars = {};
        for (const VAR of (process.env.JYMFONY_DOTENV_VARS || '').split(',')) {
            loadedVars[VAR] = 1;
        }

        for (const [ name, value ] of __jymfony.getEntries(values)) {
            if (undefined === loadedVars[name] && ! overrideExistingVars && undefined !== process.env[name]) {
                continue;
            }

            process.env[name] = value;

            if (undefined === loadedVars[name]) {
                loadedVars[name] = updateLoadedVars = true;
            }
        }

        if (updateLoadedVars) {
            delete loadedVars[''];
            process.env.JYMFONY_DOTENV_VARS = Object.keys(loadedVars).join(',');
        }
    }

    /**
     * Parses the contents of an .env file.
     *
     * @param {string|Buffer} data The data to be parsed
     * @param {string} path The original file name where data where stored (used for more meaningful error messages)
     *
     * @returns {Object.<string, string>} An array of env variables
     *
     * @throws {Jymfony.Component.Dotenv.Exception.FormatException} when a file has a syntax error
     */
    parse(data, path = '.env') {
        if (isBuffer(data)) {
            data = data.toString();
        }

        this._path = path;
        this._data = data.replace(/\r\n?/, '\n');
        this._lineno = 1;
        this._cursor = 0;
        this._end = this._data.length;

        let state = __self.STATE_VARNAME;
        this._values = {};
        let name = '';

        this._skipEmptyLines();

        while (this._cursor < this._end) {
            switch (state) {
                case __self.STATE_VARNAME:
                    name = this._lexVarname();
                    state = __self.STATE_VALUE;
                    break;

                case __self.STATE_VALUE:
                    this._values[name] = this._lexValue();
                    state = __self.STATE_VARNAME;
                    break;
            }
        }

        if (__self.STATE_VALUE === state) {
            this._values[name] = '';
        }

        try {
            return { ...this._values };
        } finally {
            this._values = {};
            this._data = undefined;
            this._path = undefined;
        }
    }

    /**
     * @returns {string}
     *
     * @private
     */
    _lexVarname() {
        // Var name + optional export
        const matches = this._data.substr(this._cursor).match(new RegExp('(export[ \t]+)?(' + __self.VARNAME_REGEX + ')'));
        if (! matches) {
            throw this._createFormatException('Invalid character in variable name');
        }

        this._moveCursor(matches[0]);

        if (this._cursor === this._end || '\n' === this._data[this._cursor] || '#' === this._data[this._cursor]) {
            if (matches[1]) {
                throw this._createFormatException('Unable to unset an environment variable');
            }

            throw this._createFormatException('Missing = in the environment variable declaration');
        }

        if (' ' === this._data[this._cursor] || '\t' === this._data[this._cursor]) {
            throw this._createFormatException('Whitespace characters are not supported after the variable name');
        }

        if ('=' !== this._data[this._cursor]) {
            throw this._createFormatException('Missing = in the environment variable declaration');
        }

        ++this._cursor;

        return matches[2];
    }

    _lexValue() {
        const matches = this._data.substr(this._cursor).match(/^[ \t]*(?:#.*)?(?:\n+|$)/);
        if (matches) {
            this._moveCursor(matches[0]);
            this._skipEmptyLines();

            return '';
        }

        if (' ' === this._data[this._cursor] || '\t' === this._data[this._cursor]) {
            throw this._createFormatException('Whitespace are not supported before the value');
        }

        const loadedVars = {};
        for (const VAR of (process.env.JYMFONY_DOTENV_VARS || '').split(',')) {
            loadedVars[VAR] = 1;
        }

        delete loadedVars[''];
        let v = '';

        do {
            if ('\'' === this._data[this._cursor]) {
                let len = 0;

                do {
                    if (this._cursor + ++len === this._end) {
                        this._cursor += len;

                        throw this._createFormatException('Missing quote to end the value');
                    }
                } while ('\'' !== this._data[this._cursor + len]);

                v += this._data.substr(1 + this._cursor, len - 1);
                this._cursor += 1 + len;
            } else if ('"' === this._data[this._cursor]) {
                let value = '';
                if (++this._cursor === this._end) {
                    throw this._createFormatException('Missing quote to end the value');
                }

                while ('"' !== this._data[this._cursor] || ('\\' === this._data[this._cursor - 1] && '\\' !== this._data[this._cursor - 2])) {
                    value += this._data[this._cursor];
                    ++this._cursor;

                    if (this._cursor === this._end) {
                        throw this._createFormatException('Missing quote to end the value');
                    }
                }

                ++this._cursor;
                value = __jymfony.strtr(value, { '\\"': '"', '\\r': '\r', '\\n': '\n' });

                let resolvedValue = value;
                resolvedValue = this._resolveVariables(resolvedValue, loadedVars);
                resolvedValue = this._resolveCommands(resolvedValue, loadedVars);
                resolvedValue = resolvedValue.replace(/\\\\/g, '\\');
                v += resolvedValue;
            } else {
                let value = '';
                let prevChr = this._data[this._cursor - 1];
                while (this._cursor < this._end && ![ '\n', '"', '\'' ].includes(this._data[this._cursor]) && !((' ' === prevChr || '\t' === prevChr) && '#' === this._data[this._cursor])) {
                    if ('\\' === this._data[this._cursor] && undefined !== this._data[this._cursor + 1] && ('"' === this._data[this._cursor + 1] || '\'' === this._data[this._cursor + 1])) {
                        ++this._cursor;
                    }

                    value += prevChr = this._data[this._cursor];

                    if ('$' === this._data[this._cursor] && undefined !== this._data[this._cursor + 1] && '(' === this._data[this._cursor + 1]) {
                        ++this._cursor;
                        value += '(' + this._lexNestedExpression() + ')';
                    }

                    ++this._cursor;
                }

                value = __jymfony.rtrim(value);
                let resolvedValue = value;
                resolvedValue = this._resolveVariables(resolvedValue, loadedVars);
                resolvedValue = this._resolveCommands(resolvedValue, loadedVars);
                resolvedValue = resolvedValue.replace(/\\\\/g, '\\');

                if (resolvedValue === value && value.match(/\s+/)) {
                    throw this._createFormatException('A value containing spaces must be surrounded by quotes');
                }

                v += resolvedValue;

                if (this._cursor < this._end && '#' === this._data[this._cursor]) {
                    break;
                }
            }
        } while (this._cursor < this._end && '\n' !== this._data[this._cursor]);

        this._skipEmptyLines();

        return v;
    }

    _lexNestedExpression() {
        ++this._cursor;
        let value = '';

        while ('\n' !== this._data[this._cursor] && ')' !== this._data[this._cursor]) {
            value += this._data[this._cursor];

            if ('(' === this._data[this._cursor]) {
                value += this._lexNestedExpression() + ')';
            }

            ++this._cursor;

            if (this._cursor === this._end) {
                throw this._createFormatException('Missing closing parenthesis.');
            }
        }

        if ('\n' === this._data[this._cursor]) {
            throw this._createFormatException('Missing closing parenthesis.');
        }

        return value;
    }

    /**
     * @private
     */
    _skipEmptyLines() {
        const match = this._data.substr(this._cursor).match(/^(?:\s*(?:#[^\n]*)?)+/m);
        if (match) {
            this._moveCursor(match[0]);
        }
    }

    /**
     * @param {string} value
     * @param {Object.<string, string>} loadedVars
     *
     * @returns {string}
     *
     * @private
     */
    _resolveCommands(value, loadedVars) {
        if (-1 === value.indexOf('$(')) {
            return value;
        }

        throw new Exception('Not implemented yet');

        const regex = /(\\\\)?\$\(([^()])\)/; // TODO: balancing parens
        return value.replace(regex, (...matches) => {
            if ('\\' === matches[1]) {
                return matches[0].substr(1);
            }

            if (__jymfony.Platform.isWindows()) {
                throw new LogicException('Resolving commands is not supported on Windows.');
            }

            if (! ReflectionClass.exists('Jymfony.Component.Process.Process')) {
                throw new LogicException('Resolving commands requires the Jymfony Process component.');
            }

            const process = Process.fromShellCommandline('echo ' + matches[0]);
            const env = {};
            for (const [ name, value ] of this._values) {
                if (undefined !== loadedVars[name]) {
                    env[name] = value;
                }
            }

            process.setEnv(env);

            try {
                process.mustRunSync();
            } catch (e) {
                if (e instanceof Jymfony.Component.Process.Exception.ProcessException) {
                    throw this._createFormatException(__jymfony.sprintf('Issue expanding a command (%s)', process.errorOutput));
                }
            }

            return process.output.replace(/[\r\n]+$/, '');
        });
    }

    /**
     * @param {string} value
     * @param {Object.<string, string>} loadedVars
     *
     * @returns {string}
     *
     * @private
     */
    _resolveVariables(value, loadedVars) {
        if (-1 === value.indexOf('$')) {
            return value;
        }

        const regex = /(?<!\\)(?<backslashes>\\*)\$(?!\()(?<opening_brace>{)?(?<name>(?:[a-zA-Z][a-zA-Z0-9_]*))?(?<default_value>:[-=][^}]+)?(?<closing_brace>})?/g;
        return value.replace(regex, (match, backslashes, opening_brace, name, default_value, closing_brace) => {
            // Odd number of backslashes means the $ character is escaped
            if (1 === backslashes.length % 2) {
                return match.substr(1);
            }

            // Unescaped $ not followed by variable name
            if (! name) {
                return match;
            }

            if ('{' === opening_brace && ! closing_brace) {
                throw this._createFormatException('Unclosed braces on variable expansion');
            }

            let value = '';
            if (!! loadedVars[name] && !! this._values[name]) {
                value = this._values[name];
            } else if (!! process.env[name]) {
                value = process.env[name];
            } else if (!! this._values[name]) {
                value = this._values[name];
            }

            if ('' === value && !! default_value) {
                const unsupportedChars = default_value.match(/['"{$]/);
                if (unsupportedChars) {
                    throw this._createFormatException(__jymfony.sprintf('Unsupported character "%s" found in the default value of variable "$%s".', unsupportedChars[0], name));
                }

                value = default_value.substr(2);

                if ('=' === default_value[1]) {
                    this._values[name] = value;
                }
            }

            if (! opening_brace && !! closing_brace) {
                value += '}';
            }

            return backslashes + value;
        });
    }

    /**
     * @param {string} text
     *
     * @private
     */
    _moveCursor(text) {
        this._cursor += text.length;
        this._lineno += text.split('\n').length - 1;
    }

    /**
     * @param {string} message
     *
     * @returns {Jymfony.Component.Dotenv.Exception.FormatException}
     *
     * @private
     */
    _createFormatException(message) {
        return new FormatException(message, new FormatExceptionContext(this._data, this._path, this._lineno, this._cursor));
    }

    /**
     * Do load env variables
     *
     * @param {boolean} overrideExistingVars
     * @param {string[]} paths
     */
    _doLoad(overrideExistingVars, paths) {
        const isReadable = path => {
            try {
                accessSync(path, constants.R_OK);
            } catch (e) {
                return false;
            }

            const stat = statSync(path);
            return ! stat.isDirectory();
        };

        for (const path of paths) {
            if (! isReadable(path)) {
                throw new PathException(path);
            }

            this.populate(this.parse(readFileSync(path), path), overrideExistingVars);
        }
    }
}

Dotenv.VARNAME_REGEX = '(?:[a-zA-Z][a-zA-Z0-9_]*)';
Dotenv.STATE_VARNAME = 0;
Dotenv.STATE_VALUE = 1;
