/**********************************************************
compare to https://www.npmjs.com/package/filter-obj
24K installed
***********************************************************/

const isFunction = (value) => (typeof value) === 'function'

const includeKeys = (source, filter) => Object.fromEntries(isFunction(filter)
  ? Object.entries(source).filter(([key, value]) => filter(key, value))
  : Object.entries(source).filter(([key]) => filter.includes(key)))

const excludeKeys = (source, filter) => Object.fromEntries(isFunction(filter)
  ? Object.entries(source).filter(([key, value]) => !filter(key, value))
  : Object.entries(source).filter(([key]) => !filter.includes(key)))

module.exports = { includeKeys, excludeKeys }
