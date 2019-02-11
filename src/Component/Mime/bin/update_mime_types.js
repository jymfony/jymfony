#!/usr/bin/env node

require('@jymfony/autoloader');
const libxmljs = require('libxmljs');

const File = Jymfony.Component.Filesystem.File;

const loadFile = async (fn) => {
    const file = new File(fn);
    const openFile = await file.openFile();

    const data = await openFile.fread(await file.getSize());

    await openFile.close();

    return data.toString();
};

(async () => {

    const data = await loadFile('https://svn.apache.org/repos/asf/httpd/httpd/trunk/docs/conf/mime.types');

    const $new = {};
    for (const line of data.split('\n')) {
        if (! line || '#' === line[0]) {
            continue;
        }

        const mimeType = line.substr(0, line.indexOf('\t'));
        $new[mimeType] = line.substr(line.lastIndexOf('\t') + 1).split(' ');
    }

    const xml = libxmljs.parseXml(await loadFile('https://raw.github.com/minad/mimemagic/master/script/freedesktop.org.xml'), {
        blanks: false,
    });
    for (const node of xml.root().childNodes()) {
        const exts = [];
        const globs = node.find('glob', 'http://www.freedesktop.org/standards/shared-mime-info');

        for (const glob of globs) {
            const pattern = glob.attr('pattern');
            if ('*' !== pattern[0] || '.' !== pattern[1]) {
                continue;
            }

            exts.push(pattern.substr(2));
        }

        if (0 === exts.length) {
            continue;
        }

        const mimeType = node.attr('type').toLowerCase();
        $new[mimeType] = ($new[mimeType] || []).concat(exts);

        for (const alias of node.find('alias')) {
            const mimeType = alias.attr('type').toLowerCase();
            $new[mimeType] = ($new[mimeType] || []).concat(exts);
        }
    }

    const outFn = __dirname + '/../src/mime_types_map.js';
    const { mimeTypes } = require(outFn);
    for (const [ key, value ] of __jymfony.getEntries(mimeTypes)) {
        $new[key] = Array.from(new Set([ ...value, ...($new[key] || []) ])).sort();
    }

    // Reverse map
    const exts = {
        'aif': [ 'audio/x-aiff' ],
        'aiff': [ 'audio/x-aiff' ],
        'aps': [ 'application/postscript' ],
        'avi': [ 'video/avi' ],
        'bmp': [ 'image/bmp' ],
        'bz2': [ 'application/x-bz2' ],
        'css': [ 'text/css' ],
        'csv': [ 'text/csv' ],
        'dmg': [ 'application/x-apple-diskimage' ],
        'doc': [ 'application/msword' ],
        'docx': [ 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ],
        'eml': [ 'message/rfc822' ],
        'exe': [ 'application/x-ms-dos-executable' ],
        'flv': [ 'video/x-flv' ],
        'gif': [ 'image/gif' ],
        'gz': [ 'application/x-gzip' ],
        'hqx': [ 'application/stuffit' ],
        'htm': [ 'text/html' ],
        'html': [ 'text/html' ],
        'jar': [ 'application/x-java-archive' ],
        'jpeg': [ 'image/jpeg' ],
        'jpg': [ 'image/jpeg' ],
        'js': [ 'text/javascript' ],
        'm3u': [ 'audio/x-mpegurl' ],
        'm4a': [ 'audio/mp4' ],
        'mdb': [ 'application/x-msaccess' ],
        'mid': [ 'audio/midi' ],
        'midi': [ 'audio/midi' ],
        'mov': [ 'video/quicktime' ],
        'mp3': [ 'audio/mpeg' ],
        'mp4': [ 'video/mp4' ],
        'mpeg': [ 'video/mpeg' ],
        'mpg': [ 'video/mpeg' ],
        'odg': [ 'vnd.oasis.opendocument.graphics' ],
        'odp': [ 'vnd.oasis.opendocument.presentation' ],
        'ods': [ 'vnd.oasis.opendocument.spreadsheet' ],
        'odt': [ 'vnd.oasis.opendocument.text' ],
        'ogg': [ 'audio/ogg' ],
        'pdf': [ 'application/pdf' ],
        'php': [ 'application/x-php' ],
        'php3': [ 'application/x-php' ],
        'php4': [ 'application/x-php' ],
        'php5': [ 'application/x-php' ],
        'png': [ 'image/png' ],
        'ppt': [ 'application/vnd.ms-powerpoint' ],
        'pptx': [ 'application/vnd.openxmlformats-officedocument.presentationml.presentation' ],
        'ps': [ 'application/postscript' ],
        'rar': [ 'application/x-rar-compressed' ],
        'rtf': [ 'application/rtf' ],
        'sit': [ 'application/x-stuffit' ],
        'svg': [ 'image/svg+xml' ],
        'tar': [ 'application/x-tar' ],
        'tif': [ 'image/tiff' ],
        'tiff': [ 'image/tiff' ],
        'ttf': [ 'application/x-font-truetype' ],
        'txt': [ 'text/plain' ],
        'vcf': [ 'text/x-vcard' ],
        'wav': [ 'audio/wav' ],
        'wma': [ 'audio/x-ms-wma' ],
        'wmv': [ 'audio/x-ms-wmv' ],
        'xls': [ 'application/vnd.ms-excel' ],
        'xlsx': [ 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ],
        'xml': [ 'application/xml' ],
        'zip': [ 'application/zip' ],
    };

    for (const [ mimeType, extensions ] of __jymfony.getEntries($new)) {
        for (const extension of extensions) {
            exts[extension] = Array.from(new Set((exts[extension] || []).concat([ mimeType ])));
        }
    }

    const outFile = new File(outFn);
    const out = await outFile.openFile('w');

    await out.fwrite('// Updated from upstream on ' + new Date().toUTCString() + '\n\n');
    await out.fwrite('module.exports = ' + JSON.stringify({
        mimeTypes: Object.ksort($new),
        extensions: Object.ksort(exts),
    }, null, 4).replace(/"/g, '\'') + ';\n');

    await out.close();

})().catch(err => {
    console.error(err.stack);
});
