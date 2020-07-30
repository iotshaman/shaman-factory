import 'mocha';
import { expect } from 'chai';
import { FactoryCliSample } from './factory-cli';

describe('Factory CLI', () => {

  it('Temporary', () => {
    var subject = new FactoryCliSample();
    expect(subject.temporary).to.equal(true);
  })

})