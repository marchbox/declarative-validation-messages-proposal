/**
 * Navigates to the test fixture and injects the given HTML into <body>.
 *
 * @param {import("@playwright/test").Page} page
 * @param {string} html
 */
export async function setContent(page, html) {
	await page.goto("/tests/");
	await page.evaluate(async markup => {
		await customElements.whenDefined("validity-output");
		document.body.innerHTML = markup;
		// Allow connectedCallback / attributeChangedCallback to settle.
		await Promise.resolve();
	}, html);
}
