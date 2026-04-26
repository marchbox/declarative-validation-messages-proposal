/**
 * Shared helpers for WPT-style integration tests.
 *
 * Each test navigates to /tests/index.html (which loads the polyfill via a
 * module script), then injects markup into <body> with `setBodyHTML`. After
 * injection, the helper waits for `customElements.whenDefined("validity-output")`
 * so assertions don't race the upgrade.
 */

/**
 * Navigates to the test fixture and injects the given HTML into <body>.
 *
 * @param {import("@playwright/test").Page} page
 * @param {string} html
 */
export async function setBodyHTML(page, html) {
	await page.goto("/tests/index.html");
	await page.evaluate(async markup => {
		await customElements.whenDefined("validity-output");
		document.body.innerHTML = markup;
		// Allow connectedCallback / attributeChangedCallback to settle.
		await Promise.resolve();
	}, html);
}
