/**
 * Prefix tree of routes preserving routes order.
 *
 * @memberOf Jymfony.Component.Routing.Dumper
 *
 * @internal
 */
export default class StaticPrefixCollection {
    /**
     * Constructor.
     *
     * @param {string} prefix
     */
    __construct(prefix = '/') {
        /**
         * @type {string}
         *
         * @private
         */
        this._prefix = prefix;

        /**
         * @type {string[]}
         *
         * @private
         */
        this._staticPrefixes = [];

        /**
         * @type {string[]}
         *
         * @private
         */
        this._prefixes = [];

        /**
         * @type {*[][]}
         *
         * @private
         */
        this._items = [];
    }

    /**
     * Gets the prefix
     *
     * @returns {string}
     */
    get prefix() {
        return this._prefix;
    }

    /**
     * Gets the routes.
     *
     * @returns {*[][]}
     */
    get routes() {
        return this._items;
    }

    /**
     * Adds a route to a group.
     *
     * @param {string} prefix
     * @param {[string, Jymfony.Component.Routing.Route]|Jymfony.Component.Routing.Dumper.StaticPrefixCollection} route
     */
    addRoute(prefix, route) {
        let staticPrefix = undefined;
        [ prefix, staticPrefix ] = this._getCommonPrefix(prefix, prefix);

        for (let i = this._items.length - 1; 0 <= i; --i) {
            const item = this._items[i];

            const [ commonPrefix, commonStaticPrefix ] = this._getCommonPrefix(prefix, this._prefixes[i]);

            if (this._prefix === commonPrefix) {
                // The new route and a previous one have no common prefix, let's see if they are exclusive to each others

                if (this._prefix !== staticPrefix && this._prefix !== this._staticPrefixes[i]) {
                    // The new route and the previous one have exclusive static prefixes
                    continue;
                }

                if (this._prefix === staticPrefix && this._prefix === this._staticPrefixes[i]) {
                    // The new route and the previous one have no static prefix
                    break;
                }

                if (this._prefixes[i] !== this._staticPrefixes[i] && this._prefix === this._staticPrefixes[i]) {
                    // The previous route is non-static and has no static prefix
                    break;
                }

                if (prefix !== staticPrefix && this._prefix === staticPrefix) {
                    // The new route is non-static and has no static prefix
                    break;
                }

                continue;
            }

            if (item instanceof StaticPrefixCollection && this._prefixes[i] === commonPrefix) {
                // The new route is a child of a previous one, let's nest it
                item.addRoute(prefix, route);
            } else {
                // The new route and a previous one have a common prefix, let's merge them
                const child = new __self(commonPrefix);
                [ child._prefixes[0], child._staticPrefixes[0] ] = child._getCommonPrefix(this._prefixes[i], this._prefixes[i]);
                [ child._prefixes[1], child._staticPrefixes[1] ] = child._getCommonPrefix(prefix, prefix);
                child._items = [ this._items[i], route ];

                this._staticPrefixes[i] = commonStaticPrefix;
                this._prefixes[i] = commonPrefix;
                this._items[i] = child;
            }

            return;
        }

        // No optimised case was found, in this case we simple add the route for possible
        // Grouping when new routes are added.
        this._staticPrefixes.push(staticPrefix);
        this._prefixes.push(prefix);
        this._items.push(route);
    }

    /**
     * Linearizes back a set of nested routes into a collection.
     *
     * @param {Jymfony.Component.Routing.RouteCollection} routes
     *
     * @returns {Jymfony.Component.Routing.RouteCollection}
     */
    populateCollection(routes) {
        for (const route of this._items) {
            if (route instanceof StaticPrefixCollection) {
                route.populateCollection(routes);
            } else {
                routes.add(...route);
            }
        }

        return routes;
    }

    /**
     * Gets the full and static common prefixes between two route patterns.
     *
     * The static prefix stops at last at the first opening bracket.
     *
     * @param {string} prefix
     * @param {string} anotherPrefix
     *
     * @returns {Array}
     */
    _getCommonPrefix(prefix, anotherPrefix) {
        const baseLength = this._prefix.length;
        const end = Math.min(prefix.length, anotherPrefix.length);
        let staticLength = null, i = baseLength;

        begin: for (; i < end && prefix[i] === anotherPrefix[i]; ++i) {
            if ('(' === prefix[i]) {
                staticLength = null !== staticLength ? staticLength : i;
                let n, j;
                for (j = 1 + i, n = 1; j < end && 0 < n; ++j) {
                    if (prefix[j] !== anotherPrefix[j]) {
                        break begin;
                    }

                    if ('(' === prefix[j]) {
                        ++n;
                    } else if (')' === prefix[j]) {
                        --n;
                    } else if ('\\' === prefix[j] && (++j === end || prefix[j] !== anotherPrefix[j])) {
                        --j;
                        break;
                    }
                }

                if (0 < n) {
                    break;
                }

                if (('?' === (prefix[j] || '') || '?' === (anotherPrefix[j] || '')) && (prefix[j] || '') !== (anotherPrefix[j] || '')) {
                    break;
                }

                i = j - 1;
            } else if ('\\' === prefix[i] && (++i === end || prefix[i] !== anotherPrefix[i])) {
                --i;
                break;
            }
        }

        return [ prefix.substr(0, i), prefix.substr(0, staticLength || i) ];
    }
}
