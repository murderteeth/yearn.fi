type ClassValue = string | null | undefined | Record<string, boolean | undefined>

/**
 * Joins the given classes into a single string.
 * @example cl('foo', 'bar') // 'foo bar'
 * @example cl('foo', false && 'bar') // 'foo'
 *
 * @param classes the classes to be joined
 * @returns the joined classes
 */
export function cl(...classes: ClassValue[]): string {
  return classes
    .flatMap((entry) => {
      if (!entry) {
        return []
      }

      if (typeof entry === 'string') {
        return [entry]
      }

      return Object.entries(entry)
        .filter(([, shouldInclude]) => shouldInclude)
        .map(([className]) => className)
    })
    .join(' ')
}
