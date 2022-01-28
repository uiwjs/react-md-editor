/**
 * @jest-environment jsdom
 */
/* eslint-disable jest/no-conditional-expect */
import '@testing-library/jest-dom';
import { getSurroundingWord } from '../../utils/markdownUtils';

it('getSurroundingWord', () => {
  expect(getSurroundingWord('hello world', 0)).toMatchObject({
    start: 0,
    end: 5,
  });
  expect(getSurroundingWord('hello world', 3)).toMatchObject({
    start: 0,
    end: 5,
  });
  expect(getSurroundingWord('hello world', 6)).toMatchObject({
    start: 6,
    end: 11,
  });
  // expect(getSurroundingWord('', 3)).toThrowError(new Error(`Argument 'text' should be truthy`));
});
