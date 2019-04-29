'use strict';

const expect = require('chai').expect;

const sut = require('../app');

describe('app', function () {

    it('True action should return true', async function () {

        let result = await sut.performAsync('true', '');
        expect(result.value).to.equal(true);

    });

    it('False action should return false', async function () {

        let result = await sut.performAsync('false', '');
        expect(result.value).to.equal(false);

    });

});