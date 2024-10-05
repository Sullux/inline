const { splitOnFirst } = require('./split-on-first')

const cases = [
  {
    name: 'no match',
    str: 'foo bar',
    char: '*',
    expected: ['foo bar'],
  },
  {
    name: 'a single char',
    str: 'foo bar baz',
    char: ' ',
    expected: ['foo', 'bar baz'],
  },
  {
    name: 'multiple chars',
    str: 'foo--bar--baz',
    char: '--',
    expected: ['foo', 'bar--baz'],
  },
]

describe('split-on-first', () => {
  cases.forEach(({ name, str, char, expected }) => it(`should split on ${name}`, () => {
    expect(splitOnFirst(str, char)).toEqual(expected)
  }))
})
