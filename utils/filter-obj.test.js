const { includeKeys, excludeKeys } = require('./filter-obj')

const obj = {
  foo: 42,
  bar: 'baz',
}

describe('filter-object', () => {
  it('should include by function', () => {
    expect(includeKeys(obj, (k, v) => (k === 'foo') && (v === 42)))
      .toEqual({ foo: 42 })
  })

  it('should include by array', () => {
    expect(includeKeys(obj, ['foo']))
      .toEqual({ foo: 42 })
  })

  it('should exclude by function', () => {
    expect(excludeKeys(obj, (k, v) => (k === 'foo') && (v === 42)))
      .toEqual({ bar: 'baz' })
  })

  it('should exclude by array', () => {
    expect(excludeKeys(obj, ['foo']))
      .toEqual({ bar: 'baz' })
  })
})
