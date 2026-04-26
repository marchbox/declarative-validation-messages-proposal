import { expect, test } from "@playwright/test";
import { setBodyHTML } from "./helpers.js";

test.describe("multiple display elements per form control", () => {
	test.fixme("each matching display element shows its own message", async ({
		page,
	}) => {
		await setBodyHTML(
			page,
			`<form>
				<input id="email" data-testid="email" name="email" type="email" required>
				<output is="validity-output" data-testid="output-vm" id="vm" for="email" validity="valuemissing">
					<template>Fill the email to help us contact you.</template>
				</output>
				<output is="validity-output" data-testid="output-tm" id="tm" for="email" validity="typemismatch">
					<template>Use a valid email.</template>
				</output>
				<button type="submit" data-testid="submit">Submit</button>
			</form>`,
		);

		const email = page.getByTestId("email");
		const vm = page.getByTestId("output-vm");
		const tm = page.getByTestId("output-tm");
		const submit = page.getByTestId("submit");

		await submit.click();
		await expect(vm).toHaveText("Fill the email to help us contact you.");
		await expect(tm).toHaveText("");

		await email.fill("not-an-email");
		await submit.click();
		await expect(vm).toHaveText("");
		await expect(tm).toHaveText("Use a valid email.");
	});

	test.fixme("all matching display elements get :invalid", async ({ page }) => {
		await setBodyHTML(
			page,
			`<form>
				<input id="email" data-testid="email" name="email" type="email" required>
				<output is="validity-output" data-testid="output-a" id="a" for="email" validity></output>
				<output is="validity-output" data-testid="output-b" id="b" for="email" validity></output>
				<button type="submit" data-testid="submit">Submit</button>
			</form>`,
		);

		await page.getByTestId("submit").click();

		await expect(
			page.getByTestId("output-a").locator(":scope:invalid"),
		).toHaveCount(1);
		await expect(
			page.getByTestId("output-b").locator(":scope:invalid"),
		).toHaveCount(1);
	});

	test.fixme("control's ariaErrorMessageElements references all matching display elements", async ({
		page,
	}) => {
		await setBodyHTML(
			page,
			`<form>
					<input id="email" data-testid="email" name="email" type="email" required>
					<output is="validity-output" data-testid="output-a" id="a" for="email" validity></output>
					<output is="validity-output" data-testid="output-b" id="b" for="email" validity></output>
					<button type="submit" data-testid="submit">Submit</button>
				</form>`,
		);

		await page.getByTestId("submit").click();

		const refs = await page.getByTestId("email").evaluate(input => {
			const list = input.ariaErrorMessageElements ?? [];
			return {
				includesA: list.includes(document.getElementById("a")),
				includesB: list.includes(document.getElementById("b")),
			};
		});
		expect(refs).toEqual({ includesA: true, includesB: true });
	});
});
