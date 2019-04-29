'use strict';

const expect = require('chai').expect;

const sut = require('../../app');

describe('resolver functionality', function () {

    it('should resolve aws url and arn equally', function () {
        const urlForm = 'https://sqs.us-east-1.amazonaws.com/187863882135/MyQueue';
        const arnForm = 'arn:aws:sqs:us-east-1:187863882135:MyQueue';

        const urlWrapper = sut.resolve(urlForm);
        const arnWrapper = sut.resolve(arnForm);

        expect(urlWrapper.arn).to.equal(arnForm);
        expect(arnWrapper.url).to.equal(urlForm);
        expect(urlWrapper.components).to.eql(arnWrapper.components);
    });

    it('should return basic text resolution for unrecognised value', function () {
        const result = sut.resolve('not-recognisable');
        expect(result.actuator).to.equal('./lib/providers/basic');
        expect(result.value).to.equal('not-recognisable');
    });

    it('should recognise aws data pipeline', function () {
        const result = sut.resolve('aws data pipeline ABC123');
        expect(result.actuator).to.equal('./lib/providers/aws/dataPipeline');
    });

    it('should recognise region in a pipeline', function () {
        const result = sut.resolve('aws data pipeline df-03621912G8P9VR7GCBXU us-east-1');
        expect(result.actuator).to.equal('./lib/providers/aws/dataPipeline');
        expect(result.components.region).to.equal('us-east-1');
    });
        
    it('should not resolve an aws url with too many segments', function () {
        const result = sut.resolve('https://aws/blah');
        expect(result).to.be.null;
    });

    it('should return null for false positive aws text', function () {
        const result = sut.resolve('almost aws url');
        expect(result).to.be.null;
    });

    it('should not resolve an aws url with a malformed dns name', function () {
        const result = sut.resolve('https://aws/blah/stuff');
        expect(result).to.be.null;
    });

    it('should return null for malformed arn', function () {
        const result = sut.resolve('arn:aws:oops');
        expect(result).to.be.null;
    });

    it('should handle an invalid aws service', function () {
        const result = sut.resolve('arn:aws:essqess:us-east-1:123456:SomeQueue.fifo');
        expect(result.actuator).to.be.undefined;
    });
});
