'use strict';

global.__jymfony = global.__jymfony || {};

/*
 * Adapted from locutus.io
 * Originally released under MIT license
 *
 * Do not strip <?php tags
 */
global.__jymfony.strip_tags = function strip_tags(input, allowed) {
    //  Discuss at: http://locutus.io/php/strip_tags/
    // Original by: Kevin van Zonneveld (http://kvz.io)
    // Improved by: Luke Godfrey
    // Improved by: Kevin van Zonneveld (http://kvz.io)
    //    Input by: Pul
    //    Input by: Alex
    //    Input by: Marc Palau
    //    Input by: Brett Zamir (http://brett-zamir.me)
    //    Input by: Bobby Drake
    //    Input by: Evertjan Garretsen
    // Bugfixed by: Kevin van Zonneveld (http://kvz.io)
    // Bugfixed by: Onno Marsman (https://twitter.com/onnomarsman)
    // Bugfixed by: Kevin van Zonneveld (http://kvz.io)
    // Bugfixed by: Kevin van Zonneveld (http://kvz.io)
    // Bugfixed by: Eric Nagel
    // Bugfixed by: Kevin van Zonneveld (http://kvz.io)
    // Bugfixed by: Tomasz Wesolowski
    //  Revised by: Rafał Kukawski (http://blog.kukawski.pl)
    //   Example 1: strip_tags('<p>Kevin</p> <br /><b>van</b> <i>Zonneveld</i>', '<i><b>')
    //   Returns 1: 'Kevin <b>van</b> <i>Zonneveld</i>'
    //   Example 2: strip_tags('<p>Kevin <img src="someimage.png" onmouseover="someFunction()">van <i>Zonneveld</i></p>', '<p>')
    //   Returns 2: '<p>Kevin van Zonneveld</p>'
    //   Example 3: strip_tags("<a href='http://kvz.io'>Kevin van Zonneveld</a>", "<a>")
    //   Returns 3: "<a href='http://kvz.io'>Kevin van Zonneveld</a>"
    //   Example 4: strip_tags('1 < 5 5 > 1')
    //   Returns 4: '1 < 5 5 > 1'
    //   Example 5: strip_tags('1 <br/> 1')
    //   Returns 5: '1  1'
    //   Example 6: strip_tags('1 <br/> 1', '<br>')
    //   Returns 6: '1 <br/> 1'
    //   Example 7: strip_tags('1 <br/> 1', '<br><br/>')
    //   Returns 7: '1 <br/> 1'

    // Making sure the allowed arg is a string containing only tags in lowercase (<a><b><c>)
    allowed = (((allowed || '') + '').toLowerCase().match(/<[a-z][a-z0-9]*>/g) || []).join('');

    let tags = /<\/?([a-z][a-z0-9]*)\b[^>]*>/gi;
    let commentsTags = /<!--[\s\S]*?-->/gi;

    return input.replace(commentsTags, '').replace(tags, ($0, $1) => {
        return -1 < allowed.indexOf('<' + $1.toLowerCase() + '>') ? $0 : '';
    });
};
