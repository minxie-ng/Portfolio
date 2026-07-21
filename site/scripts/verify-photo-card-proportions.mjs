import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

const homepagePath = fileURLToPath(new URL("../app/page.tsx", import.meta.url));
const source = readFileSync(homepagePath, "utf8");
const aboutStart = source.indexOf("ref={aboutJournalRef}");
const aboutEnd = source.indexOf("{/* ✅ Divider BELOW About */}", aboutStart);

assert.notEqual(aboutStart, -1, "Missing About journal composition");
assert.notEqual(aboutEnd, -1, "Missing About composition boundary");

const aboutSource = source.slice(aboutStart, aboutEnd);
const equalColumns = aboutSource.match(/lg:col-span-6/g) ?? [];

assert.equal(equalColumns.length, 2, "Photo and Field Notes must each span six desktop columns");
assert.doesNotMatch(aboutSource, /lg:col-span-(?:5|7)/, "Unequal desktop About columns remain");
assert.match(
  aboutSource,
  /ref=\{photoBlockInnerRef\}[\s\S]{0,180}h-\[20\.5rem\][\s\S]{0,80}sm:h-\[20rem\][\s\S]{0,80}lg:aspect-\[4\/3\][\s\S]{0,80}lg:h-auto/,
  "Desktop photo media must use 4:3 while preserving mobile and tablet heights",
);

for (const behavior of [
  "onClick={handlePhotoAction}",
  "onMouseEnter={isTouchMobile ? undefined : startPhotoPreview}",
  "onFocus={isTouchMobile ? undefined : startPhotoPreview}",
  "style={photoRollStyle}",
]) {
  assert.ok(aboutSource.includes(behavior), `Missing preserved photo behavior: ${behavior}`);
}

console.log("Photo card proportion contract passed.");
