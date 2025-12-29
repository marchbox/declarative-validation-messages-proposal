import { expect, test } from "@playwright/test";

test.describe("validity-output", () => {
	test.beforeEach(async ({ page }) => {
		await page.goto("/");
	});

	test("should associate to form control element", async ({ page }) => {
		const element = page.locator("output[for='email']");

		const isAssociated = await element.evaluate(node => {
			return node.control === document.getElementById("email");
		});

		expect(isAssociated).toBe(true);
	});
});
