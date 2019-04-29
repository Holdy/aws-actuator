'use strict';

let expect = require('chai').expect;
let rewire = require('rewire');

const mockedSut = rewire('../../../../lib/providers/aws/sqs');
const mockClient = {};
const mockCreateClient = function () {
    return mockClient;
};

mockedSut.__set__('createClient', mockCreateClient);

describe('sqs.isEmpty', function () {

    it('should respond with true when necessary', async function() {
        mockClient.getQueueAttributes = async (params, callback) => {
            callback(null, {
                Attributes: { ApproximateNumberOfMessages: 5 }
            });
        };

        var result = await mockedSut['is-empty']({ url: '5-item-queue' });
        expect(result.value).to.equal(false);
    });

    it('should respond with false when necessary', async function () {
        mockClient.getQueueAttributes = async (params, callback) => {
            callback(null, {
                Attributes: { ApproximateNumberOfMessages: 0 }
            });
        };

        var result = await mockedSut['is-empty']({ url: '0-item-queue' });
        expect(result.value).to.equal(true);
    });
});

describe('sqs.countAvailableMessages', function () {

    it('should throw exceptions appropriately', async function () {
        mockClient.getQueueAttributes = async (params, callback) => {
            callback(new Error('Bang!'));
        };

        try {
            await mockedSut['count-available-messages']({ url: '0-item-queue' });
            expect.fail('An exception should have been thrown.');
        } catch (e) {
            expect(e.message).to.equal('Bang!');
        }
    });
});

describe('sqs.isNotEmpty', function () {

    it('should respond with true when necessary', async function () {
        mockClient.getQueueAttributes = async (params, callback) => {
            callback(null, {
                Attributes: { ApproximateNumberOfMessages: 0 }
            });
        };

        var result = await mockedSut['is-not-empty']({ url: '0-item-queue' });
        expect(result.value).to.equal(false);
    });

    it('should respond with false when necessary', async function () {
        mockClient.getQueueAttributes = async (params, callback) => {
            callback(null, {
                Attributes: { ApproximateNumberOfMessages: 5 }
            });
        };

        var result = await mockedSut['is-not-empty']({ url: '5-item-queue' });
        expect(result.value).to.equal(true);
    });
});

describe('sqs.createClient()', function () {

    const sut = rewire('../../../../lib/providers/aws/sqs');

    it('should add region to client parameters if present', function () {
        let data = {
            components: { region: 'us-east-1' }
        };
        let result = sut.__get__('createClient')(data);
        expect(result.config.region).to.equal('us-east-1');
    });

    it('should not add region to client parameters if missing', function () {
        let data = {
            components: {}
        };
        let result = sut.__get__('createClient')(data);
        expect(result.config.region).to.not.equal('us-east-1');
    });

});

