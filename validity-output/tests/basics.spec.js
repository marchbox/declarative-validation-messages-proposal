import { expect, test } from "@playwright/test";
import { setContent } from "./utils.js";

test("should display any built-in validation messages", async ({ page }) => {
	const input = page.getByTestId("input");
	const output = page.getByTestId("output");

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
    </form>
	  `,
	);

	await form.evaluate(node => node.reportValidity());

	await expect(output).toHaveText(
		await input.evaluate(node => node.validationMessage),
	);

	await input.fill("invalidemail");

	await form.evaluate(node => node.reportValidity());

	await expect(output).toHaveText(
		await input.evaluate(node => node.validationMessage),
	);
});

test("should display built-in validation message for given validity", async ({
	page,
}) => {
	const input = page.getByTestId("input");
	const output = page.getByTestId("output");

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
    </form>
	  `,
	);

	await form.evaluate(node => node.reportValidity());

	await expect(output).toHaveText(
		await input.evaluate(node => node.validationMessage),
	);

	await input.fill("invalidemail");

	await form.evaluate(node => node.reportValidity());

	await expect(output).toHaveText("");
});

test("should display built-in validation messages for given validities", async ({
	page,
}) => {
	const input = page.getByTestId("input");
	const output = page.getByTestId("output");

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
    </form>
	  `,
	);

	await form.evaluate(node => node.reportValidity());

	await expect(output).toHaveText(
		await input.evaluate(node => node.validationMessage),
	);

	await input.fill("invalidemail");

	await form.evaluate(node => node.reportValidity());

	await expect(output).toHaveText(
		await input.evaluate(node => node.validationMessage),
	);
});

test("should display custom message from the <template> child", async ({
	page,
}) => {
	const output = page.getByTestId("output");

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
      >
      	<template>Something went wrong</template>
      </output>
    </form>
	  `,
	);

	await form.evaluate(node => node.reportValidity());

	await expect(output).toHaveText("Something went wrong");
});

test("should display custom message from the first <template> child", async ({
	page,
}) => {
	const output = page.getByTestId("output");

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
      >
      	<template>Something went wrong</template>
      	<template>Should not be displayed</template>
      </output>
    </form>
	  `,
	);

	await form.evaluate(node => node.reportValidity());

	await expect(output).toHaveText("Something went wrong");
});

test("should display custom message for given validities", async ({ page }) => {
	const input = page.getByTestId("input");
	const output1 = page.getByTestId("output-valuemissing");
	const output2 = page.getByTestId("output-typemismatch");

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
        data-testid="output-valuemissing"
      >
      	<template>value missing</template>
      </output>
      <output
        for="email"
        is="validity-output"
        validity="typemismatch"
        data-testid="output-typemismatch"
      >
      	<template>type mismatch</template>
      </output>
    </form>
	  `,
	);

	await form.evaluate(node => node.reportValidity());

	await expect(output1).toHaveText("value missing");
	await expect(output2).toHaveText("");

	await input.fill("invalidemail");

	await form.evaluate(node => node.reportValidity());

	await expect(output1).toHaveText("");
	await expect(output2).toHaveText("type mismatch");
});

test("should display custom message from the <output> content", async ({
	page,
}) => {
	test.fixme();

	const input = page.getByTestId("input");
	const output = page.getByTestId("output");
	const form = page.locator("form");

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
      >
      	Something went wrong
      </output>
    </form>
	  `,
	);

	await expect(output).toHaveText("Something went wrong");

	await input.fill("user@example.com");
	await form.evaluate(node => node.reportValidity());

	await expect(output).toHaveText("");
});
