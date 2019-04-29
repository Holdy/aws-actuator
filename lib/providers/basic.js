'use strict';

async function writeToConsoleAsync(resolvedTarget) {
    console.log(resolvedTarget.value);
    return {
        value: true
    };
}

async function trueAsync() {
    return {
        value: true
    };
}

async function falseAsync() {
    return {
        value: false
    };
}

module.exports['write-to-console'] = writeToConsoleAsync;
module.exports['true'] = trueAsync;
module.exports['false'] = falseAsync;