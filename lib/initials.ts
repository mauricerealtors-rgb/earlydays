/**
 * Initials for a school with no photograph.
 *
 * 121 of the 203 schools in the directory have no photo we can attribute to
 * them, and a stock classroom would be a lie on a page whose whole argument is
 * that the information is real. So those cards get a coloured tile instead —
 * but a tile carrying the school's initials, not a generic glyph, because
 * otherwise every preschool in an area renders identically and the page reads
 * as a template rather than a directory.
 *
 * Skips the words that would otherwise make half of Ghana's schools "IS".
 */
const SKIP = new Set([
  "the", "and", "of", "for", "at", "a", "an",
  "school", "schools", "international", "academy", "centre", "center",
  "preschool", "pre-school", "kindergarten", "montessori", "creche", "crèche",
  "daycare", "day", "care", "educational", "education", "complex", "limited",
  "ltd", "gh", "ghana", "learning", "children", "kids", "child",
]);

export function schoolInitials(name: string): string {
  const words = name
    .replace(/[^\p{L}\p{N}\s'-]/gu, " ")
    .split(/[\s-]+/)
    .filter(Boolean);

  const strong = words.filter((w) => !SKIP.has(w.toLowerCase()));
  const source = strong.length ? strong : words;

  const letters = source
    .slice(0, 3)
    .map((w) => w[0]?.toUpperCase())
    .filter(Boolean);

  // A single distinctive word gives its first two letters rather than one, so
  // "Bambino" reads "Ba" instead of a lonely "B".
  if (letters.length === 1 && source[0] && source[0].length > 1) {
    return (source[0][0] + source[0][1].toLowerCase()).toUpperCase();
  }
  return letters.join("") || name.slice(0, 2).toUpperCase();
}
