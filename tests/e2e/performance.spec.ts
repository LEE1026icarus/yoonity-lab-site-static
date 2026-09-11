import { expect, test } from "@playwright/test";

test("home uses a stable system font stack without web-font replacement", async ({ page }) => {
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

  expect(fontState.headingFamily).toContain("-apple-system");
  expect(fontState.fontFaces).toHaveLength(0);
});
