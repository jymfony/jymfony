emit(`<table class="trace trace-as-text">
    <thead class="trace-head">
        <tr>
            <th class="jf-toggle" data-toggle-selector="#trace-text-${index}" data-toggle-initial="${1 === index ? 'display' : ''}">
                <h3 class="trace-class">
                    ${numExceptions > 1 ? `<span class="text-muted">[${numExceptions - index + 1}/${numExceptions}]</span>` : ''}
                    ${exception.class}
                    <span class="icon icon-close">${include('assets/images/icon-minus-square-o.svg')}</span>
                    <span class="icon icon-open">${include('assets/images/icon-plus-square-o.svg')}</span>
                </h3>
            </th>
        </tr>
    </thead>

    <tbody id="trace-text-${index}">
        <tr>
            <td>
`);

if (!! exception.trace) {
    emit('<pre class="stacktrace">');
    emit(escape(exception.class) + ':\n');
    if (exception.message) {
        emit(exception.message + '\n');
    }

    for (const trace of exception.trace) {
        emit('\n  ');
        if (trace.function) {
            const func = trace.function;
            const file = trace.file || 'n/a';
            const line = trace.line || 'n/a';
            emit(__jymfony.sprintf('%s() at %s:%s</info>', func, file, line));
        }
    }

    emit('</pre>');
}

emit(`
            </td>
        </tr>
    </tbody>
</table>
`);
