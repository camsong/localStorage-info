/* global describe, before, after, it, localStorage */
import { expect } from 'chai';
import { getInfo } from '../src';

describe('get info', () => {
  before(() => {
    localStorage.clear();
  });

  after(() => {
    localStorage.clear();
  });

  it('should not be disabled', () => {
    expect(getInfo().support).to.be.true;
  });

  it('return 0 when not data', () => {
    expect(getInfo()).to.deep.equal({
      support: true,
      size: 5242880,
      humanSize: '5.00 MB',
      usedSize: 0,
      usedPercentage: '0.00%',
      humanUsedSize: '0 bytes',
      freeSize: 5242880,
      humanFreeSize: '5.00 MB',
      freePercentage: '100.00%',
    });
  });

  it('should get used size right', () => {
    const block1 = Array(1024 * 128).join('s');
    localStorage.setItem('i', block1);
    const block2 = Array(1024 * 512).join('s');
    localStorage.setItem('j', block2);
    const block3 = Array(1024 * 1024).join('s');
    localStorage.setItem('k', block3);

    expect(getInfo()).to.deep.equal({
      support: true,
      size: 5242879,
      humanSize: '5.00 MB',
      usedSize: 1703936,
      humanUsedSize: '1.63 MB',
      usedPercentage: '32.50%',
      freeSize: 3538943,
      humanFreeSize: '3.37 MB',
      freePercentage: '67.50%'
    });
  });
});
