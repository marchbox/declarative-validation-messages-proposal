import { expect, test } from "@playwright/test";
import { setBodyHTML } from "./helpers.js";

test.describe("validity attribute / validityList property", () => {
	test.fixme("validityList reflects the validity attribute as a token list", async ({
		page,
	}) => {
		await setBodyHTML(
			page,
			`<form>
					<input id="email" data-testid="email" name="email" type="email" required>
					<output is="validity-output" data-testid="output" for="email" validity="valuemissing typemismatch"></output>
				</form>`,
		);

		const tokens = await page
			.getByTestId("output")
			.evaluate(node => Array.from(node.validityList));
		expect(tokens).toEqual(["valuemissing", "typemismatch"]);
	});

	test.fixme("validity attribute tokens are case-insensitive", async ({
		page,
	}) => {
		await setBodyHTML(
			page,
			`<form>
				<input id="email" data-testid="email" name="email" type="email" required>
				<output is="validity-output" data-testid="output" for="email" validity="valueMissing TypeMismatch"></output>
			</form>`,
		);

		const contains = await page.getByTestId("output").evaluate(node => ({
			valueMissing: node.validityList.contains("valuemissing"),
			typeMismatch: node.validityList.contains("typemismatch"),
		}));
		expect(contains).toEqual({ valueMissing: true, typeMismatch: true });
	});

	test.fixme("validityList updates when validity attribute changes", async ({
		page,
	}) => {
		await setBodyHTML(
			page,
			`<form>
				<input id="email" data-testid="email" name="email" type="email" required>
				<output is="validity-output" data-testid="output" for="email" validity="valuemissing"></output>
			</form>`,
		);

		const output = page.getByTestId("output");
		await output.evaluate(node =>
			node.setAttribute("validity", "typemismatch patternmismatch"),
		);

		const tokens = await output.evaluate(node => Array.from(node.validityList));
		expect(tokens).toEqual(["typemismatch", "patternmismatch"]);
	});

	test("boolean validity attribute matches any validity", async ({ page }) => {
		await setBodyHTML(
			page,
			`<form>
				<input id="email" data-testid="email" name="email" type="email" required>
				<output is="validity-output" data-testid="output" for="email" validity></output>
			</form>`,
		);

		const length = await page
			.getByTestId("output")
			.evaluate(node => node.validityList.length);
		expect(length).toBe(0);
	});
});
