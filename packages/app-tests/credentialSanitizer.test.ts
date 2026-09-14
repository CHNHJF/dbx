import { strict as assert } from "node:assert";
import { describe, it } from "vitest";
import { stripInvisibleCharacters } from "../../apps/desktop/src/lib/connection/credentialSanitizer.ts";

describe("stripInvisibleCharacters", () => {
  it("strips zero-width characters that survive trim()", () => {
    // U+200B ZERO WIDTH SPACE, U+FEFF BOM: invisible but not whitespace, so
    // trim() keeps them and the stored secret silently differs from the typed
    // one (#9043).
    assert.equal(stripInvisibleCharacters("secret\u200B"), "secret");
    assert.equal(stripInvisibleCharacters("\uFEFFsecret"), "secret");
    assert.equal(stripInvisibleCharacters("se\u200Ccre\u200Dt"), "secret");
    assert.equal(stripInvisibleCharacters("se\u2060cret"), "secret");
  });

  it("keeps meaningful characters, including whitespace and special symbols", () => {
    assert.equal(stripInvisibleCharacters("p@ss & !word *^#"), "p@ss & !word *^#");
    assert.equal(stripInvisibleCharacters(" leading and trailing "), " leading and trailing ");
    assert.equal(stripInvisibleCharacters("tab\tinside"), "tab\tinside");
  });

  it("passes through undefined and empty strings", () => {
    assert.equal(stripInvisibleCharacters(undefined), undefined);
    assert.equal(stripInvisibleCharacters(""), "");
    assert.equal(stripInvisibleCharacters("\u200B"), "");
  });
});
