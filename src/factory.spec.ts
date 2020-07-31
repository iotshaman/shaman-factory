import 'mocha';
import { Factory } from './factory';
import { expect } from 'chai';

describe('Factory', () => {

  it('Generate placeholder', () => {
    let factory = new Factory();
    factory.Generate("create", []);
    expect(factory).not.to.be.null;
  })

})