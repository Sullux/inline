/**********************************************************
Simplest Possible Implementation
***********************************************************/

const example1 = (() => {
  const parse = (url) =>
    Object.fromEntries(url.substring(url.indexOf('?') + 1)
      .split('&')
      .map((kv) => kv.split('='))
      .map(([k, v]) => ([decodeURIComponent(k), decodeURIComponent(v)])))

  const stringify = (obj) =>
    Object.entries(obj)
      .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`)
      .join('&')

  return { parse, stringify }
})()

/**********************************************************
With Arrays
***********************************************************/

const example2 = (() => {
  const parse = (url) =>
    url.substring(url.indexOf('?') + 1)
      .split('&')
      .map((kv) => kv.split('='))
      .map(([k, v]) => ([decodeURIComponent(k), decodeURIComponent(v)]))
      .reduce(
        (result, [k, v]) => ({
          ...result,
          ...{ [k]: k in result ? [result[k], v].flat() : v },
        }),
        {},
      )

  const stringify = (obj) =>
    Object.entries(obj)
      .map(([k, v]) => Array.isArray(v) ? v.map((ve) => ([k, ve])) : [[k, v]])
      .flat()
      .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`)
      .join('&')

  return { parse, stringify }
})()

/**********************************************************
With Arrays And Type Detection
***********************************************************/

const example3 = (() => {
  const numberOrFallback = (value, fallback) => Number.isNaN(value)
    ? fallback
    : value

  const maybeType = (value) => value === 'true'
    ? true
    : value === 'false'
      ? false
      : numberOrFallback(Number(value), value)

  const decoded = (value) => maybeType(decodeURIComponent(value))

  const parse = (url) =>
    url.substring(url.indexOf('?') + 1)
      .split('&')
      .map((kv) => kv.split('='))
      .map(([k, v]) => ([decodeURIComponent(k), decoded(v)]))
      .reduce(
        (result, [k, v]) => ({
          ...result,
          ...{ [k]: k in result ? [result[k], v].flat() : v },
        }),
        {},
      )

  const stringify = (obj) =>
    Object.entries(obj)
      .map(([k, v]) => Array.isArray(v) ? v.map((ve) => ([k, ve])) : [[k, v]])
      .flat()
      .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`)
      .join('&')

  return { parse, stringify }
})()

/**********************************************************
With Per-Property Handling
***********************************************************/

const example4 = (() => {
  const numberOrFallback = (value, fallback) => Number.isNaN(value)
    ? fallback
    : value

  const returnUndefined = () => {}
  const notMissingValue = ([, value]) => value !== undefined

  const parsers = {
    terms: (value) => value.split(','),
    userId: decodeURIComponent,
    page: (value) => numberOrFallback(Number(value), 1),
    continuation: (value) => Buffer.from(decodeURIComponent(value), 'base64'),
    sort: (value) => value.split(',').map(decodeURIComponent),
    default: returnUndefined,
  }

  const parsedValue = (key, value) => ([
    key,
    (parsers[key] || parsers.default)(value),
  ])

  const parsedEntry = ([key, value]) =>
    parsedValue(decodeURIComponent(key), value)

  const parse = (url) => ({
    page: 1,
    sort: ['title'],
    ...Object.fromEntries(url.substring(url.indexOf('?') + 1)
      .split('&')
      .map((kv) => kv.split('='))
      .map(parsedEntry)
      .filter(notMissingValue)),
  })

  const stringifiers = {
    terms: (value) => value.join(','),
    userId: encodeURIComponent,
    page: encodeURIComponent,
    continuation: (value) => encodeURIComponent(value.toString('base64')),
    sort: (value) => value.map(encodeURIComponent).join(','),
    default: returnUndefined,
  }

  const stringify = (obj) => Object.entries(obj)
    .map(([key, value]) =>
      ([key, (stringifiers[key] || stringifiers.default)(value)]))
    .filter(notMissingValue)
    .map((entry) => entry.join('='))
    .join('&')

  return { parse, stringify }
})()

module.exports = {
  example1,
  example2,
  example3,
  example4,
}
