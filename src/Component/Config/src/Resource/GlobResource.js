const RecursiveDirectoryIterator = Jymfony.Component.Config.Resource.Iterator.RecursiveDirectoryIterator;
const SelfCheckingResourceInterface = Jymfony.Component.Config.Resource.SelfCheckingResourceInterface;
const crypto = require('crypto');
const fs = require('fs');
const pathModule = require('path');

/**
 * @memberOf Jymfony.Component.Config.Resource
 */
export default class GlobResource extends implementationOf(SelfCheckingResourceInterface) {
    /**
     * Constructor.
     *
     * @param {string} prefix
     * @param {string} pattern
     * @param {string[]} excludedPrefixes
     */
    __construct(prefix, pattern, excludedPrefixes = []) {
        try {
            prefix = fs.realpathSync(prefix);
        } catch (e) {
            prefix = fs.existsSync(prefix) ? prefix : false;
        }

        /**
         * @type {boolean|string}
         *
         * @private
         */
        this._prefix = prefix;

        /**
         * @type {string}
         *
         * @private
         */
        this._pattern = pattern;

        /**
         * @type {string[]}
         *
         * @private
         */
        this._excludedPrefixes = excludedPrefixes;

        /**
         * @type {string}
         *
         * @private
         */
        this._hash = undefined;
    }

    /**
     * Gets the glob prefix.
     *
     * @returns {string}
     */
    get prefix() {
        return this._prefix;
    }

    __sleep() {
        if (undefined === this._hash) {
            this._hash = this._computeHash();
        }

        return Object.keys(this);
    }

    /**
     * Gets the string representation of this resource.
     *
     * @returns {string}
     */
    toString() {
        return 'glob.' + this._prefix + this._pattern;
    }

    /**
     * @inheritdoc
     */
    isFresh() {
        return this._hash === this._computeHash();
    }

    /**
     * Gets an iterator on the provided prefix and glob.
     *
     * @returns {IterableIterator<*>}
     */
    * [Symbol.iterator]() {
        if (false === this._prefix || '' === this._pattern) {
            return;
        }

        const prefix = this._prefix.replace(/\\/g, '/');
        const prefixLen = this._prefix.length;
        const regex = __self.globToRegex(this._pattern);

        recursive: for (const path of new RecursiveDirectoryIterator(this._prefix)) {
            let normalizedPath = path.replace(/\\/g, '/');
            if (! normalizedPath.substr(prefixLen).match(regex)) {
                continue;
            }

            if (0 < this._excludedPrefixes.length) {
                let dirPath;

                do {
                    dirPath = normalizedPath;
                    if (undefined !== this._excludedPrefixes[dirPath]) {
                        continue recursive;
                    }
                } while (prefix !== dirPath && dirPath !== (normalizedPath = pathModule.dirname(dirPath)));
            }

            yield path;
        }
    }

    /**
     * Returns a RegExp which is the equivalent of the glob pattern.
     *
     * @param {string} glob
     * @param {boolean} strictLeadingDot
     * @param {boolean} strictWildcardSlash
     *
     * @returns {RegExp}
     */
    static globToRegex(glob, strictLeadingDot = true, strictWildcardSlash = true) {
        let firstByte = true;
        let escaping = false;
        let inCurlies = 0;
        let regex = '';

        const sizeGlob = glob.length;
        for (let i = 0; i < sizeGlob; ++i) {
            let car = glob[i];
            if (firstByte && strictLeadingDot && '.' !== car) {
                regex += '(?=[^\.])';
            }

            firstByte = '/' === car;

            if (firstByte && strictWildcardSlash && undefined !== glob[i + 2] && '**' === glob[i + 1] + glob[i + 2] && (undefined === glob[i + 3] || '/' === glob[i + 3])) {
                car = '[^/]+/';
                if (undefined === glob[i + 3]) {
                    car += '?';
                }

                if (strictLeadingDot) {
                    car = '(?=[^\.])' + car;
                }

                car = '/(?:' + car + ')*';
                i += 2 + (undefined !== glob[i + 3] ? 1 : 0);
            }

            if ('.' === car || '(' === car || ')' === car || '|' === car || '+' === car || '^' === car || '$' === car) {
                regex += '\\' + car;
            } else if ('*' === car) {
                regex += escaping ? '\\*' : (strictWildcardSlash ? '[^/]*' : '.*');
            } else if ('?' === car) {
                regex += escaping ? '\\?' : (strictWildcardSlash ? '[^/]' : '.');
            } else if ('{' === car) {
                regex += escaping ? '\\{' : '(';
                if (! escaping) {
                    ++inCurlies;
                }
            } else if ('}' === car && inCurlies) {
                regex += escaping ? '}' : ')';
                if (! escaping) {
                    --inCurlies;
                }
            } else if (',' === car && inCurlies) {
                regex += escaping ? ',' : '|';
            } else if ('\\' === car) {
                if (escaping) {
                    regex += '\\\\';
                    escaping = false;
                } else {
                    escaping = true;
                }

                continue;
            } else {
                regex += car;
            }

            escaping = false;
        }

        return new RegExp('^' + regex + '$');
    }

    /**
     * Computes glob resource hash.
     *
     * @returns {string}
     */
    _computeHash() {
        const hash = crypto.createHash('md5');
        for (const path of this) {
            hash.update(path + '\n');
        }

        return hash.digest().toString('hex');
    }
}
