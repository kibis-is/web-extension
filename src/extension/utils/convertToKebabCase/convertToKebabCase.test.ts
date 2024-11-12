// utils
import convertToKebabCase from './convertToKebabCase';

interface ITestParams {
  expected: string;
  input: string;
}

describe('convertToKebabCase()', () => {
  it.each<ITestParams>([
    {
      expected: 'lowercase',
      input: 'lowercase',
    },
    {
      expected: 'capital',
      input: 'Capital',
    },
    {
      expected: 'pascal-case',
      input: 'PascalCase',
    },
    {
      expected: 'title-case',
      input: 'Title Case',
    },
    {
      expected: 'cases-with-apostrophe',
      input: `Cases' with apostrophe`,
    },
    {
      expected: 'special-symbols',
      input: 'Special symbols!!!',
    },
  ])(`should convert "$input" to "$expected"`, ({ expected, input }) => {
    expect(convertToKebabCase(input)).toBe(expected);
  });
});
