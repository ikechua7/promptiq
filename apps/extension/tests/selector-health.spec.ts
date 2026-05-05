import { test, expect } from "@playwright/test";

const SELECTORS = [
  { sel: '[data-testid="chat-input"]',                  name: "claude-testid" },
  { sel: ".tiptap.ProseMirror",                         name: "tiptap" },
  { sel: 'div[contenteditable="true"][role="textbox"]', name: "aria-textbox" },
  { sel: '[contenteditable="true"]',                    name: "contenteditable" },
  { sel: "textarea",                                    name: "textarea" },
];

test("Claude.ai prompt input is detectable", async ({ page }) => {
  await page.goto("https://claude.ai/new", { waitUntil: "networkidle" });

  let matched: string | null = null;

  for (const { sel, name } of SELECTORS) {
    const el = page.locator(sel).first();
    const count = await el.count();
    if (count > 0) {
      matched = name;
      console.log(`✓ Matched selector: ${name} (${sel})`);
      break;
    } else {
      console.log(`✗ No match: ${name} (${sel})`);
    }
  }

  // Report which selector tier we fell back to
  if (matched) {
    console.log(`\nActive selector tier: ${matched}`);
    if (matched !== "claude-testid") {
      console.warn(`⚠️  Primary selector broken — fell back to: ${matched}. Update content script.`);
    }
  }

  expect(matched).not.toBeNull();
});

test("Claude.ai input accepts text", async ({ page }) => {
  await page.goto("https://claude.ai/new", { waitUntil: "networkidle" });

  // Try each selector until one works
  for (const { sel, name } of SELECTORS) {
    const el = page.locator(sel).first();
    if (await el.count() === 0) continue;

    await el.click();
    await el.type("Act as a test — selector health check");
    await page.waitForTimeout(500);

    const text = await el.innerText().catch(() =>
      page.evaluate((s) => (document.querySelector(s) as HTMLInputElement)?.value ?? "", sel)
    );

    expect(text).toContain("selector health check");
    console.log(`✓ Input works via: ${name}`);
    return;
  }

  throw new Error("No selector matched — extension will be broken on Claude.ai");
});
