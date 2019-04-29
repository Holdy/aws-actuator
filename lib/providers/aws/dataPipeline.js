
function createClient(resolvedTarget) {
    const params = { apiVersion: '2012-10-29' };

    if (resolvedTarget && resolvedTarget.components.region) {
        params.region = resolvedTarget.components.region;
    }

    const Client = require('aws-sdk/clients/datapipeline');
    return new Client(params);
}

function activate(resolvedTarget) {
    const client = createClient(resolvedTarget);

    const params = {
        pipelineId: resolvedTarget.components.pipelineId
    };

    return new Promise((resolve, reject) => {
        client.activatePipeline(params, (err) => {
            if (err) {
                reject(err);
            } else {
                resolve({ value: true }); // These responses are empty json objects.
            }
        });
    });
}

function deactivate(resolvedTarget) {
    const client = createClient(resolvedTarget);

    const params = {
        pipelineId: resolvedTarget.components.pipelineId
    };

    return new Promise((resolve, reject) => {
        client.deactivatePipeline(params, (err) => {
            if (err) {
                reject(err);
            } else {
                resolve({ value: true });  // These responses are empty json objects.
            }
        });
    });
}

module.exports.activate = activate;
module.exports.deactivate = deactivate;