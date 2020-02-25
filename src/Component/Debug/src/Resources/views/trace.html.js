const isInternal = trace.file.startsWith('internal/');
let html = `<div class="trace-line-header break-long-words ${trace.file ? 'jf-toggle' : ''}" ${! isInternal ? `data-toggle-selector="#trace-html-${prefix}-${i}"` : ''} data-toggle-initial="${'expanded' === style ? 'display' : ''}">`;

if (! isInternal && !! trace.file) {
    html += `
        <span class="icon icon-close">${include('assets/images/icon-minus-square.svg')}</span>
        <span class="icon icon-open">${include('assets/images/icon-plus-square.svg')}</span>
`;
}

if (!! trace.function) {
    html += `<span class="trace-method">${trace.function}</span>`;
}

if (!! trace.file) {
    const lineNumber = trace.line || 1;
    const filePath = __jymfony.strtr(__jymfony.strip_tags(formatFile(trace.file, lineNumber)), { [' at line ' + lineNumber]: '' });
    const filePathParts = filePath.split(DIRECTORY_SEPARATOR);
    const lastPart = filePathParts.pop();

    html += `<span class="block trace-file-path"> in
            ${filePathParts.join(DIRECTORY_SEPARATOR) + DIRECTORY_SEPARATOR}<strong>${lastPart}</strong>
            (line ${lineNumber})
        </span>`;
}

html += '</div>';

if (! isInternal && !! trace.file) {
    html += `<div id="trace-html-${prefix}-${i}" class="trace-code jf-toggle-content">`;
    html += fileExcerpt(trace.file, trace.line, 5);
    html += '</div>';
}

return html;
