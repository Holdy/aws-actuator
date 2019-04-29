
const resolverMap = {
    'aws': './providers/aws/resolver',
    'guid': './providers/basic-resolver'
};
const keys = Object.keys(resolverMap);

function resolve(text) {
    var result = null;
    var specificMatchFound = false;

    keys.forEach(key => {
        if (text.indexOf(key) != -1) {
            specificMatchFound = true;
            const specificProvider = require(resolverMap[key]);
            result = specificProvider.resolve(text);
        }
    });

    if (!result && !specificMatchFound) {
        result = require('./providers/basic-resolver').resolve(text)
    }

    return result;
}

module.exports.resolve = resolve;