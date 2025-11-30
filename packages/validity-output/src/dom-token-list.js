/**
 * @typedef {Object} DOMTokenListOptions
 * @property {string[]} DOMTokenListOptions.supportedTokens - The supported
 *     tokens.
 */

/** @see https://developer.mozilla.org/en-US/docs/Web/API/DOMTokenList */
export class FakeDOMTokenList {
	#list = document.createElement("div").classList;
	#supported = [];

	get length() {
		return this.#list.length;
	}

	get value() {
		return this.#list.value;
	}

	set value(val) {
		this.#list.value = val;
	}

	/**
	 * @type {DOMTokenListOptions=} options - Options for the DOMTokenList.
	 */
	constructor(options) {
		this.#supported = options?.supportedTokens ?? [];
	}

	/**
	 * @param {string} token
	 * @returns {boolean}
	 */
	supports(token) {
		return this.#supported.length
			? this.#supported.includes(token)
			: this.#list.supports(token);
	}

	item(...args) {
		return this.#list.item(...args);
	}
	contains(...args) {
		return this.#list.contains(...args);
	}
	add(...args) {
		return this.#list.add(...args);
	}
	remove(...args) {
		return this.#list.remove(...args);
	}
	replace(...args) {
		return this.#list.replace(...args);
	}
	entries(...args) {
		return this.#list.entries(...args);
	}
	toggle(...args) {
		return this.#list.toggle(...args);
	}
	forEach(...args) {
		return this.#list.forEach(...args);
	}
	keys(...args) {
		return this.#list.keys(...args);
	}
	values(...args) {
		return this.#list.values(...args);
	}
	toString(...args) {
		return this.#list.toString(...args);
	}
}
