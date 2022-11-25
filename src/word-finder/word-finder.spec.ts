import { wordFinder } from './word-finder';
import { wordFixtures } from './word-finder.fixtures.test';

describe('word-finder', () => {
  wordFixtures.forEach(({ pool, token, position }) => {
    it(`should ${
      position > 0 ? '' : 'not '
    }be able to find ${token} in: ${pool}`, () => {
      const output = wordFinder(pool, token);
      expect(output).toEqual(position);
    });
  });
});
