import { expect, test } from "@playwright/test";
import { setContent } from "./utils.js";

test("should display any built-in validation messages", async ({ page }) => {
	const input = page.getByTestId("input");
	const output = page.getByTestId("output");
	const submitter = page.getByTestId("submitter");

	await setContent(
		page,
		`
    <form>
      <input
      	type="email"
      	id="email"
      	name="email"
      	required
      	data-testid="input"
      >
      <output
        for="email"
        is="validity-output"
        validity
        data-testid="output"
      ></output>
      <button data-testid="submitter">submit</button>
    </form>
	  `,
	);

	await submitter.click();

	await expect(output).toHaveText(
		await input.evaluate(node => node.validationMessage),
	);

	await input.fill("invalidemail");

	await submitter.click();

	await expect(output).toHaveText(
		await input.evaluate(node => node.validationMessage),
	);
});

test("should display built-in validation message for given validity", async ({
	page,
}) => {
	const input = page.getByTestId("input");
	const output = page.getByTestId("output");
	const submitter = page.getByTestId("submitter");

	await setContent(
		page,
		`
    <form>
      <input
      	type="email"
      	id="email"
      	name="email"
      	required
      	data-testid="input"
      >
      <output
        for="email"
        is="validity-output"
        validity="valuemissing"
        data-testid="output"
      ></output>
      <button data-testid="submitter">submit</button>
    </form>
	  `,
	);

	await submitter.click();

	await expect(output).toHaveText(
		await input.evaluate(node => node.validationMessage),
	);

	await input.fill("invalidemail");

	await submitter.click();

	await expect(output).toHaveText("");
});

test("should display built-in validation messages for given validities", async ({
	page,
}) => {
	const input = page.getByTestId("input");
	const output = page.getByTestId("output");
	const submitter = page.getByTestId("submitter");

	await setContent(
		page,
		`
    <form>
      <input
      	type="email"
      	id="email"
      	name="email"
      	required
      	data-testid="input"
      >
      <output
        for="email"
        is="validity-output"
        validity="valuemissing typemismatch"
        data-testid="output"
      ></output>
      <button data-testid="submitter">submit</button>
    </form>
	  `,
	);

	await submitter.click();

	await expect(output).toHaveText(
		await input.evaluate(node => node.validationMessage),
	);

	await input.fill("invalidemail");

	await submitter.click();

	await expect(output).toHaveText(
		await input.evaluate(node => node.validationMessage),
	);
});
