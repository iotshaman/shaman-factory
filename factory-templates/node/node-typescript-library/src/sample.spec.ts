import 'mocha';
import { expect } from 'chai';
import { Sample } from './sample';

describe('Sample', () => {

  it('name should equal "noop"', () => {
    let subject = new Sample();
    expect(subject.name).to.equal("Sample Class");
  });

})