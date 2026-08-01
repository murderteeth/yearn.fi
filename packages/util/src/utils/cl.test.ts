import { cl } from '@yearn/util/utils/cl'
import { describe, expect, it } from 'vitest'

describe('cl', () => {
  it('joins string classes with a single space', () => {
    expect(cl('foo', 'bar')).toBe('foo bar')
  })

  it('drops falsy entries', () => {
    expect(cl('foo', null, undefined, '')).toBe('foo')
  })

  it('keeps only the truthy keys of a record', () => {
    expect(cl('foo', { bar: true, baz: false, qux: undefined })).toBe('foo bar')
  })

  it('preserves argument order across strings and records', () => {
    expect(cl({ a: true }, 'b', { c: true })).toBe('a b c')
  })

  it('returns an empty string when nothing survives', () => {
    expect(cl(undefined, { a: false })).toBe('')
  })
})
