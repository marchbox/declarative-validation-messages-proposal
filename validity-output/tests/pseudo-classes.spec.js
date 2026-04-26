import { expect, test } from "@playwright/test";
import { setBodyHTML } from "./helpers.js";

test.describe(":valid / :invalid pseudo classes", () => {
	test.fixme("display element matches :invalid when control is invalid", async ({
		page,
	}) => {
		await setBodyHTML(
			page,
			`<form>
				<input id="email" data-testid="email" name="email" type="email" required>
				<output is="validity-output" data-testid="output" for="email" validity></output>
				<button type="submit" data-testid="submit">Submit</button>
			</form>`,
		);

		await page.getByTestId("submit").click();

		await expect(
			page.getByTestId("output").locator(":scope:invalid"),
		).toHaveCount(1);
		await expect(
			page.getByTestId("output").locator(":scope:valid"),
		).toHaveCount(0);
	});

	test.fixme("display element matches :valid when control is valid", async ({
		page,
	}) => {
		await setBodyHTML(
			page,
			`<form>
				<input id="email" data-testid="email" name="email" type="email" required>
				<output is="validity-output" data-testid="output" for="email" validity></output>
				<button type="submit" data-testid="submit">Submit</button>
			</form>`,
		);

		await page.getByTestId("email").fill("user@example.com");
		await page.getByTestId("submit").click();

		await expect(
			page.getByTestId("output").locator(":scope:valid"),
		).toHaveCount(1);
		await expect(
			page.getByTestId("output").locator(":scope:invalid"),
		).toHaveCount(0);
	});

	test.fixme("display element matches :disabled when control is disabled", async ({
		page,
	}) => {
		await setBodyHTML(
			page,
			`<form>
				<input id="email" data-testid="email" name="email" type="email" required disabled>
				<output is="validity-output" data-testid="output" for="email" validity></output>
			</form>`,
		);

		await expect(
			page.getByTestId("output").locator(":scope:disabled"),
		).toHaveCount(1);
	});

	test("display element loses :disabled when control is re-enabled", async ({
		page,
	}) => {
		await setBodyHTML(
			page,
			`<form>
				<input id="email" data-testid="email" name="email" type="email" required disabled>
				<output is="validity-output" data-testid="output" for="email" validity></output>
			</form>`,
		);

		await page.getByTestId("email").evaluate(node => {
			node.disabled = false;
		});

		await expect(
			page.getByTestId("output").locator(":scope:disabled"),
		).toHaveCount(0);
	});
});
