const {
  example1,
  example2,
  example3,
  example4,
} = require('./query-string')

describe('query-string', () => {
  describe('example 1', () => {
    const { parse, stringify } = example1
    const cases = [
      { qs: 'foo=bar', obj: { foo: 'bar' } },
      { qs: 'foo=bar&baz=42', obj: { foo: 'bar', baz: '42' } },
      { qs: 'foo=bar&foo=42', obj: { foo: '42' }, reverse: 'foo=42' },
      { qs: 'foo=bar%2C%2042', obj: { foo: 'bar, 42' } },
    ]
    cases.forEach(({ qs, obj, reverse }) => {
      const url = `https://example.com?${qs}`
      describe(url, () => {
        it('should parse', () => {
          expect(parse(url)).toEqual(obj)
        })
        it('should stringify', () => {
          expect(stringify(obj)).toBe(reverse || qs)
        })
      })
    })
  })

  describe('example 2', () => {
    const { parse, stringify } = example2
    const cases = [
      { qs: 'foo=bar', obj: { foo: 'bar' } },
      { qs: 'foo=bar&baz=42', obj: { foo: 'bar', baz: '42' } },
      { qs: 'foo=bar&foo=42', obj: { foo: ['bar', '42'] } },
      { qs: 'foo=bar%2C%2042', obj: { foo: 'bar, 42' } },
    ]
    cases.forEach(({ qs, obj }) => {
      const url = `https://example.com?${qs}`
      describe(url, () => {
        it('should parse', () => {
          expect(parse(url)).toEqual(obj)
        })
        it('should stringify', () => {
          expect(stringify(obj)).toBe(qs)
        })
      })
    })
  })

  describe('example 3', () => {
    const { parse, stringify } = example3
    const cases = [
      { qs: 'foo=bar', obj: { foo: 'bar' } },
      { qs: 'foo=true&baz=42', obj: { foo: true, baz: 42 } },
      { qs: 'foo=false&foo=42', obj: { foo: [false, 42] } },
      { qs: 'foo=bar%2C%2042', obj: { foo: 'bar, 42' } },
    ]
    cases.forEach(({ qs, obj }) => {
      const url = `https://example.com?${qs}`
      describe(url, () => {
        it('should parse', () => {
          expect(parse(url)).toEqual(obj)
        })
        it('should stringify', () => {
          expect(stringify(obj)).toBe(qs)
        })
      })
    })
  })

  describe('example 4', () => {
    const { parse, stringify } = example4
    const buf = Buffer.from('I am groot')
    const str = encodeURIComponent(buf.toString('base64'))
    const cases = [
      {
        qs: '',
        obj: { page: 1, sort: ['title'] },
        reverse: 'page=1&sort=title',
      },
      {
        qs: 'page=foo&extra=bar',
        obj: { page: 1, sort: ['title'] },
        reverse: 'page=1&sort=title',
      },
      {
        qs: `terms=foo%2Fbar,baz&userId=1234&page=3&continuation=${str}&sort=pub%2Frev%20date`,
        obj: {
          terms: ['foo%2Fbar', 'baz'],
          userId: '1234',
          page: 3,
          continuation: buf,
          sort: ['pub/rev date'],
        },
      },
    ]
    cases.forEach(({ qs, obj, reverse }) => {
      const url = `https://example.com?${qs}`
      describe(url, () => {
        it('should parse', () => {
          expect(parse(url)).toEqual(obj)
        })
        it('should stringify', () => {
          expect(stringify(obj)).toBe(reverse || qs)
        })
      })
    })
  })
})
