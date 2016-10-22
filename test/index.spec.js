/* global describe, before, after, it, localStorage, DOMException */
import { expect } from 'chai';
import { getInfo } from '../src';

describe('get info', () => {
  it('should not be disabled', () => {
    localStorage.clear();
    console.info(getInfo());
    expect(getInfo().support).to.be.true;
  });

  it('return 0 when not data', () => {
    localStorage.clear();

    const info = getInfo();
    console.log(info);
    expect(info.humanSize).to.equal('5.00 MB');
    expect(info.usedSize).to.equal(0);
    expect(info.humanUsedSize).to.equal('0 bytes');
    expect(info.usedPercentage).to.equal('0.00%');
    // expect(getInfo()).to.deep.equal({
    //   support: true,
    //   size: 5242880,
    //   humanSize: '5.00 MB',
    //   usedSize: 0,
    //   usedPercentage: '0.00%',
    //   humanUsedSize: '0 bytes',
    //   freeSize: 5242880,
    //   humanFreeSize: '5.00 MB',
    //   freePercentage: '100.00%',
    // });
  });

  it('should get used size right', () => {
    localStorage.clear();
    const block1 = Array(1024 * 128).join('s');
    localStorage.setItem('i', block1);
    const block2 = Array(1024 * 512).join('s');
    localStorage.setItem('j', block2);
    const block3 = Array(1024 * 1024).join('s');
    localStorage.setItem('k', block3);

    const info = getInfo();
    console.log(info);
    expect(info.humanSize).to.equal('5.00 MB');
    expect(info.usedSize).to.equal(1703936);
    expect(info.humanUsedSize).to.equal('1.63 MB');
    // expect(getInfo()).to.deep.equal({
    //   support: true,
    //   size: 5242880,
    //   humanSize: '5.00 MB',
    //   usedSize: 1703936,
    //   humanUsedSize: '1.63 MB',
    //   usedPercentage: '32.50%',
    //   freeSize: 3538944,
    //   humanFreeSize: '3.38 MB',
    //   freePercentage: '67.50%'
    // });
  });

  it('should throw error if add size exceed', () => {
    localStorage.clear();
    const size = Array(getInfo().size + 1).join('x');
    expect(() => {
      localStorage.setItem('a', size);
    }).to.throw(Error);
  });

  it('should not throw error if add size not exceed', () => {
    localStorage.clear();
    let size = getInfo().size;
    size = Array(size).join('x'); // will generate size of -1
    expect(() => {
      localStorage.setItem('a', size);
    }).to.not.throw(Error);
  });

  it('works even if there is small free space', () => {
    localStorage.clear();
    localStorage.setItem('a', Array(getInfo().size - (1024 * 3)).join('x')); // will generate size of -1

    const info = getInfo();
    console.log(info);
    expect(info.humanSize).to.equal('5.00 MB');
    expect(Math.abs(info.freeSize - 3072) < 2).to.be.true; // 可以会有两个数的误差
    expect(info.humanFreeSize).to.equal('3.00 kB');
    expect(info.freePercentage).to.equal('0.06%');
    // expect(getInfo()).to.deep.equal({
    //   support: true,
    //   size: 5242880,
    //   humanSize: '5.00 MB',
    //   usedSize: 5239808,
    //   humanUsedSize: '5.00 MB',
    //   usedPercentage: '99.94%',
    //   freeSize: 3072,
    //   humanFreeSize: '3.00 kB',
    //   freePercentage: '0.06%'
    // });
  });
});
