const assert = require('assert')
const fs = require('fs')
const { Readable } = require('stream')

const asyncLines = require('./')

async function test () {
  {
    const actual = []
    const expected = fs.readFileSync(__filename).toString().replace(/\r?\n$/, '').split(/\r?\n/g)

    for await (const line of asyncLines(fs.createReadStream(__filename))) {
      actual.push(line)
    }

    assert.deepStrictEqual(actual, expected)
  }

  {
    const actual = []
    const expected = ['line1', 'line2', 'line3']
    const stream = new Readable({ read () { this.push('line1\r\nline2\r\nline3\r\n'); this.push(null) } })

    for await (const line of asyncLines(stream)) {
      actual.push(line)
    }

    assert.deepStrictEqual(actual, expected)
  }

  {
    const actual = []
    const expected = ['line1', 'line2', 'line3']
    const stream = new Readable({ read () { this.push('line1\r\nline2\r\nline3'); this.push(null) } })

    for await (const line of asyncLines(stream)) {
      actual.push(line)
    }

    assert.deepStrictEqual(actual, expected)
  }

  {
    const actual = []
    const expected = ['line1', 'line2', 'line3']
    const stream = new Readable({ read () { this.push('line1\nline2\r\nline3'); this.push(null) } })

    for await (const line of asyncLines(stream)) {
      actual.push(line)
    }

    assert.deepStrictEqual(actual, expected)
  }
}

test().catch((err) => {
  process.exitCode = 1
  console.error(err.stack)
})
