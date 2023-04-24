const channelIsDefined = !! logs[0] && !! logs[0].channel;

emit('<table class="logs" data-filter-level="Emergency,Alert,Critical,Error,Warning,Notice,Info,Debug" data-filters>');
emit(`
    <thead>
        <tr>
            <th data-filter="level">Level</th>
            ${channelIsDefined ? '<th data-filter="channel">Channel</th>' : ''}
            <th class="full-width">Message</th>
        </tr>
    </thead>

    <tbody>
`);

for (const log of logs) {
    let status = '';
    if (log.priority >= 400) {
        status = 'error';
    } else if (log.priority >= 300) {
        status = 'warning';
    } else {
        let severity = 0;
        const exception = log.context && log.context.exception;

        if (exception instanceof ErrorException) {
            severity = exception.severity;
        }

        status = 'DeprecationWarning' === severity ? 'warning' : 'normal';
    }

    emit(`<tr class="status-${status}" data-filter-level="${escape(log.priorityName).toLowerCase()}"${channelIsDefined ? ' data-filter-channel="' + escape(log.channel) + '"' : ''}>
            <td class="text-small" nowrap>
                <span class="colored text-bold">${escape(log.priorityName)}</span>
                <span class="text-muted newline">${date('H:i:s', log.timestamp)}</span>
            </td>
            ${channelIsDefined ? `
                <td class="text-small text-bold nowrap">
                    ${escape(log.channel)}
                </td>
            ` : ''}
            <td>
                ${formatLogMessage(log.message, log.context)}
                ${0 !== Object.keys(log.context).length ? `
                    <pre class="text-muted prewrap m-t-5">${JSON.stringify(log.context, null, 4)}</pre>
                ` : ''}
            </td>
        </tr>`);
}

emit('</tbody></table>');
