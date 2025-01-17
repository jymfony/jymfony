const { trampoline } = (() => {
    try {
        return require('@jymfony/autoloader');
    } catch (e) {
        return require('../../../../Autoloader');
    }
})();

module.exports = trampoline(__dirname + '/' + process.env.TRAMPOLINE_HANDLER)['default'];
