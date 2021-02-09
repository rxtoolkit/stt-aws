import {expect} from 'chai';
// import sinon from 'sinon';
// import {marbles} from 'rxjs-marbles/mocha';

import {toAWSTranscribe} from './index';

describe('index', () => {
  it('should export a function', () => {
    expect(toAWSTranscribe).to.be.a('function');
  });
});
