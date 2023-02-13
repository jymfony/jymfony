emit(`<div class="exception-summary ${! exceptionMessage ? 'exception-without-message' : ''}">
    <div class="exception-metadata">
        <div class="container">
            <h2 class="exception-hierarchy">
`);

for (const [ index, previousException ] of __jymfony.getEntries(exception.allPrevious.reverse())) {
    emit(`
                <a href="#trace-box-${index + 2}">${abbrClass(previousException.class)}</a>
                <span class="icon">${include('assets/images/chevron-right.svg')}</span>
`);
}

emit(`
                <a href="#trace-box-1">${abbrClass(exception.class)}</a>
            </h2>
            <h2 class="exception-http">
                HTTP ${statusCode} <small>${statusText}</small>
            </h2>
        </div>
    </div>

    <div class="exception-message-wrapper">
        <div class="container">
            <h1 class="break-long-words exception-message${exceptionMessage.length > 180 ? ' long' : ''}">${exceptionMessage.replace(/\n/g, '<br>')}</h1>

            <div class="exception-illustration hidden-xs-down">
                ${include('assets/images/jymfony-ghost.svg.js')}
            </div>
        </div>
    </div>
</div>

<div class="container">
    <div class="jf-tabs">
        <div class="tab">
`);

const exceptionAsArray = exception.toArray();
const exceptionWithUserCode = [];
const exceptionAsArrayCount = exceptionAsArray.length;
const last = exceptionAsArray[exceptionAsArray.length - 1];

for (const [ i, e ] of __jymfony.getEntries(exceptionAsArray)) {
    for (const trace of Object.values(e.trace)) {
        if (
            !! trace.file &&
            ! trace.file.includes('/node_modules/') &&
            ! trace.file.includes('/var/cache/') &&
            ! trace.file.startsWith('internal/') &&
            ! trace.file.startsWith('node:internal/') &&
            ! trace.file.startsWith('/node:') &&
            i < last) {
            exceptionWithUserCode.push(i);
        }
    }
}

emit(`<h3 class="tab-title">Exception${exceptionAsArrayCount > 1 ? 's <span class="badge">' + exceptionAsArrayCount + '</span>' : ''}</h3>`);

emit('<div class="tab-content">');
for (const [ i, e ] of __jymfony.getEntries(exceptionAsArray)) {
    include('views/traces.html.js', {
        exception: e,
        index: i + 1,
        expand: exceptionWithUserCode.includes(i) || (0 === exceptionWithUserCode.length && 0 === 0),
    });
}

emit(`
            </div>
        </div>
`);

if (logger) {
    const logs = logger.getLogs(logSubject);
    const errorCount = logger.countErrors(logSubject);
    emit(`<div class="tab ${0 === logs.length ? 'disabled' : ''}">
            <h3 class="tab-title">
                Logs
                ${errorCount ? '<span class="badge status-error">' + errorCount + '</span>' : ''}
            </h3>

            <div class="tab-content">
                ${logs.length ? 
                    include('views/logs.html.js', { logs }) :
                    `
                    <div class="empty">
                        <p>No log messages</p>
                    </div>
                `}
            </div>
        </div>`);
}

emit(`<div class="tab">
            <h3 class="tab-title">
                Stack Trace${1 < exceptionAsArrayCount ? `s <span class="badge">${exceptionAsArrayCount}</span>` : ''}
            </h3>

            <div class="tab-content">
                ${exceptionAsArray.map((e, i) => include('views/traces_text.html.js', {
                        exception: e,
                        index: i + 1,
                        numExceptions: exceptionAsArrayCount,
                    })
                ).join('')}
            </div>
        </div>
    </div>
</div>
`);
