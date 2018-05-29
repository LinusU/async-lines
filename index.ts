import { Readable } from 'stream'

import asyncChunks = require('async-chunks')

const reBreak = /\r?\n/

if (typeof Symbol.asyncIterator === 'undefined') {
  Object.assign(Symbol, { asyncIterator: Symbol.for('Symbol.asyncIterator') })
}

export = async function * asyncLines (stream: Readable) {
  let buffer = ''

  for await (const chunk of asyncChunks(stream)) {
    buffer += chunk

    for (let pos = buffer.search(reBreak); pos !== -1; pos = buffer.search(reBreak)) {
      yield buffer.slice(0, pos)

      if (buffer[pos] === '\r') {
        buffer = buffer.slice(pos + 2)
      } else {
        buffer = buffer.slice(pos + 1)
      }
    }
  }

  if (buffer.length > 0) yield buffer
}
