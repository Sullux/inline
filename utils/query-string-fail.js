/**********************************************************
compare to https://www.npmjs.com/package/query-string
***********************************************************/

/* NOTE:
Use this implenetation at your peril. I did not even have the heart to unit test
this mess, so it may not even work. And if it _does_ work, I have no guarantee
that it has parity with the existing library without unit testing that library.

Even in a functional style trying to name things in the clearest possible way,
this code is still a tangled web of inscrutability. That is a clear signal that
A GENERALIZED SOLUTION IS NOT A GOOD FIT FOR THIS PROBLEM SPACE!

Use this code if you want, but I strongly recommend a more bespoke solution for
your use case as in my other examples.
*/

const pipeline = (...steps) =>
  (input) => steps.reduce(
    (state, step) => step(state),
    input,
  )

const numberOrFallback = (value, fallback) =>
  ((typeof value) === 'number') && (!Number.isNaN(value))
    ? value
    : fallback

const maybeNumber = (input) =>
  numberOrFallback(Number(input), input)

const maybeBoolean = (input) =>
  input === 'true' ? true : input === 'false' ? false : input

const stringAfter = (delimiter = '?') =>
  (input) => input.substring(input.indexOf(delimiter) + 1)

const splitBy = (delimiter = ',') =>
  (input) => input.split(delimiter)

const stringToEntries = (entryDelimiter = '&', keyValueDelimiter = '=') =>
  (input) => input.split(entryDelimiter)
    .map((entry) => entry.split(keyValueDelimiter))

const mappingPipeline = (...functions) =>
  (input) =>
    functions.filter((fn) => !!fn).reduce(
      (result, fn) => Array.isArray(result) ? result.map(fn) : fn(result),
      input,
    )

const valuePipeline = (options) => pipeline(
  options.decode && decodeURIComponent,
  options.separator && splitBy(options.separator),
  options.parseNumbers && maybeNumber,
  options.parseBooleans && maybeBoolean,
)

const mutatedArray = (array, value, index) => {
  array[index] = value
  return array
}

const indexedEntries = (entries) => entries.reduce(
  ({ entries, indexed }, [key, value, index = -1]) =>
    index < 0
      ? { entries: [...entries, [key, value]], indexed }
      : {
          entries,
          indexed: {
            ...indexed,
            [key]: mutatedArray(indexed[key] || [], value, index),
          },
        },
  { entries: [], indexed: {} },
)

const toObject = ({ entries, indexed }) => entries.reduce(
  (result, [key, value]) => ({
    ...result,
    ...{ [key]: key in result ? [result[key], value].flat() : value },
  }),
  indexed,
)

const withParsedValue = (parsedValue, parsedValueByKey) =>
  ([key, value, index]) => ([
    key,
    (parsedValueByKey[key] || parsedValue)(value),
    index,
  ])

const queryStringAndValuesParser = (
  withDecodedKeys,
  parsedValue,
  parsedValueByKey,
  sort,
) =>
  pipeline(
    stringAfter('?'),
    stringAfter('#'),
    stringToEntries('&', '='),
    mappingPipeline(
      withDecodedKeys,
      withParsedValue(parsedValue, parsedValueByKey),
    ),
    sort,
    indexedEntries,
    toObject,
  )

const valueTypePipeline = (type, options) =>
  (typeof type) === 'function'
    ? type
    : pipeline(
      options.decode && decodeURIComponent,
      options.separator && splitBy(options.separator),
      type.startsWith('number') && maybeNumber,
    )

const typesToFunctions = (types, options) =>
  Object.entries(types).reduce(
    (state, [key, value]) => ({
      ...state,
      [key]: valueTypePipeline(value, options),
    }),
    {},
  )

const indexFromKey = (key) => maybeNumber(key.match(/\[([0-9]*)]/)[1])

const keyDecoders = {
  bracket: ([key, value]) => ([key.replace('[]'), value]),
  index: ([key, value]) => key.includes('[')
    ? [key.replace(/\[[0-9]*]/g), value, indexFromKey(key)]
    : [key, value],
  'colon-list-separator': ([key, value]) => ([key.replace(':list'), value]),
}
keyDecoders['bracket-separator'] = keyDecoders.bracket

const decodedKeys = ({ decode, arrayFormat }) => decode
  ? keyDecoders[arrayFormat]
  : pipeline(
    ([key, value]) => ([decodeURIComponent(key), value]),
    keyDecoders[arrayFormat],
  )

const compareEntries = ([key1], [key2]) => key1.localeCompare(key2)

const queryStringParser = ({ types, sort, ...options }) =>
  queryStringAndValuesParser(
    decodedKeys(options),
    valuePipeline(options),
    types
      ? typesToFunctions(types, options)
      : {},
    (typeof sort) === 'function'
      ? sort
      : sort && compareEntries,
  )

const maybeWithSeparator = ({ arrayFormat, arrayFormatSeparator, ...rest }) =>
  ['comma', 'separator', 'bracket-separator'].includes(arrayFormat)
    ? { separator: arrayFormatSeparator, ...rest }
    : { arrayFormat, ...rest }

const defaultOptions = {
  decode: true,
  arrayFormat: 'none',
  arrayFormatSeparator: ',',
  sort: true,
  parseNumbers: false,
  parseBooleans: false,
  types: {},
}

const parseOptions = (options) =>
  maybeWithSeparator({ ...defaultOptions, ...options })

const parse = (queryString, options = {}) =>
  queryStringParser(parseOptions(options))(queryString)

module.exports = {
  parse,
}
