const classParts = exception.class.split('.');
const className = classParts.pop();

emit(`<div class="trace trace-as-html" id="trace-box-${index}">
    <div class="trace-details">
        <div class="trace-head">
            <span class="jf-toggle" data-toggle-selector="#trace-html-${index}" data-toggle-initial="${expand ? 'display' : ''}">
                <h3 class="trace-class">
                    <span class="icon icon-close">${include('assets/images/icon-minus-square-o.svg')}</span>
                    <span class="icon icon-open">${include('assets/images/icon-plus-square-o.svg')}</span>

                    <span class="trace-namespace">
                        ${classParts.join('.')}${classParts.length > 0 ? '.' : ''}
                    </span>
                    ${className}
                </h3>
                
                ${exception.message && index > 1 ? '<p class="break-long-words trace-message">' + exception.message + '</p>' : ''}
            </span>
        </div>

        <div id="trace-html-${index}" class="jf-toggle-content">`);

let isFirstUserCode = true;
for (const [ i, trace ] of __jymfony.getEntries(exception.trace)) {
    const isVendorTrace = !! trace.file && (trace.file.includes('/node_modules/') || trace.file.includes('/var/cache/'));
    const isInternal = !! trace.file && trace.file.startsWith('internal/');
    const displayCodeSnippet = isFirstUserCode && ! isVendorTrace;
    if (displayCodeSnippet) {
        isFirstUserCode = false;
    }

    emit(`
            <div class="trace-line ${isVendorTrace ? 'trace-from-vendor' : ''}${isInternal ? 'trace-internal' : ''}">
                ${include('views/trace.html.js', {
                    prefix: index,
                    i,
                    trace,
                    style: isVendorTrace ? 'compact' : (displayCodeSnippet ? 'expanded' : ''),
                })}
            </div>
        `);
}

emit(`        </div>
    </div>
</div>
`);

