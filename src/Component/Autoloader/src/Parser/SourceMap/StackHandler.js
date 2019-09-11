const Mapping = require('./Mapping');
const Base64VLQ = require('./Base64VLQ');

const _charIsMappingSeparator = (str, index) => ';' === str[index] || ',' === str[index];
/**
 * @type {HashTable}
 */
let fileMappings;

class StackHandler {
    /**
     * Prepares stack trace using V8 stack trace API.
     *
     * @param {Error} error
     * @param {NodeJS.CallSite[]} stack
     */
    static prepareStackTrace(error, stack) {
        try {
            const newStack = [];
            for (const frame of stack) {
                const fileName = frame.getFileName();
                if (frame.isNative() || ! fileMappings || ! fileMappings.has(fileName)) {
                    newStack.push(frame);
                    continue;
                }

                const fileMapping = fileMappings.get(fileName);
                const [ mapping, result ] = fileMapping.search({
                    generatedLine: frame.getLineNumber(),
                    generatedColumn: frame.getColumnNumber(),
                }, BTree.COMPARISON_LESSER) || [ null, false ];

                if (!result) {
                    newStack.push(frame);
                    continue;
                }

                const fileLocation = fileName + (false !== mapping.originalLine ? ':' + mapping.originalLine + ':' + mapping.originalColumn : '');

                let functionName = frame.getFunctionName();
                if (functionName && functionName.startsWith('_anonymous_xΞ')) {
                    functionName = null;
                }

                const methodName = frame.getMethodName();
                const typeName = frame.getTypeName();
                const isTopLevel = frame.isToplevel();
                const isConstructor = frame.isConstructor();
                const isMethodCall = !(isTopLevel || isConstructor);

                const generateFunctionCall = () => {
                    let call = '';

                    if (isMethodCall) {
                        if (!!functionName) {
                            if (!!typeName && !functionName.startsWith(typeName)) {
                                call += typeName + '.';
                            }

                            call += functionName;

                            if (!functionName.endsWith(methodName) && !! methodName) {
                                call += ' [as ' + methodName + ']';
                            }
                        } else {
                            if (!!typeName) {
                                call += typeName + '.';
                            }

                            call += methodName || '<anonymous>';
                        }
                    } else if (isConstructor) {
                        call += 'new ' + (functionName || '<anonymous>');
                    } else if (!!functionName) {
                        call += functionName;
                    } else {
                        call += fileLocation;

                        return call;
                    }

                    call += ' (' + fileLocation + ')';

                    return call;
                };

                newStack.push(
                    (frame.isAsync && frame.isAsync() ? 'async ' : '') +
                    (frame.isPromiseAll && frame.isPromiseAll() ? 'Promise.all (index ' + frame.getPromiseIndex() + ')' : '') +
                    generateFunctionCall()
                );
            }

            return error.message + '\n\n' +
                '    at ' + newStack.map(String).join('\n    at ');
        } catch (e) {
            return 'Internal Error';
        }
    }

    /**
     * Registers a source map.
     *
     * @param {string} filename
     * @param {string} mappings
     */
    static registerSourceMap(filename, mappings) {
        const Position = require('../AST/Position');
        if (undefined === fileMappings) {
            fileMappings = new HashTable();
        }

        let generatedLine = 1;
        let previousGeneratedColumn = 0;
        let previousOriginalLine = 0;
        let previousOriginalColumn = 0;
        let previousSource = 0;
        let previousName = 0;
        const length = mappings.length;
        let index = 0;
        const cachedSegments = {};
        /**
         * @type {Mapping[]}
         */
        const generatedMappings = [];
        let mapping, str, segment, end, value;

        while (index < length) {
            if (';' === mappings.charAt(index)) {
                generatedLine++;
                index++;
                previousGeneratedColumn = 0;
            } else if (',' === mappings.charAt(index)) {
                index++;
            } else {
                // Because each offset is encoded relative to the previous one,
                // Many segments often have the same encoding. We can exploit this
                // Fact by caching the parsed variable length fields of each segment,
                // Allowing us to avoid a second parse if we encounter the same
                // Segment again.
                for (end = index; end < length; end++) {
                    if (_charIsMappingSeparator(mappings, end)) {
                        break;
                    }
                }

                str = mappings.slice(index, end);
                segment = cachedSegments[str];
                if (segment) {
                    index += str.length;
                } else {
                    segment = [];
                    while (index < end) {
                        [ value, index ] = Base64VLQ.decode(mappings, index);
                        segment.push(value);
                    }

                    if (2 === segment.length) {
                        throw new Error('Found a source, but no line and column');
                    }

                    if (3 === segment.length) {
                        throw new Error('Found a source and line, but no column');
                    }

                    cachedSegments[str] = segment;
                }

                mapping = new Mapping(new Position(generatedLine, previousGeneratedColumn + segment[0]));
                previousGeneratedColumn = mapping.generatedColumn;

                if (1 < segment.length) {
                    // Original source.
                    mapping.source = previousSource + segment[1];
                    previousSource += segment[1];

                    // Original line.
                    mapping.originalLine = previousOriginalLine + segment[2];
                    previousOriginalLine = mapping.originalLine;
                    // Lines are stored 0-based
                    mapping.originalLine += 1;

                    // Original column.
                    mapping.originalColumn = previousOriginalColumn + segment[3];
                    previousOriginalColumn = mapping.originalColumn;

                    if (4 < segment.length) {
                        // Original name.
                        mapping.name = previousName + segment[4];
                        previousName += segment[4];
                    }
                }

                generatedMappings.push(mapping);
            }
        }

        const __generatedMappings = new BTree(Mapping.compareByGeneratedPositionsDeflated);
        generatedMappings.forEach(m => __generatedMappings.push(m, true));

        fileMappings.put(filename, __generatedMappings);
    }
}

module.exports = StackHandler;
Error.prepareStackTrace = StackHandler.prepareStackTrace;
