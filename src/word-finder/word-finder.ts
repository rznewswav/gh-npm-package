/**
 * Returns the first position of the word if it exist
 * in the pool. Otherwise, returns -1
 * @param pool The string to find the word
 * @param token The word to find
 */
export function wordFinder(pool: string, token: string): number {
  return pool.indexOf(token) ?? -1;
}
