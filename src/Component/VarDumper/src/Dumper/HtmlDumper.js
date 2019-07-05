const Stub = Jymfony.Component.VarDumper.Cloner.Stub;
const AbstractDumper = Jymfony.Component.VarDumper.Dumper.AbstractDumper;
const CliDumper = Jymfony.Component.VarDumper.Dumper.CliDumper;

const esc = (str) => __jymfony.htmlentities(str);

/**
 * HtmlDumper dumps variables as HTML.
 *
 * @memberOf Jymfony.Component.VarDumper.Dumper
 */
class HtmlDumper extends CliDumper {
    /**
     * {@inheritdoc}
     */
    __construct(output = null, flags = 0) {
        /**
         * @type {string}
         *
         * @protected
         */
        this._dumpHeader = undefined;

        /**
         * @type {string}
         *
         * @protected
         */
        this._dumpPrefix = '<pre class=jf-dump id=%s data-indent-pad="%s">';

        /**
         * @type {string}
         *
         * @protected
         */
        this._dumpSuffix = '</pre><script>Jfdump(%s)</script>';

        /**
         * @type {string}
         *
         * @protected
         */
        this._dumpId = 'jf-dump-' + ~~(Math.random() * 1000000);

        /**
         * @type {boolean}
         *
         * @protected
         */
        this._headerIsDumped = false;

        /**
         * @type {number}
         *
         * @protected
         */
        this._lastDepth = -1;

        /**
         * @type {Object.<string, string>}
         *
         * @protected
         */
        this._styles = {};
        this.theme = 'dark';

        /**
         * @type {Object.<string, *>}
         *
         * @private
         */
        this._displayOptions = {
            'maxDepth': 1,
            'maxStringLength': 160,
            'fileLinkFormat': null,
        };

        /**
         * @type {Object.<string, *>}
         *
         * @private
         */
        this._extraDisplayOptions = {};

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

        AbstractDumper.prototype.__construct.call(this, output, flags);
    }

    set styles(styles) {
        this._headerIsDumped = false;
        this._styles = { ...this._styles, ...styles };
    }

    set theme(themeName) {
        const r = new ReflectionClass(this);
        if (undefined === r.constants.themes[themeName]) {
            throw new InvalidArgumentException(__jymfony.sprintf('Theme "%s" does not exist in class "%s".', themeName, ReflectionClass.getClassName(this)));
        }

        this.styles = r.constants.themes[themeName];
    }

    /**
     * Configures display options.
     *
     * @param {Object.<string, *>} displayOptions A map of display options to customize the behavior
     */
    set displayOptions(displayOptions) {
        this._headerIsDumped = false;
        this._displayOptions = { ...this._displayOptions, ...displayOptions };
    }

    /**
     * Sets an HTML header that will be dumped once in the output stream.
     *
     * @param {string} header An HTML string
     */
    set dumpHeader(header) {
        this._dumpHeader = header;
    }

    /**
     * Sets an HTML prefix and suffix that will encapse every single dump.
     *
     * @param {string} prefix The prepended HTML string
     * @param {string} suffix The appended HTML string
     */
    setDumpBoundaries(prefix, suffix) {
        this._dumpPrefix = prefix;
        this._dumpSuffix = suffix;
    }

    /**
     * {@inheritdoc}
     */
    dump(data, output = null, extraDisplayOptions = {}) {
        this._extraDisplayOptions = extraDisplayOptions;
        const result = super.dump(data, output);
        this._dumpId = 'jf-dump-' + ~~(Math.random() * 1000000);

        return result;
    }

    /**
     * Dumps the HTML header.
     *
     * @protected
     */
    _getDumpHeader() {
        this._headerIsDumped = undefined !== this._outputStream ? this._outputStream : this._lineDumper;

        if (undefined !== this._dumpHeader) {
            return this._dumpHeader;
        }

        let line = `
<script>
Jfdump = window.Jfdump || (function (doc) {

var refStyle = doc.createElement('style'),
    rxEsc = /([.*+?^\\\${}()|\\[\\]\/\\\\])/g,
    idRx = /\\bjf-dump-\\d+-ref[012]\\w+\\b/,
    keyHint = 0 <= navigator.platform.toUpperCase().indexOf('MAC') ? 'Cmd' : 'Ctrl',
    addEventListener = function (e, n, cb) {
        e.addEventListener(n, cb, false);
    };

(doc.documentElement.firstElementChild || doc.documentElement.children[0]).appendChild(refStyle);

if (!doc.addEventListener) {
    addEventListener = function (element, eventName, callback) {
        element.attachEvent('on' + eventName, function (e) {
            e.preventDefault = function () {e.returnValue = false;};
            e.target = e.srcElement;
            callback(e);
        });
    };
}

function toggle(a, recursive) {
    var s = a.nextSibling || {}, oldClass = s.className, arrow, newClass;

    if (/\\bjf-dump-compact\\b/.test(oldClass)) {
        arrow = '▼';
        newClass = 'jf-dump-expanded';
    } else if (/\\bjf-dump-expanded\\b/.test(oldClass)) {
        arrow = '▶';
        newClass = 'jf-dump-compact';
    } else {
        return false;
    }

    if (doc.createEvent && s.dispatchEvent) {
        var event = doc.createEvent('Event');
        event.initEvent('jf-dump-expanded' === newClass ? 'sfbeforedumpexpand' : 'sfbeforedumpcollapse', true, false);

        s.dispatchEvent(event);
    }

    a.lastChild.innerHTML = arrow;
    s.className = s.className.replace(/\\bjf-dump-(compact|expanded)\\b/, newClass);

    if (recursive) {
        try {
            a = s.querySelectorAll('.'+oldClass);
            for (s = 0; s < a.length; ++s) {
                if (-1 == a[s].className.indexOf(newClass)) {
                    a[s].className = newClass;
                    a[s].previousSibling.lastChild.innerHTML = arrow;
                }
            }
        } catch (e) {
        }
    }

    return true;
};

function collapse(a, recursive) {
    var s = a.nextSibling || {}, oldClass = s.className;

    if (/\\bjf-dump-expanded\\b/.test(oldClass)) {
        toggle(a, recursive);

        return true;
    }

    return false;
};

function expand(a, recursive) {
    var s = a.nextSibling || {}, oldClass = s.className;

    if (/\\bjf-dump-compact\\b/.test(oldClass)) {
        toggle(a, recursive);

        return true;
    }

    return false;
};

function collapseAll(root) {
    var a = root.querySelector('a.jf-dump-toggle');
    if (a) {
        collapse(a, true);
        expand(a);

        return true;
    }

    return false;
}

function reveal(node) {
    var previous, parents = [];

    while ((node = node.parentNode || {}) && (previous = node.previousSibling) && 'A' === previous.tagName) {
        parents.push(previous);
    }

    if (0 !== parents.length) {
        parents.forEach(function (parent) {
            expand(parent);
        });

        return true;
    }

    return false;
}

function highlight(root, activeNode, nodes) {
    resetHighlightedNodes(root);

    Array.from(nodes||[]).forEach(function (node) {
        if (!/\\bjf-dump-highlight\\b/.test(node.className)) {
            node.className = node.className + ' jf-dump-highlight';
        }
    });

    if (!/\\bjf-dump-highlight-active\\b/.test(activeNode.className)) {
        activeNode.className = activeNode.className + ' jf-dump-highlight-active';
    }
}

function resetHighlightedNodes(root) {
    Array.from(root.querySelectorAll('.jf-dump-str, .jf-dump-key, .jf-dump-public, .jf-dump-private')).forEach(function (strNode) {
        strNode.className = strNode.className.replace(/\\bjf-dump-highlight\\b/, '');
        strNode.className = strNode.className.replace(/\\bjf-dump-highlight-active\\b/, '');
    });
}

return function (root, x) {
    root = doc.getElementById(root);

    var indentRx = new RegExp('^('+(root.getAttribute('data-indent-pad') || '  ').replace(rxEsc, '\\\\$1')+')+', 'm'),
        options = ${JSON.stringify(this._displayOptions)},
        elt = root.getElementsByTagName('A'),
        len = elt.length,
        i = 0, s, h,
        t = [];

    while (i < len) t.push(elt[i++]);

    for (i in x) {
        options[i] = x[i];
    }

    function a(e, f) {
        addEventListener(root, e, function (e, n) {
            if ('A' == e.target.tagName) {
                f(e.target, e);
            } else if ('A' == e.target.parentNode.tagName) {
                f(e.target.parentNode, e);
            } else if ((n = e.target.nextElementSibling) && 'A' == n.tagName) {
                if (!/\\bjf-dump-toggle\\b/.test(n.className)) {
                    n = n.nextElementSibling;
                }

                f(n, e, true);
            }
        });
    };
    function isCtrlKey(e) {
        return e.ctrlKey || e.metaKey;
    }
    function xpathString(str) {
        var parts = str.match(/[^'"]+|['"]/g).map(function (part) {
            if ("'" == part)  {
                return '"\\'"';
            }
            if ('"' == part) {
                return "'\\"'";
            }

            return "'" + part + "'";
        });

        return "concat(" + parts.join(",") + ", '')";
    }
    function xpathHasClass(className) {
        return "contains(concat(' ', normalize-space(@class), ' '), ' " + className +" ')";
    }
    addEventListener(root, 'mouseover', function (e) {
        if ('' != refStyle.innerHTML) {
            refStyle.innerHTML = '';
        }
    });
    a('mouseover', function (a, e, c) {
        if (c) {
            e.target.style.cursor = "pointer";
        } else if (a = idRx.exec(a.className)) {
            try {
                refStyle.innerHTML = 'pre.jf-dump .'+a[0]+'{background-color: #B729D9; color: #FFF !important; border-radius: 2px}';
            } catch (e) {
            }
        }
    });
    a('click', function (a, e, c) {
        if (/\\bjf-dump-toggle\\b/.test(a.className)) {
            e.preventDefault();
            if (!toggle(a, isCtrlKey(e))) {
                var r = doc.getElementById(a.getAttribute('href').substr(1)),
                    s = r.previousSibling,
                    f = r.parentNode,
                    t = a.parentNode;
                t.replaceChild(r, a);
                f.replaceChild(a, s);
                t.insertBefore(s, r);
                f = f.firstChild.nodeValue.match(indentRx);
                t = t.firstChild.nodeValue.match(indentRx);
                if (f && t && f[0] !== t[0]) {
                    r.innerHTML = r.innerHTML.replace(new RegExp('^'+f[0].replace(rxEsc, '\\\\$1'), 'mg'), t[0]);
                }
                if (/\\bjf-dump-compact\\b/.test(r.className)) {
                    toggle(s, isCtrlKey(e));
                }
            }

            if (c) {
            } else if (doc.getSelection) {
                try {
                    doc.getSelection().removeAllRanges();
                } catch (e) {
                    doc.getSelection().empty();
                }
            } else {
                doc.selection.empty();
            }
        } else if (/\\bjf-dump-str-toggle\\b/.test(a.className)) {
            e.preventDefault();
            e = a.parentNode.parentNode;
            e.className = e.className.replace(/\\bjf-dump-str-(expand|collapse)\\b/, a.parentNode.className);
        }
    });

    elt = root.getElementsByTagName('SAMP');
    len = elt.length;
    i = 0;

    while (i < len) t.push(elt[i++]);
    len = t.length;

    for (i = 0; i < len; ++i) {
        elt = t[i];
        if ('SAMP' == elt.tagName) {
            a = elt.previousSibling || {};
            if ('A' != a.tagName) {
                a = doc.createElement('A');
                a.className = 'jf-dump-ref';
                elt.parentNode.insertBefore(a, elt);
            } else {
                a.innerHTML += ' ';
            }
            a.title = (a.title ? a.title+'\\n[' : '[')+keyHint+'+click] Expand all children';
            a.innerHTML += '<span>▼</span>';
            a.className += ' jf-dump-toggle';

            x = 1;
            if ('jf-dump' != elt.parentNode.className) {
                x += elt.parentNode.getAttribute('data-depth')/1;
            }
            elt.setAttribute('data-depth', x);
            var className = elt.className;
            elt.className = 'jf-dump-expanded';
            if (className ? 'jf-dump-expanded' !== className : (x > options.maxDepth)) {
                toggle(a);
            }
        } else if (/\\bjf-dump-ref\\b/.test(elt.className) && (a = elt.getAttribute('href'))) {
            a = a.substr(1);
            elt.className += ' '+a;

            if (/[\\[{]$/.test(elt.previousSibling.nodeValue)) {
                a = a != elt.nextSibling.id && doc.getElementById(a);
                try {
                    s = a.nextSibling;
                    elt.appendChild(a);
                    s.parentNode.insertBefore(a, s);
                    if (/^[@#]/.test(elt.innerHTML)) {
                        elt.innerHTML += ' <span>▶</span>';
                    } else {
                        elt.innerHTML = '<span>▶</span>';
                        elt.className = 'jf-dump-ref';
                    }
                    elt.className += ' jf-dump-toggle';
                } catch (e) {
                    if ('&' == elt.innerHTML.charAt(0)) {
                        elt.innerHTML = '…';
                        elt.className = 'jf-dump-ref';
                    }
                }
            }
        }
    }

    if (doc.evaluate && Array.from && root.children.length > 1) {
        root.setAttribute('tabindex', 0);

        SearchState = function () {
            this.nodes = [];
            this.idx = 0;
        };
        SearchState.prototype = {
            next: function () {
                if (this.isEmpty()) {
                    return this.current();
                }
                this.idx = this.idx < (this.nodes.length - 1) ? this.idx + 1 : 0;

                return this.current();
            },
            previous: function () {
                if (this.isEmpty()) {
                    return this.current();
                }
                this.idx = this.idx > 0 ? this.idx - 1 : (this.nodes.length - 1);

                return this.current();
            },
            isEmpty: function () {
                return 0 === this.count();
            },
            current: function () {
                if (this.isEmpty()) {
                    return null;
                }
                return this.nodes[this.idx];
            },
            reset: function () {
                this.nodes = [];
                this.idx = 0;
            },
            count: function () {
                return this.nodes.length;
            },
        };

        function showCurrent(state)
        {
            var currentNode = state.current(), currentRect, searchRect;
            if (currentNode) {
                reveal(currentNode);
                highlight(root, currentNode, state.nodes);
                if ('scrollIntoView' in currentNode) {
                    currentNode.scrollIntoView(true);
                    currentRect = currentNode.getBoundingClientRect();
                    searchRect = search.getBoundingClientRect();
                    if (currentRect.top < (searchRect.top + searchRect.height)) {
                        window.scrollBy(0, -(searchRect.top + searchRect.height + 5));
                    }
                }
            }
            counter.textContent = (state.isEmpty() ? 0 : state.idx + 1) + ' of ' + state.count();
        }

        var search = doc.createElement('div');
        search.className = 'jf-dump-search-wrapper jf-dump-search-hidden';
        search.innerHTML = '
            <input type="text" class="jf-dump-search-input">
            <span class="jf-dump-search-count">0 of 0<\/span>
            <button type="button" class="jf-dump-search-input-previous" tabindex="-1">
                <svg viewBox="0 0 1792 1792" xmlns="http://www.w3.org/2000/svg"><path d="M1683 1331l-166 165q-19 19-45 19t-45-19L896 965l-531 531q-19 19-45 19t-45-19l-166-165q-19-19-19-45.5t19-45.5l742-741q19-19 45-19t45 19l742 741q19 19 19 45.5t-19 45.5z"\/><\/svg>
            <\/button>
            <button type="button" class="jf-dump-search-input-next" tabindex="-1">
                <svg viewBox="0 0 1792 1792" xmlns="http://www.w3.org/2000/svg"><path d="M1683 808l-742 741q-19 19-45 19t-45-19L109 808q-19-19-19-45.5t19-45.5l166-165q19-19 45-19t45 19l531 531 531-531q19-19 45-19t45 19l166 165q19 19 19 45.5t-19 45.5z"\/><\/svg>
            <\/button>
        ';
        root.insertBefore(search, root.firstChild);

        var state = new SearchState();
        var searchInput = search.querySelector('.jf-dump-search-input');
        var counter = search.querySelector('.jf-dump-search-count');
        var searchInputTimer = 0;
        var previousSearchQuery = '';

        addEventListener(searchInput, 'keyup', function (e) {
            var searchQuery = e.target.value;
            /* Don't perform anything if the pressed key didn't change the query */
            if (searchQuery === previousSearchQuery) {
                return;
            }
            previousSearchQuery = searchQuery;
            clearTimeout(searchInputTimer);
            searchInputTimer = setTimeout(function () {
                state.reset();
                collapseAll(root);
                resetHighlightedNodes(root);
                if ('' === searchQuery) {
                    counter.textContent = '0 of 0';

                    return;
                }

                var classMatches = [
                    "jf-dump-str",
                    "jf-dump-key",
                    "jf-dump-public",
                    "jf-dump-protected",
                    "jf-dump-private",
                ].map(xpathHasClass).join(' or ');

                var xpathResult = doc.evaluate('.//span[' + classMatches + '][contains(translate(child::text(), ' + xpathString(searchQuery.toUpperCase()) + ', ' + xpathString(searchQuery.toLowerCase()) + '), ' + xpathString(searchQuery.toLowerCase()) + ')]', root, null, XPathResult.ORDERED_NODE_ITERATOR_TYPE, null);

                while (node = xpathResult.iterateNext()) state.nodes.push(node);

                showCurrent(state);
            }, 400);
        });

        Array.from(search.querySelectorAll('.jf-dump-search-input-next, .jf-dump-search-input-previous')).forEach(function (btn) {
            addEventListener(btn, 'click', function (e) {
                e.preventDefault();
                -1 !== e.target.className.indexOf('next') ? state.next() : state.previous();
                searchInput.focus();
                collapseAll(root);
                showCurrent(state);
            })
        });

        addEventListener(root, 'keydown', function (e) {
            var isSearchActive = !/\\bjf-dump-search-hidden\\b/.test(search.className);
            if ((114 === e.keyCode && !isSearchActive) || (isCtrlKey(e) && 70 === e.keyCode)) {
                /* F3 or CMD/CTRL + F */
                e.preventDefault();
                search.className = search.className.replace(/\\bjf-dump-search-hidden\\b/, '');
                searchInput.focus();
            } else if (isSearchActive) {
                if (27 === e.keyCode) {
                    /* ESC key */
                    search.className += ' jf-dump-search-hidden';
                    e.preventDefault();
                    resetHighlightedNodes(root);
                    searchInput.value = '';
                } else if (
                    (isCtrlKey(e) && 71 === e.keyCode) /* CMD/CTRL + G */
                    || 13 === e.keyCode /* Enter */
                    || 114 === e.keyCode /* F3 */
                ) {
                    e.preventDefault();
                    e.shiftKey ? state.previous() : state.next();
                    collapseAll(root);
                    showCurrent(state);
                }
            }
        });
    }

    if (0 >= options.maxStringLength) {
        return;
    }
    try {
        elt = root.querySelectorAll('.jf-dump-str');
        len = elt.length;
        i = 0;
        t = [];

        while (i < len) t.push(elt[i++]);
        len = t.length;

        for (i = 0; i < len; ++i) {
            elt = t[i];
            s = elt.innerText || elt.textContent;
            x = s.length - options.maxStringLength;
            if (0 < x) {
                h = elt.innerHTML;
                elt[elt.innerText ? 'innerText' : 'textContent'] = s.substring(0, options.maxStringLength);
                elt.className += ' jf-dump-str-collapse';
                elt.innerHTML = '<span class=jf-dump-str-collapse>'+h+'<a class="jf-dump-ref jf-dump-str-toggle" title="Collapse"> ◀</a></span>'+
                    '<span class=jf-dump-str-expand>'+elt.innerHTML+'<a class="jf-dump-ref jf-dump-str-toggle" title="'+x+' remaining characters"> ▶</a></span>';
            }
        }
    } catch (e) {
    }
};

})(document);
</script><style>
pre.jf-dump {
    display: block;
    white-space: pre;
    padding: 5px;
    overflow: initial !important;
}
pre.jf-dump:after {
   content: "";
   visibility: hidden;
   display: block;
   height: 0;
   clear: both;
}
pre.jf-dump span {
    display: inline;
}
pre.jf-dump .jf-dump-compact {
    display: none;
}
pre.jf-dump abbr {
    text-decoration: none;
    border: none;
    cursor: help;
}
pre.jf-dump a {
    text-decoration: none;
    cursor: pointer;
    border: 0;
    outline: none;
    color: inherit;
}
pre.jf-dump .jf-dump-ellipsis {
    display: inline-block;
    overflow: visible;
    text-overflow: ellipsis;
    max-width: 5em;
    white-space: nowrap;
    overflow: hidden;
    vertical-align: top;
}
pre.jf-dump .jf-dump-ellipsis+.jf-dump-ellipsis {
    max-width: none;
}
pre.jf-dump code {
    display:inline;
    padding:0;
    background:none;
}
.jf-dump-str-collapse .jf-dump-str-collapse {
    display: none;
}
.jf-dump-str-expand .jf-dump-str-expand {
    display: none;
}
.jf-dump-public.jf-dump-highlight,
.jf-dump-private.jf-dump-highlight,
.jf-dump-str.jf-dump-highlight,
.jf-dump-key.jf-dump-highlight {
    background: rgba(111, 172, 204, 0.3);
    border: 1px solid #7DA0B1;
    border-radius: 3px;
}
.jf-dump-public.jf-dump-highlight-active,
.jf-dump-private.jf-dump-highlight-active,
.jf-dump-str.jf-dump-highlight-active,
.jf-dump-key.jf-dump-highlight-active {
    background: rgba(253, 175, 0, 0.4);
    border: 1px solid #ffa500;
    border-radius: 3px;
}
pre.jf-dump .jf-dump-search-hidden {
    display: none !important;
}
pre.jf-dump .jf-dump-search-wrapper {
    font-size: 0;
    white-space: nowrap;
    margin-bottom: 5px;
    display: flex;
    position: -webkit-sticky;
    position: sticky;
    top: 5px;
}
pre.jf-dump .jf-dump-search-wrapper > * {
    vertical-align: top;
    box-sizing: border-box;
    height: 21px;
    font-weight: normal;
    border-radius: 0;
    background: #FFF;
    color: #757575;
    border: 1px solid #BBB;
}
pre.jf-dump .jf-dump-search-wrapper > input.jf-dump-search-input {
    padding: 3px;
    height: 21px;
    font-size: 12px;
    border-right: none;
    border-top-left-radius: 3px;
    border-bottom-left-radius: 3px;
    color: #000;
    min-width: 15px;
    width: 100%;
}
pre.jf-dump .jf-dump-search-wrapper > .jf-dump-search-input-next,
pre.jf-dump .jf-dump-search-wrapper > .jf-dump-search-input-previous {
    background: #F2F2F2;
    outline: none;
    border-left: none;
    font-size: 0;
    line-height: 0;
}
pre.jf-dump .jf-dump-search-wrapper > .jf-dump-search-input-next {
    border-top-right-radius: 3px;
    border-bottom-right-radius: 3px;
}
pre.jf-dump .jf-dump-search-wrapper > .jf-dump-search-input-next > svg,
pre.jf-dump .jf-dump-search-wrapper > .jf-dump-search-input-previous > svg {
    pointer-events: none;
    width: 12px;
    height: 12px;
}
pre.jf-dump .jf-dump-search-wrapper > .jf-dump-search-count {
    display: inline-block;
    padding: 0 5px;
    margin: 0;
    border-left: none;
    line-height: 21px;
    font-size: 12px;
}
`;

        for (const [ class_, style ] of __jymfony.getEntries(this._styles)) {
            line += 'pre.jf-dump' + ('default' === class_ ? ', pre.jf-dump' : '') + ' .jf-dump-' + class_ + '{' + style + '}';
        }

        return this._dumpHeader = line.replace(/\s+/g, ' ') + '</style>' + (this._dumpHeader || '');
    }

    /**
     * {@inheritdoc}
     */
    enterHash(cursor, type, class_, hasChild) {
        super.enterHash(cursor, type, class_, false);

        let eol;
        if (cursor.skipChildren) {
            cursor.skipChildren = false;
            eol = ' class=jf-dump-compact>';
        } else if (this._expandNextHash) {
            this._expandNextHash = false;
            eol = ' class=jf-dump-expanded>';
        } else {
            eol = '>';
        }

        if (hasChild) {
            this._line += '<samp';
            if (cursor.refIndex) {
                let r = Stub.TYPE_OBJECT !== type ? '0' : '2';
                r += String(cursor.refIndex);

                this._line += __jymfony.sprintf(' id=%s-ref%s', this._dumpId, r);
            }

            this._line += eol;
            this._dumpLine(cursor.depth);
        }
    }

    /**
     * {@inheritdoc}
     */
    leaveHash(cursor, type, class_, hasChild, cut) {
        this._dumpEllipsis(cursor, hasChild, cut);
        if (hasChild) {
            this._line += '</samp>';
        }

        super.leaveHash(cursor, type, class_, hasChild, 0);
    }

    /**
     * {@inheritdoc}
     */
    _style(style, value, attr = []) {
        if ('' === value) {
            return '';
        }

        let v = esc(value);

        if ('ref' === style) {
            if (0 === ~~attr.count) {
                return __jymfony.sprintf('<a class=jf-dump-ref>%s</a>', v);
            }
            const r = String('#' !== v[0] ? 1 - ('@' !== v[0]) : 2) + value.substr(1);

            return __jymfony.sprintf('<a class=jf-dump-ref href=#%s-ref%s title="%d occurrences">%s</a>', this._dumpId, r, 1 + attr.count, v);
        }

        if ('const' === style && !! attr.value) {
            style += __jymfony.sprintf(' title="%s"', esc(isScalar(attr.value) ? attr.value : JSON.stringify(attr.value)));
        } else if ('public' === style) {
            style += __jymfony.sprintf(' title="%s"', ! attr.dynamic ? 'Public property' : 'Runtime added dynamic property');
        } else if ('str' === style && 1 < attr.length) {
            style += __jymfony.sprintf(' title="%d characters"', attr.length);
        } else if ('note' === style && -1 !== v.indexOf('\\')) {
            let link = !! attr.file ? this._getSourceLink(attr.file, attr.line || 0) : false;
            if (link) {
                link = __jymfony.sprintf('<a href="%s" rel="noopener noreferrer">^</a>', esc(link));
            } else {
                link = '';
            }

            const c = v.lastIndexOf('\\');
            return __jymfony.sprintf('<abbr title="%s" class=jf-dump-%s>%s</abbr>%s', v, style, v.substr(c + 1), link);
        } else if ('meta' === style && attr.title) {
            style += __jymfony.sprintf(' title="%s"', esc(attr.title));
        } else if ('private' === style) {
            style += __jymfony.sprintf(' title="Private property defined in class:&#10;`%s`"', esc(attr['class']));
        }
        const map = __self._controlCharsMap;

        if (attr.ellipsis) {
            let class_ = 'jf-dump-ellipsis';
            if (attr['ellipsis-type']) {
                class_ = __jymfony.sprintf('"%s jf-dump-ellipsis-%s"', class_, attr['ellipsis-type']);
            }

            const label = esc(value.substr(value.length - attr.ellipsis));
            style = style.replace(/ title="/g, ' title="' + v + '\n', style);
            v = __jymfony.sprintf('<span class=%s>%s</span>', class_, v.substr(0, v.length - label.length));

            if (!! attr['ellipsis-tail']) {
                const tail = esc(value.substr(value.length - attr.ellipsis, attr['ellipsis-tail'])).length;
                v += __jymfony.sprintf('<span class=jf-dump-ellipsis>%s</span>%s', label.substr(0, tail), label.substr(tail));
            } else {
                v += label;
            }
        }

        v = '<span class=jf-dump-'+style+'>' + v.replace(__self._controlCharsRx, (c) => {
            let i, b, s = b = '<span class="jf-dump-default';
            c = c[i = 0];

            let ns;
            if ((ns = '\r' === c[i] || '\n' === c[i])) {
                s += ' jf-dump-ns';
            }

            s += '">';
            do {
                if (('\r' === c[i] || '\n' === c[i]) !== ns) {
                    s += '</span>' + b;
                    if ((ns = ! ns)) {
                        s += ' jf-dump-ns';
                    }
                    s += '">';
                }

                s += map[c[i]] || __jymfony.sprintf('\\x%02X', c.charCodeAt(i));
            } while (!! c[++i]);

            return s + '</span>';
        }) + '</span>';

        let href;
        if (!! attr.file && (href = this._getSourceLink(attr.file, attr['line'] || 0))) {
            attr.href = href;
        }

        if (attr.href) {
            const target = attr.file ? '' : ' target="_blank"';
            v = __jymfony.sprintf('<a href="%s"%s rel="noopener noreferrer">%s</a>', esc(attr.href), target, v);
        }

        if (attr.lang) {
            v = __jymfony.sprintf('<code class="%s">%s</code>', esc(attr.lang), v);
        }

        return v;
    }

    /**
     * {@inheritdoc}
     */
    _dumpLine(depth, endOfValue = false) { // eslint-disable-line no-unused-vars
        if (-1 === this._lastDepth) {
            this._line = __jymfony.sprintf(this._dumpPrefix, this._dumpId, this._indentPad) + this._line;
        }

        if (this._headerIsDumped !== (this._outputStream || this._lineDumper)) {
            this._line = this._getDumpHeader() + this._line;
        }

        if (-1 === depth) {
            const args = [ '"' + this._dumpId + '"' ];
            if (this._extraDisplayOptions) {
                args.push(JSON.stringify(this._extraDisplayOptions));
            }

            // Replace is for BC
            this._line += __jymfony.sprintf(this._dumpSuffix, args.join(', '));
        }

        this._lastDepth = depth;

        if (-1 === depth) {
            AbstractDumper.prototype._dumpLine.call(this, 0);
        }

        AbstractDumper.prototype._dumpLine.call(this, depth);
    }

    _getSourceLink(file, line) {
        const options = { ...this._displayOptions, ...this._extraDisplayOptions };
        const fmt = options.fileLinkFormat;

        if (!! fmt) {
            return isString(fmt) ? __jymfony.strtr(fmt, {'%f': file, '%l': line}) : fmt.format(file, line);
        }

        return false;
    }
}

HtmlDumper.themes = {
    'dark': {
        'default': 'background-color:#18171B; color:#FF8400; line-height:1.2em; font:12px Menlo, Monaco, Consolas, monospace; word-wrap: break-word; white-space: pre-wrap; position:relative; z-index:99999; word-break: break-all',
        'num': 'font-weight:bold; color:#1299DA',
        'const': 'font-weight:bold',
        'str': 'font-weight:bold; color:#56DB3A',
        'note': 'color:#1299DA',
        'ref': 'color:#A0A0A0',
        'public': 'color:#FFFFFF',
        'protected': 'color:#FFFFFF',
        'private': 'color:#FFFFFF',
        'meta': 'color:#B729D9',
        'key': 'color:#56DB3A',
        'index': 'color:#1299DA',
        'ellipsis': 'color:#FF8400',
        'ns': 'user-select:none;',
    },
    'light': {
        'default': 'background:none; color:#CC7832; line-height:1.2em; font:12px Menlo, Monaco, Consolas, monospace; word-wrap: break-word; white-space: pre-wrap; position:relative; z-index:99999; word-break: break-all',
        'num': 'font-weight:bold; color:#1299DA',
        'const': 'font-weight:bold',
        'str': 'font-weight:bold; color:#629755;',
        'note': 'color:#6897BB',
        'ref': 'color:#6E6E6E',
        'public': 'color:#262626',
        'protected': 'color:#262626',
        'private': 'color:#262626',
        'meta': 'color:#B729D9',
        'key': 'color:#789339',
        'index': 'color:#1299DA',
        'ellipsis': 'color:#CC7832',
        'ns': 'user-select:none;',
    },
};

module.exports = HtmlDumper;
