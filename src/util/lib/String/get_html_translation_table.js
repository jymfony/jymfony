const memo = {};

const get_html_translation_table = (table = 'HTML_SPECIALCHARS', quoteStyle = 'ENT_COMPAT') => { // eslint-disable-line camelcase
    //  Discuss at: http://locutus.io/php/get_html_translation_table/
    // Original by: Philip Peterson
    //  Revised by: Kevin van Zonneveld (http://kvz.io)
    // Bugfixed by: noname
    // Bugfixed by: Alex
    // Bugfixed by: Marco
    // Bugfixed by: madipta
    // Bugfixed by: Brett Zamir (http://brett-zamir.me)
    // Bugfixed by: T.Wild
    // Improved by: KELAN
    // Improved by: Brett Zamir (http://brett-zamir.me)
    //    Input by: Frank Forte
    //    Input by: Ratheous
    //   Example 1: get_html_translation_table('HTML_SPECIALCHARS')
    //   Returns 1: {'"': '&quot;', '&': '&amp;', '<': '&lt;', '>': '&gt;'}

    const cacheKey = table + '_' + quoteStyle;
    if (memo[cacheKey]) {
        return { ...memo[cacheKey] };
    }

    const hashMap = new HashTable();

    if ('HTML_SPECIALCHARS' !== table && 'HTML_ENTITIES' !== table) {
        throw new Error('Table: ' + table + ' not supported');
    }

    hashMap.put(String.fromCharCode(38), '&amp;');
    if ('HTML_ENTITIES' === table) {
        hashMap.put(String.fromCharCode(160), '&nbsp;');
        hashMap.put(String.fromCharCode(161), '&iexcl;');
        hashMap.put(String.fromCharCode(162), '&cent;');
        hashMap.put(String.fromCharCode(163), '&pound;');
        hashMap.put(String.fromCharCode(164), '&curren;');
        hashMap.put(String.fromCharCode(165), '&yen;');
        hashMap.put(String.fromCharCode(166), '&brvbar;');
        hashMap.put(String.fromCharCode(167), '&sect;');
        hashMap.put(String.fromCharCode(168), '&uml;');
        hashMap.put(String.fromCharCode(169), '&copy;');
        hashMap.put(String.fromCharCode(170), '&ordf;');
        hashMap.put(String.fromCharCode(171), '&laquo;');
        hashMap.put(String.fromCharCode(172), '&not;');
        hashMap.put(String.fromCharCode(173), '&shy;');
        hashMap.put(String.fromCharCode(174), '&reg;');
        hashMap.put(String.fromCharCode(175), '&macr;');
        hashMap.put(String.fromCharCode(176), '&deg;');
        hashMap.put(String.fromCharCode(177), '&plusmn;');
        hashMap.put(String.fromCharCode(178), '&sup2;');
        hashMap.put(String.fromCharCode(179), '&sup3;');
        hashMap.put(String.fromCharCode(180), '&acute;');
        hashMap.put(String.fromCharCode(181), '&micro;');
        hashMap.put(String.fromCharCode(182), '&para;');
        hashMap.put(String.fromCharCode(183), '&middot;');
        hashMap.put(String.fromCharCode(184), '&cedil;');
        hashMap.put(String.fromCharCode(185), '&sup1;');
        hashMap.put(String.fromCharCode(186), '&ordm;');
        hashMap.put(String.fromCharCode(187), '&raquo;');
        hashMap.put(String.fromCharCode(188), '&frac14;');
        hashMap.put(String.fromCharCode(189), '&frac12;');
        hashMap.put(String.fromCharCode(190), '&frac34;');
        hashMap.put(String.fromCharCode(191), '&iquest;');
        hashMap.put(String.fromCharCode(192), '&Agrave;');
        hashMap.put(String.fromCharCode(193), '&Aacute;');
        hashMap.put(String.fromCharCode(194), '&Acirc;');
        hashMap.put(String.fromCharCode(195), '&Atilde;');
        hashMap.put(String.fromCharCode(196), '&Auml;');
        hashMap.put(String.fromCharCode(197), '&Aring;');
        hashMap.put(String.fromCharCode(198), '&AElig;');
        hashMap.put(String.fromCharCode(199), '&Ccedil;');
        hashMap.put(String.fromCharCode(200), '&Egrave;');
        hashMap.put(String.fromCharCode(201), '&Eacute;');
        hashMap.put(String.fromCharCode(202), '&Ecirc;');
        hashMap.put(String.fromCharCode(203), '&Euml;');
        hashMap.put(String.fromCharCode(204), '&Igrave;');
        hashMap.put(String.fromCharCode(205), '&Iacute;');
        hashMap.put(String.fromCharCode(206), '&Icirc;');
        hashMap.put(String.fromCharCode(207), '&Iuml;');
        hashMap.put(String.fromCharCode(208), '&ETH;');
        hashMap.put(String.fromCharCode(209), '&Ntilde;');
        hashMap.put(String.fromCharCode(210), '&Ograve;');
        hashMap.put(String.fromCharCode(211), '&Oacute;');
        hashMap.put(String.fromCharCode(212), '&Ocirc;');
        hashMap.put(String.fromCharCode(213), '&Otilde;');
        hashMap.put(String.fromCharCode(214), '&Ouml;');
        hashMap.put(String.fromCharCode(215), '&times;');
        hashMap.put(String.fromCharCode(216), '&Oslash;');
        hashMap.put(String.fromCharCode(217), '&Ugrave;');
        hashMap.put(String.fromCharCode(218), '&Uacute;');
        hashMap.put(String.fromCharCode(219), '&Ucirc;');
        hashMap.put(String.fromCharCode(220), '&Uuml;');
        hashMap.put(String.fromCharCode(221), '&Yacute;');
        hashMap.put(String.fromCharCode(222), '&THORN;');
        hashMap.put(String.fromCharCode(223), '&szlig;');
        hashMap.put(String.fromCharCode(224), '&agrave;');
        hashMap.put(String.fromCharCode(225), '&aacute;');
        hashMap.put(String.fromCharCode(226), '&acirc;');
        hashMap.put(String.fromCharCode(227), '&atilde;');
        hashMap.put(String.fromCharCode(228), '&auml;');
        hashMap.put(String.fromCharCode(229), '&aring;');
        hashMap.put(String.fromCharCode(230), '&aelig;');
        hashMap.put(String.fromCharCode(231), '&ccedil;');
        hashMap.put(String.fromCharCode(232), '&egrave;');
        hashMap.put(String.fromCharCode(233), '&eacute;');
        hashMap.put(String.fromCharCode(234), '&ecirc;');
        hashMap.put(String.fromCharCode(235), '&euml;');
        hashMap.put(String.fromCharCode(236), '&igrave;');
        hashMap.put(String.fromCharCode(237), '&iacute;');
        hashMap.put(String.fromCharCode(238), '&icirc;');
        hashMap.put(String.fromCharCode(239), '&iuml;');
        hashMap.put(String.fromCharCode(240), '&eth;');
        hashMap.put(String.fromCharCode(241), '&ntilde;');
        hashMap.put(String.fromCharCode(242), '&ograve;');
        hashMap.put(String.fromCharCode(243), '&oacute;');
        hashMap.put(String.fromCharCode(244), '&ocirc;');
        hashMap.put(String.fromCharCode(245), '&otilde;');
        hashMap.put(String.fromCharCode(246), '&ouml;');
        hashMap.put(String.fromCharCode(247), '&divide;');
        hashMap.put(String.fromCharCode(248), '&oslash;');
        hashMap.put(String.fromCharCode(249), '&ugrave;');
        hashMap.put(String.fromCharCode(250), '&uacute;');
        hashMap.put(String.fromCharCode(251), '&ucirc;');
        hashMap.put(String.fromCharCode(252), '&uuml;');
        hashMap.put(String.fromCharCode(253), '&yacute;');
        hashMap.put(String.fromCharCode(254), '&thorn;');
        hashMap.put(String.fromCharCode(255), '&yuml;');
    }

    if ('ENT_NOQUOTES' !== quoteStyle) {
        hashMap.put(String.fromCharCode(34), '&quot;');
    }

    if ('ENT_QUOTES' === quoteStyle) {
        hashMap.put(String.fromCharCode(39), '&#39;');
    }

    hashMap.put(String.fromCharCode(60), '&lt;');
    hashMap.put(String.fromCharCode(62), '&gt;');

    memo[cacheKey] = hashMap.toObject();

    return { ...memo[cacheKey] };
};

module.exports = get_html_translation_table;
