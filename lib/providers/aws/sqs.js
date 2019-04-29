'use strict';

function createClient(resolvedTarget) {
    const params = { apiVersion: '2012-11-05'};

    if (resolvedTarget && resolvedTarget.components.region) {
        params.region = resolvedTarget.components.region;
    }

    const SQS = require('aws-sdk/clients/sqs');
    return new SQS(params);
}

async function isEmpty(resolvedTarget) {
    const result = await countAvailableMessages(resolvedTarget);
    return { value: result.value == 0 };
}

async function isNotEmpty(resolvedTarget) {
    const result = await countAvailableMessages(resolvedTarget);
    return { value: result.value != 0 };
}

async function countAvailableMessages(resolvedTarget) {
    const client = createClient(resolvedTarget);

    const params = {
        QueueUrl: resolvedTarget.url,
        AttributeNames: ["ApproximateNumberOfMessages"]
    };

    return new Promise((resolve, reject) => {
        client.getQueueAttributes(params, (err, response) => {
            if (err) {
                reject(err);
            } else {
                resolve({ value: response.Attributes.ApproximateNumberOfMessages });
            }
        });
    });
}

module.exports['count-available-messages'] = countAvailableMessages;
module.exports['is-empty'] = isEmpty;
module.exports['is-not-empty'] = isNotEmpty;