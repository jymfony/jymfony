const AbstractDumper = Jymfony.Component.VarDumper.Dumper.AbstractDumper;
const Stub = Jymfony.Component.VarDumper.Cloner.Stub;

const os = require('os');
let $defaultColors;

/**
 * CliDumper dumps variables for command line output.
 *
 * @memberOf Jymfony.Component.VarDumper.Dumper
 */
class CliDumper extends AbstractDumper {
    __construct(output = process.stdout, flags = 0) {
        super.__construct(output, flags);

        /**
         * @type {boolean}
         *
         * @protected
         */
        this._colors = undefined;

        /**
         * @type {int}
         *
         * @protected
         */
        this._maxStringWidth = 0;

        /**
         * @type {Object.<string, string>}
         *
         * @protected
         */
        this._styles = {
            // See http://en.wikipedia.org/wiki/ANSI_escape_code#graphics
            'default': '38;5;208',
            'num': '1;38;5;38',
            'const': '1;38;5;208',
            'str': '1;38;5;113',
            'note': '38;5;38',
            'ref': '38;5;247',
            'public': '',
            'private': '',
            'meta': '38;5;170',
            'key': '38;5;113',
            'index': '38;5;38',
        };

        /**
         * @type {boolean}
         *
         * @protected
         */
        this._collapseNextHash = false;

        /**
         * @type {boolean}
         *
         * @protected
         */
        this._expandNextHash = false;

        /**
         * @type {Object.<string, *>}
         *
         * @protected
         */
        this._displayOptions = {
            fileLinkFormat: null,
        };

        /**
         * @type {boolean}
         *
         * @private
         */
        this._handlesHrefGracefully = undefined;

        if (__jymfony.Platform.isWindows() && ! this._isWindowsTrueColor()) {
            this.styles = {
                'default': '31',
                'num': '1;34',
                'const': '1;31',
                'str': '1;32',
                'note': '34',
                'ref': '1;30',
                'meta': '35',
                'key': '32',
                'index': '34',
            };
        }
    }

    /**
     * Whether the color support has been enabled.
     *
     * @returns {boolean}
     */
    get colors() {
        if (undefined === this._colors) {
            this._colors = this._supportsColors();
        }

        return this._colors;
    }

    /**
     * Enables/disables colored output.
     *
     * @param {boolean} colors
     */
    set colors(colors) {
        this._colors = !! colors;
    }

    /**
     * Sets the maximum number of characters per line for dumped strings.
     *
     * @param {int} maxStringWidth
     */
    set maxStringWidth(maxStringWidth) {
        this._maxStringWidth = ~~maxStringWidth;
    }

    /**
     * Configures styles.
     *
     * @param {Object.<string, string>} styles
     */
    set styles(styles) {
        this._styles = { ...styles };
    }

    dumpScalar(cursor, type, value) {
        this._dumpKey(cursor);

        let style = 'const';
        const attr = cursor.attr;

        if (null === value) {
            type = 'null';
        }

        switch (type) {
            case 'default':
                style = 'default';
                break;

            case 'number':
                style = 'num';
                switch (true) {
                    case Infinity === value: value = 'Infinity'; break;
                    case -Infinity === value: value = '-Infinity'; break;
                    case isNaN(value): value = 'NaN'; break;
                    default:
                        value = String(value);
                        break;
                }
                break;

            case 'null':
                value = 'null';
                break;

            case 'boolean':
                value = value ? 'true' : 'false';
                break;

            case 'undefined':
                value = 'undefined';
                break;

            case 'symbol':
                style = 'ref';
                value = value.toString();
                break;

            default:
                attr.value = attr.value || value;
                value = type;
                break;
        }

        this._line += this._style(style, value, attr);
        this._endValue(cursor);
    }

    dumpString(cursor, str, cut) {
        this._dumpKey(cursor);
        let attr = cursor.attr;

        str = String(str);
        if ('' === str) {
            this._line += '""';
            this._endValue(cursor);
        } else {
            attr = {
                length: 0 <= cut ? str.length + cut : 0,
                ...attr,
            };

            str = str.split('\n');
            if (str[1] && ! str[2] && ! str[1][0]) {
                delete str[1];
                str[0] += '\n';
            }

            const m = str.length - 1;
            let i, lineCut;
            i = lineCut = 0;

            if (m) {
                this._line += '"""';
                this._dumpLine(cursor.depth);
            } else {
                this._line += '"';
            }

            for (let s of str) {
                if (i < m) {
                    str += '\n';
                }

                const len = str.length;
                if (0 < this._maxStringWidth && this._maxStringWidth < len) {
                    s = s.substr(0, this._maxStringWidth);
                    lineCut = len - this._maxStringWidth;
                }

                if (m && 0 < cursor.depth) {
                    this._line += this._indentPad;
                }

                if ('' !== s) {
                    this._line += this._style('str', s, attr);
                }

                if (i++ === m) {
                    if (m) {
                        if ('' !== s) {
                            this._dumpLine(cursor.depth);
                            if (0 < cursor.depth) {
                                this._line += this._indentPad;
                            }
                        }

                        this._line += '"""';
                    } else {
                        this._line += '"';
                    }
                }

                if (lineCut) {
                    this._line += '…' + lineCut;
                    lineCut = 0;
                }

                if (i > m) {
                    this._endValue(cursor);
                } else {
                    this._dumpLine(cursor.depth);
                }
            }
        }
    }

    enterHash(cursor, type, class_, hasChild) {
        this._dumpKey(cursor);
        const attr = cursor.attr;

        if (this._collapseNextHash) {
            cursor.skipChildren = true;
            this._collapseNextHash = hasChild = false;
        }

        let prefix;
        if (type === Stub.TYPE_OBJECT) {
            prefix = class_ && 'Object' !== class_ ? this._style('note', class_, attr) + ' {' : '{';
        } else {
            prefix = class_ ? 'array:' + class_ + ' [' : '[';
        }

        if (cursor.softRefCount) {
            prefix += this._style('ref', '#' + cursor.softRefTo, { count: cursor.softRefCount });
        }

        this._line += prefix;

        if (hasChild) {
            this._dumpLine(cursor.depth);
        }
    }

    leaveHash(cursor, type, class_, hasChild, cut) {
        this._dumpEllipsis(cursor, hasChild, cut);
        this._line += Stub.TYPE_OBJECT === type ? '}' : ']';
        this._endValue(cursor);
    }

    /**
     * Dumps an ellipsis for cut children.
     *
     * @param {Jymfony.Component.VarDumper.Cloner.Cursor} cursor The Cursor position in the dump
     * @param {boolean} hasChild When the dump of the hash has child item
     * @param {int} cut The number of items the hash has been cut by
     *
     * @protected
     */
    _dumpEllipsis(cursor, hasChild, cut) {
        if (cut) {
            this._line += '…';
            if (0 < cut) {
                this._line += cut;
            }
            if (hasChild) {
                this._dumpLine(cursor.depth + 1);
            }
        }
    }

    _endValue(cursor) {
        if (cursor.hashType === Stub.TYPE_ARRAY) {
            if (1 < cursor.hashLength - cursor.hashIndex) {
                this._line += ',';
            }
        }

        this._dumpLine(cursor.depth, true);
    }

    _dumpLine(depth, endOfValue = false) { // eslint-disable-line no-unused-vars
        if (this.colors) {
            this._line = __jymfony.sprintf('\x1B[%sm%s\x1B[m', this._styles.default, this._line);
        }

        super._dumpLine(depth);
    }

    /**
     * Dumps a key in a hash structure.
     *
     * @param {Jymfony.Component.VarDumper.Cloner.Cursor} cursor The Cursor position in the dump
     *
     * @protected
     */
    _dumpKey(cursor) {
        let key = cursor.hashKey;
        if (undefined !== key) {
            let style = 'key';
            const attr = {};

            sw: switch (cursor.hashType) {
                default:
                case Stub.TYPE_ARRAY:
                    style = 'index';
                    if (null !== key) {
                        this._line += this._style(style, key) + ' => ';
                    }
                    break;

                case Stub.TYPE_OBJECT:
                    if (! key[0] || '\0' !== key[0]) {
                        this._line += '+' + this._style(isSymbol(key) ? 'ref' : 'public', key) + ': ';
                    } else if (0 < key.substr(1).indexOf('\0')) {
                        const [ key0, ...others ] = key.substr(1).split('\0');
                        key = [ key0, others.join('\0') ];

                        switch (key[0][0]) {
                            case '+':
                                attr.dynamic = true;
                                this._line = '+' + '"' + this._style('public', key[1], attr) + '": ';
                                break sw;

                            case '~':
                                style = 'meta';
                                if (key[0][1]) {
                                    Object.assign(attr, __jymfony.parse_query_string(key[0].substr(1)));
                                }

                                break;
                        }

                        if (undefined !== attr.collapse) {
                            if (~~attr.collapse) {
                                this._collapseNextHash = true;
                            } else {
                                this._expandNextHash = true;
                            }
                        }

                        this._line += this._style(style, key[1], attr) + (attr.separator || ': ');
                    } else {
                        this._line += '-' + '"' + this._style('private', 'key', { 'class': '' }) + '": ';
                    }
                    break;
            }
        }
    }

    /**
     * Decorates a value with some style.
     *
     * @param {string} style The type of style being applied
     * @param {string} value The value being styled
     * @param {Object.<string, string>} attr Optional context information
     *
     * @returns {string} The value with style decoration
     */
    _style(style, value, attr = {}) { // eslint-disable-line no-unused-vars
        const colors = this.colors;
        if (undefined === this._handlesHrefGracefully) {
            this._handlesHrefGracefully = 'JetBrains-JediTerm' !== process.env.TERMINAL_EMULATOR;
        }

        const href = (value) => {
            if (this.colors && this._handlesHrefGracefully) {
                const href = this._getSourceLink(attr.file, attr.line || 0);
                if (attr.file && href) {
                    if ('note' === style) {
                        value += `\x1B]8;;${href}\x1B\\^\x1B]8;;\x1B\\`;
                    } else {
                        attr.href = href;
                    }
                }

                if (attr.href) {
                    value = `\x1B]8;;${attr.href}\x1B\\${value}\x1B]8;;\x1B\\`;
                }
            }

            return value;
        };

        if (attr.ellipsis && attr['ellipsis-type']) {
            let prefix = value.substr(0, value.length - attr.ellipsis);
            if ('path' === attr['ellipsis-type'] && process.cwd().startsWith(prefix)) {
                prefix = '.' + prefix.substr(process.cwd().length);
            }

            if (attr['ellipsis-tail']) {
                prefix += value.substr(value.length - attr.ellipsis, attr['ellipsis-tail']);
                value = value.substr(value.length - attr.ellipsis + attr['ellipsis-tail']);
            } else {
                value = value.substr(value.length - attr.ellipsis);
            }

            value = this._style('default', prefix) + this._style(style, value);

            return href(value);
        }

        const map = __self._controlCharsMap;
        const startCchr = colors ? '\x1B[m\x1B[' + this._styles.default + 'm' : '';
        const endCchr = colors ? '\x1B[m\x1B[' + this._styles[style] + 'm' : '';
        const cchrCount = 0;

        value = String(value).replace(__self._controlCharsRx, (c) => {
            let s = startCchr;
            let i = 0;
            do {
                s += map[c[i]] || __jymfony.sprintf('\\x%02X', c[i]);
            } while (undefined !== c[++i]);

            return s + endCchr;
        });

        if (colors) {
            if (cchrCount && '\x1B' === value[0]) {
                value = value.substr(startCchr.length);
            } else {
                value = '\x1B[' + this._styles[style] + 'm' + value;
            }

            if (cchrCount && endCchr === value.substr(value.length - endCchr.length)) {
                value = value.substr(0, value.length - endCchr.length);
            } else {
                value += '\x1B[' + this._styles.default + 'm';
            }
        }

        return href(value);
    }

    _supportsColors() {
        if (this._outputStream !== process.stdout) {
            return this._hasColorSupport(this._outputStream);
        }

        if (undefined !== $defaultColors) {
            return $defaultColors;
        }

        if (process.argv) {
            let i = process.argv.length;
            while (0 < --i) {
                if (process.argv[i][5]) {
                    switch (process.argv[i]) {
                        case '--ansi':
                        case '--color':
                        case '--color=yes':
                        case '--color=force':
                        case '--color=always':
                            return $defaultColors = true;

                        case '--no-ansi':
                        case '--color=no':
                        case '--color=none':
                        case '--color=never':
                            return $defaultColors = false;
                    }
                }
            }
        }

        return $defaultColors = this._hasColorSupport(this._outputStream);
    }

    _hasColorSupport(outputStream) {
        if ('win32' === os.platform()) {
            return (
                !! process.env.ANSICON ||
                'ON' === process.env.ConEmuANSI ||
                'xterm' === process.env.TERM ||
                __jymfony.version_compare(os.release(), '10.0.10586', '>=')
            );
        }

        return outputStream.isTTY;
    }

    _isWindowsTrueColor() {
        let result = 183 <= process.env.ANSICON_VER
            || 'ON' === process.env.ConEmuANSI
            || 'xterm' === process.env.TERM
            || 'Hyper' === process.env.TERM_PROGRAM;

        if (! result) {
            result = __jymfony.version_compare(os.release(), '10.0.10586', '>=');
        }

        return result;
    }

    _getSourceLink(file, line) {
        const fmt = this._displayOptions.fileLinkFormat;
        if (fmt) {
            return isString(fmt) ? __jymfony.strtr(fmt, {'%f': file, '%l': line}) : (fmt.format(file, line) || 'file://'+file);
        }

        return false;
    }
}

CliDumper._controlCharsRx = /[\x00-\x1F\x7F]+/g;
CliDumper._controlCharsMap = {
    '\t': '\\t',
    '\n': '\\n',
    '\v': '\\v',
    '\f': '\\f',
    '\r': '\\r',
    '\x1B': '\\e',
    '\0': '\\0',
};

module.exports = CliDumper;
