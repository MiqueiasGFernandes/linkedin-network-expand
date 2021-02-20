const { stdout } = require('test-console');
const main = require('../main/main');

describe('main', () => {
  describe('GIVEN .main()', () => {
    describe('WHEN help show up', () => {
      test('SHOULD show a string with [options] text', () => {
        const argsFromSystem = process.argv0;
        const args = [
          ...argsFromSystem,
          '--help',
        ];
        const sut = stdout.inspectSync(() => { main(args); });
        expect(sut.includes('[options]')).toBe(true);
      });
    });
  });
});
