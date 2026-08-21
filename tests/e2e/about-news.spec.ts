import { expect, test } from "@playwright/test";

const firstNewsTitle = "한기대, '생성형 AI 활용 교육 혁신 우수사례 공모전 발표회' 개최";

test("About news disclosure hydrates accessibly and keeps all links in the DOM", async ({ page }) => {
  await page.goto("/about");

  const articles = page.locator("#about-news-list article");
  const disclosure = page.locator('button[aria-controls="about-news-list"]');

  await expect(articles).toHaveCount(6);
  await expect(articles.nth(3)).toBeHidden();
  await expect(disclosure).toHaveAttribute("aria-expanded", "false");

  await disclosure.click();
  await expect(articles.nth(3)).toBeVisible();
  await expect(disclosure).toHaveAttribute("aria-expanded", "true");

  await disclosure.click();
  await expect(articles.nth(3)).toBeHidden();
  await expect(disclosure).toHaveAttribute("aria-expanded", "false");
});

test("news details expose breadcrumbs and NewsArticle JSON-LD", async ({ page }) => {
  await page.goto("/about");
  await page.getByRole("link", { name: firstNewsTitle, exact: true }).click();

  await expect(page).toHaveURL(/\/news\/genai-edu-award-2024$/);
  await expect(page.getByRole("heading", { level: 1 })).toContainText(firstNewsTitle);
  await expect(page.getByRole("navigation", { name: "현재 위치" })).toContainText("연구실 소식");

  const schemas = await page.locator('script[type="application/ld+json"]').evaluateAll((scripts) =>
    scripts.map((script) => JSON.parse(script.textContent ?? "{}")),
  );
  expect(schemas.some((schema) => schema["@type"] === "NewsArticle")).toBe(true);
  expect(schemas.some((schema) => schema["@type"] === "BreadcrumbList")).toBe(true);
});

test("unknown news slugs return a crawlable 404", async ({ request }) => {
  const response = await request.get("/news/does-not-exist");

  expect(response.status()).toBe(404);
});
