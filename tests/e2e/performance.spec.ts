import { expect, test } from "@playwright/test";

test("home loads Pretendard through unicode-ranged dynamic subsets", async ({ page }) => {
  await page.goto("/");
  await page.evaluate(() => document.fonts.ready);

  const fontState = await page.evaluate(() => {
    const fontFaces: Array<{ family: string; unicodeRange: string }> = [];

    const collectFontFaces = (rules: CSSRuleList) => {
      for (const rule of Array.from(rules)) {
        if (rule instanceof CSSFontFaceRule) {
          fontFaces.push({
            family: rule.style.fontFamily.replaceAll('"', "").replaceAll("'", ""),
            unicodeRange: rule.style.getPropertyValue("unicode-range"),
          });
          continue;
        }

        if ("cssRules" in rule) {
          collectFontFaces((rule as CSSGroupingRule).cssRules);
        }
      }
    };

    for (const stylesheet of Array.from(document.styleSheets)) {
      collectFontFaces(stylesheet.cssRules);
    }

    return {
      fontFaces: fontFaces.filter(({ family }) => family === "Pretendard Variable"),
      headingFamily: getComputedStyle(document.querySelector("h1")!).fontFamily,
    };
  });

  expect(fontState.headingFamily).toContain("Pretendard Variable");
  expect(fontState.fontFaces.length).toBeGreaterThan(10);
  expect(fontState.fontFaces.every(({ unicodeRange }) => unicodeRange.length > 0)).toBe(true);
});
