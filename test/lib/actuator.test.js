'use strict';

const expect = require('chai').expect;
const app = require('../../app');

const BASICALLY_VALID_URI = 'https://sqs.us-east-1.amazonaws.com/123456/some-queue.fifo';

describe('actuator', function () {

    it('should error for unknown action', async function () {
        try {
            const result = await app.performAsync('pickle', BASICALLY_VALID_URI);
            expect.fail('Error should have been thrown.');
        } catch (e) {
            expect(e.message).to.equal('The action [pickle] is not provided by the actuator [./lib/providers/aws/sqs].');
        }
    });

    it('should perform a known good action without error', async function () {
        app.performAsync('write-to-console', 'This should not explode.');
    });

});