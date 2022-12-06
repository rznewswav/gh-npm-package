export function wordToPascal(word: string): string {
  return word
    .split(' ')
    .map((e) => e.at(0).toLocaleUpperCase('en-gb') + e.slice(1))
    .join('');
}
