/**********************************************************
compare to https://www.npmjs.com/package/split-on-first
24K installed
***********************************************************/

const splitAt = (str, offset, length) => offset < 0
  ? [str]
  : [str.substring(0, offset), str.substring(offset + length)]

const splitOnFirst = (str, char) =>
  splitAt(str, str.indexOf(char), char.length)

module.exports = { splitOnFirst }
