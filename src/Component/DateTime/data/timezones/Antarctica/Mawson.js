export default (() => {
    let o;
    return [
        {
            ['offset']: 0,
            ['dst']: false,
            ['abbrev']: '-00',
            ['until']: -501206400,
            ['format']: '-00',
        },
        {
            ['offset']: 21600,
            ['dst']: false,
            ['abbrev']: '%z',
            ['until']: 1255809600,
            ['format']: '%z',
        },
        {
            ['offset']: 18000,
            ['dst']: false,
            ['abbrev']: '%z',
            ['until']: Infinity,
            ['format']: '%z',
        },
    ];
})();
;
