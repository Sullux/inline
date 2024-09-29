/**********************************************************
compare to https://www.npmjs.com/package/type-name
***********************************************************/

const typeOrConstructorName = (value, name) =>
  name === 'object'
    ? value.constructor?.name || ''
    : name

const typeName = (value) =>
  value === null
    ? 'null'
    : typeOrConstructorName(value, typeof value)

/**********************************************************
my preferred implementation
***********************************************************/

const constructorName = (value) =>
  value === undefined
    ? 'Undefined'
    : value === null
      ? 'Null'
      : value.constructor?.name || 'Any'

module.exports = {
  constructorName,
  typeName,
}
