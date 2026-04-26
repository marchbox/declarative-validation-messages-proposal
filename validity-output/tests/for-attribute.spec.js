import { expect, test } from "@playwright/test";
import { setBodyHTML } from "./helpers.js";

test.describe("for attribute / control association", () => {
	test("associates with form control via for attribute", async ({ page }) => {
		await setBodyHTML(
			page,
			`<form>
				<input id="email" data-testid="email" name="email" required>
				<output is="validity-output" data-testid="output" for="email" validity></output>
			</form>`,
		);

		const isAssociated = await page
			.getByTestId("output")
			.evaluate(node => node.control === document.getElementById("email"));
		expect(isAssociated).toBe(true);
	});

	test.fixme("htmlFor reflects the for attribute", async ({ page }) => {
		await setBodyHTML(
			page,
			`<form>
				<input id="email" data-testid="email" name="email" required>
				<output is="validity-output" data-testid="output" for="email" validity></output>
			</form>`,
		);

		await expect(page.getByTestId("output")).toHaveJSProperty(
			"htmlFor",
			"email",
		);
	});

	test("re-associates when for attribute changes", async ({ page }) => {
		await setBodyHTML(
			page,
			`<form>
				<input id="a" data-testid="input-a" name="a" required>
				<input id="b" data-testid="input-b" name="b" required>
				<output is="validity-output" data-testid="output" for="a" validity></output>
			</form>`,
		);

		const output = page.getByTestId("output");
		await output.evaluate(node => node.setAttribute("for", "b"));

		const associatedToB = await output.evaluate(
			node => node.control === document.getElementById("b"),
		);
		expect(associatedToB).toBe(true);
	});

	test.fixme("invalid form control adds display element to ariaErrorMessageElements", async ({
		page,
	}) => {
		await setBodyHTML(
			page,
			`<form>
					<input id="email" data-testid="email" name="email" required>
					<output is="validity-output" data-testid="output" for="email" validity></output>
					<button type="submit" data-testid="submit">Submit</button>
				</form>`,
		);

		await page.getByTestId("submit").click();

		const isReferenced = await page
			.getByTestId("email")
			.evaluate(input =>
				(input.ariaErrorMessageElements ?? []).includes(
					document.querySelector("output[is='validity-output']"),
				),
			);
		expect(isReferenced).toBe(true);
	});
});
