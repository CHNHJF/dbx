// Zero-width and other invisible characters (U+200B ZERO WIDTH SPACE,
// U+200C/ZWNJ, U+200D/ZWJ, U+2060 WORD JOINER, U+FEFF BOM) can ride along when
// a credential is pasted from web pages or rich-text sources. They survive
// String.trim() — not ASCII whitespace — and turn a visually identical
// password into a different secret, so the connection fails with "incorrect
// username/password" (#9043). Strip them from credential fields before save.
const INVISIBLE_CHARACTERS = /[\u200B\u200C\u200D\u2060\uFEFF]/g;

export function stripInvisibleCharacters(value: string | undefined): string | undefined {
  if (value === undefined) return undefined;
  return value.replace(INVISIBLE_CHARACTERS, "");
}
