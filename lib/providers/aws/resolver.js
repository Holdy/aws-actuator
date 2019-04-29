'use strict';
const sqsActuatorName = './lib/providers/aws/sqs';
const dataPipelineActuatorName = './lib/providers/aws/dataPipeline';

function resolve(text) {
    if (text.startsWith('arn:')) {
        return unpackArn(text)
    } else if (text.startsWith('https://')) {
        return unpackUrl(text);
    } else if (text.startsWith('aws data pipeline ')) {
        var region = null;
        if (text.indexOf('us-east-1') != -1) {
            text = text.replace("us-east-1", "").replace("  ", " ").trim();
            region = 'us-east-1';
        }
        return {
            components: { pipelineId: text.substring(18), service: 'datapipeline', region: region },
            actuator: dataPipelineActuatorName
        };
    } 
    return null;
}

function unpackUrl(text) {
    var result = null;
    const parts = text.split('/');
    if (parts.length == 5) {
        const domainName = parts[2];
        const domainParts = domainName.split('.');
        if (domainParts.length == 4) {
            const components = {
                partition: 'aws',
                service: domainParts[0],
                region: domainParts[1],
                'account-id': parts[3],
                resource: parts[4]
            };
            result = reconstitute(components);
        }
    }

    return result;
}

function reconstitute(components) {
    const result = {
        components: components,
        arn: `arn:${components.partition}:${components.service}:${components.region}:${components['account-id']}:${components.resource}`,
        url: `https://${components.service}.${components.region}.amazonaws.com/${components['account-id']}/${components.resource}`
    };

    if (result && result.components.service == 'sqs') {
        result.actuator = sqsActuatorName;
    }

    return result;
}

function unpackArn(text) {
    var result = null;
    const parts = text.split(':');

    if (parts.length == 6) {
        const components = {
            partition: parts[1],
            service: parts[2],
            region: parts[3],
            'account-id': parts[4],
            resource: parts[5]
        };
        result = reconstitute(components);
    }
    return result;
}

module.exports.resolve = resolve;