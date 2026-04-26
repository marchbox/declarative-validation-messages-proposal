import { expect, test } from "@playwright/test";
import { setBodyHTML } from "./helpers.js";

test.describe("clearedby attribute", () => {
	test("default behavior clears the message when input becomes valid", async ({
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
		await page.getByTestId("email").fill("user@example.com");

		await expect(page.getByTestId("output")).toHaveText("");
	});

	test.fixme("clearedby='none' keeps the message until explicitly cleared", async ({
		page,
	}) => {
		await setBodyHTML(
			page,
			`<form>
					<input id="email" data-testid="email" name="email" type="email" required>
					<output is="validity-output" data-testid="output" for="email" validity clearedby="none"></output>
					<button type="submit" data-testid="submit">Submit</button>
				</form>`,
		);

		await page.getByTestId("submit").click();
		await page.getByTestId("email").fill("user@example.com");

		await expect(page.getByTestId("output")).not.toHaveText("");
	});

	test.fixme("clearedby='input' clears only when value becomes valid", async ({
		page,
	}) => {
		await setBodyHTML(
			page,
			`<form>
					<input id="email" data-testid="email" name="email" type="email" required>
					<output is="validity-output" data-testid="output" for="email" validity clearedby="input"></output>
					<button type="submit" data-testid="submit">Submit</button>
				</form>`,
		);

		const email = page.getByTestId("email");
		const output = page.getByTestId("output");

		await page.getByTestId("submit").click();
		await expect(output).not.toHaveText("");

		await email.fill("still-not-valid");
		await expect(output).not.toHaveText("");

		await email.fill("user@example.com");
		await expect(output).toHaveText("");
	});

	test("clearedby='input-any' clears on any input event", async ({ page }) => {
		await setBodyHTML(
			page,
			`<form>
				<input id="email" data-testid="email" name="email" type="email" required>
				<output is="validity-output" data-testid="output" for="email" validity clearedby="input-any"></output>
				<button type="submit" data-testid="submit">Submit</button>
			</form>`,
		);

		await page.getByTestId("submit").click();
		await page.getByTestId("email").fill("still-not-valid");

		await expect(page.getByTestId("output")).toHaveText("");
	});
});
