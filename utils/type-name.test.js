/* eslint-disable no-new-wrappers, prefer-regex-literals */
const {
  constructorName,
  typeName,
} = require('./type-name')

function Foo () {}

const typeNameCases = [
  { name: 'undefined', values: [undefined] },
  { name: 'null', values: [null] },
  { name: 'string', values: ['', 'foo'] },
  { name: 'String', values: [new String('foo')] },
  { name: 'number', values: [5, NaN, Number.NaN, Infinity] },
  { name: 'boolean', values: [true, false] },
  { name: 'function', values: [() => {}] },
  { name: 'RegExp', values: [/foo/, new RegExp('foo')] },
  { name: 'symbol', values: [Symbol('foo')] },
  { name: 'Foo', values: [new Foo()] },
  { name: '', values: [{ constructor: undefined }] },
]

const constructorNameCases = [
  { name: 'Undefined', values: [undefined] },
  { name: 'Null', values: [null] },
  { name: 'String', values: ['', 'foo', new String('foo')] },
  { name: 'Number', values: [5, NaN, Number.NaN, Infinity] },
  { name: 'Boolean', values: [true, false] },
  { name: 'Function', values: [() => {}] },
  { name: 'RegExp', values: [/foo/, new RegExp('foo')] },
  { name: 'Symbol', values: [Symbol('foo')] },
  { name: 'Foo', values: [new Foo()] },
  { name: 'Any', values: [{ constructor: undefined }] },
]

describe('type-name', () => {
  describe('typeName', () => {
    typeNameCases.forEach(({ name, values }) =>
      it(`should name ${name || 'missing constructor'}`, () => {
        values.forEach((value) => expect(typeName(value)).toBe(name))
      }))
  })

  describe('constructorName', () => {
    constructorNameCases.forEach(({ name, values }) =>
      it(`should name ${name}`, () => {
        values.forEach((value) => expect(constructorName(value)).toBe(name))
      }))
  })
})
