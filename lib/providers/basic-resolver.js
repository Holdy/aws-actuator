'use strict';

function resolve(text) {
    return {
        actuator: './lib/providers/basic',
        value: text
    };
}

module.exports.resolve = resolve;