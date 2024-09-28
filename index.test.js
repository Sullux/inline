const { showMessage } = require('./')

describe('index', () => {
  it('should export a message function', () => {
    expect(showMessage()).toBe(undefined)
  })
})
