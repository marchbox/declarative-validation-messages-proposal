/**
 * Display content matrix from PROPOSAL.md "How it works":
 *
 * | Child content | validity attr w/ values? | Control validity required | Displayed content |
 * |:-|:-|:-|:-|
 * | Empty       | No  | Any invalid                  | Built-in validation message       |
 * | Empty       | Yes | Matching validity attribute  | Built-in validation message       |
 * | <template>  | No  | Any invalid                  | Built-in validation message       |
 * | <template>  | Yes | Matching validity attribute  | The <template>'s content          |
 * | Text        | -   | Always customError           | Author's text content             |
 */

import { expect, test } from "@playwright/test";
import { setBodyHTML } from "./helpers.js";

test.describe("display content: empty children + boolean validity", () => {
	test("shows the built-in validation message for any invalid state", async ({
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

		const builtin = await page
			.getByTestId("email")
			.evaluate(node => node.validationMessage);
		await expect(page.getByTestId("output")).toHaveText(builtin);
	});
});

test.describe("display content: empty children + string validity", () => {
	test.fixme("shows built-in message only when control's validity matches", async ({
		page,
	}) => {
		await setBodyHTML(
			page,
			`<form>
					<input id="email" data-testid="email" name="email" type="email" required>
					<output is="validity-output" data-testid="output" for="email" validity="valuemissing"></output>
					<button type="submit" data-testid="submit">Submit</button>
				</form>`,
		);

		const email = page.getByTestId("email");
		const output = page.getByTestId("output");
		const submit = page.getByTestId("submit");

		await submit.click();
		const valueMissingMessage = await email.evaluate(
			node => node.validationMessage,
		);
		await expect(output).toHaveText(valueMissingMessage);

		await email.fill("not-an-email");
		await submit.click();
		await expect(output).toHaveText("");
	});
});

test.describe("display content: <template> child + boolean validity", () => {
	test("ignores <template> and shows the built-in message", async ({
		page,
	}) => {
		await setBodyHTML(
			page,
			`<form>
				<input id="email" data-testid="email" name="email" type="email" required>
				<output is="validity-output" data-testid="output" for="email" validity>
					<template>Custom should be ignored</template>
				</output>
				<button type="submit" data-testid="submit">Submit</button>
			</form>`,
		);

		await page.getByTestId("submit").click();

		const builtin = await page
			.getByTestId("email")
			.evaluate(node => node.validationMessage);
		const output = page.getByTestId("output");
		await expect(output).toContainText(builtin);
		await expect(output).not.toContainText("Custom should be ignored");
	});
});

test.describe("display content: <template> child + string validity", () => {
	test.fixme("renders the template content for the matching validity", async ({
		page,
	}) => {
		await setBodyHTML(
			page,
			`<form>
					<input id="email" data-testid="email" name="email" type="email" required>
					<output is="validity-output" data-testid="output" for="email" validity="valuemissing">
						<template>Fill the email to help us contact you.</template>
					</output>
					<button type="submit" data-testid="submit">Submit</button>
				</form>`,
		);

		await page.getByTestId("submit").click();

		await expect(page.getByTestId("output")).toHaveText(
			"Fill the email to help us contact you.",
		);
	});

	test.fixme("does not render template content when validity does not match", async ({
		page,
	}) => {
		await setBodyHTML(
			page,
			`<form>
					<input id="email" data-testid="email" name="email" type="email" required>
					<output is="validity-output" data-testid="output" for="email" validity="typemismatch">
						<template>Use a valid email.</template>
					</output>
					<button type="submit" data-testid="submit">Submit</button>
				</form>`,
		);

		await page.getByTestId("submit").click();

		await expect(page.getByTestId("output")).toHaveText("");
	});
});

test.describe("display content: text children", () => {
	test.fixme("text content is shown only when control has customError", async ({
		page,
	}) => {
		await setBodyHTML(
			page,
			`<form>
					<input id="email" data-testid="email" name="email" type="email" required>
					<output is="validity-output" data-testid="output" for="email">Something wrong from the server-side.</output>
					<button type="submit" data-testid="submit">Submit</button>
				</form>`,
		);

		const email = page.getByTestId("email");
		const output = page.getByTestId("output");
		const submit = page.getByTestId("submit");

		await email.fill("user@example.com");
		await submit.click();
		await expect(output).toHaveText("");

		await email.evaluate(node =>
			node.setCustomValidity("Something wrong from the server-side."),
		);
		await submit.click();
		await expect(output).toHaveText("Something wrong from the server-side.");
	});

	test("text + validity attribute treats text as the built-in message override", async ({
		page,
	}) => {
		// Per proposal: "Text | (Ignored) | Always customError | Author's text content".
		// The validity attribute is ignored when text children are present.
		await setBodyHTML(
			page,
			`<form>
				<input id="email" data-testid="email" name="email" type="email" required>
				<output is="validity-output" data-testid="output" for="email" validity="typemismatch">Enter a valid email address.</output>
				<button type="submit" data-testid="submit">Submit</button>
			</form>`,
		);

		await page
			.getByTestId("email")
			.evaluate(node => node.setCustomValidity("Enter a valid email address."));
		await page.getByTestId("submit").click();

		await expect(page.getByTestId("output")).toHaveText(
			"Enter a valid email address.",
		);
	});
});
