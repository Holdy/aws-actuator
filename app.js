'use strict';

async function performAsync(key, target) {
    return await performWrappedAsync({ value: key }, { value: target });
}

async function performWrappedAsync(key, target) {
    const resolvedTarget = module.exports.resolve(target.value);
    const actuator = require(resolvedTarget.actuator);
    const handlerFunction = actuator[key.value];

    if (!handlerFunction) {
        throw new Error(`The action [${key.value}] is not provided by the actuator [${resolvedTarget.actuator}].`);
    }

    return await handlerFunction(resolvedTarget);
}

module.exports.resolve = require('./lib/resolver').resolve;
module.exports.performAsync = performAsync;
module.exports.performWrappedAsync = performWrappedAsync;
