import { FakeDOMTokenList } from "./dom-token-list.js";

/**
 * @typedef {(HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement)} FormControl
 */

/**
 * @typedef {(
 *   | "badinput"
 *   | "customerror"
 *   | "patternmismatch"
 *   | "rangeoverflow"
 *   | "rangeunderflow"
 *   | "stepmismatch"
 *   | "toolong"
 *   | "tooshort"
 *   | "typemismatch"
 *   | "valid"
 *   | "valuemissing"
 * )} Validity
 */

/**
 * The built-in validities.
 *
 * @type {Validity[]}
 * @constant
 */
const VALIDITIES = [
	"badinput",
	"customerror",
	"patternmismatch",
	"rangeoverflow",
	"rangeunderflow",
	"stepmismatch",
	"toolong",
	"tooshort",
	"typemismatch",
	"valid",
	"valuemissing",
];

/**
 * Options for the `reportedby` attribute or the `reportedBy` property.
 *
 * @readonly
 * @enum {string}
 */
const ReportedBy = {
	// The output element displays and clears the validation message, if any, when
	// its associated form control element receives an `input` event and when its
	// associated form element receives a `submit` event.
	ANY: "any",

	// The output element only displays and clears the validation message, if any,
	// when its associated form element receives a `submit` event.
	SUBMIT: "submit",

	// The output element only displays and clears the validation message, if any,
	// when its `reportValidity()` method is called with a developer-specified
	// mechanism.
	NONE: "none",
};

export class ValidityOutput extends HTMLOutputElement {
	static get observedAttributes() {
		return ["for", "validity", "reportedby"];
	}

	/**
	 * AbortController for aborting upon element disconnection.
	 * @type {AbortController}
	 */
	#abort = new AbortController();

	/**
	 * Reference to the associated control element.
	 * @type {?WeakRef<FormControl>}
	 */
	#controlRef = null;

	/**
	 * A DOMTokenList of the provided validities.
	 * @type {DOMTokenList}
	 */
	#validityList = new FakeDOMTokenList({
		supportedTokens: VALIDITIES,
	});

	/**
	 * The associated form control element.
	 * @type {?FormControl}
	 * @readonly
	 */
	get control() {
		if (!this.#controlRef?.deref()?.isConnected) {
			this.#controlRef = null;
		}
		return this.#controlRef?.deref();
	}

	/**
	 * When the output element displays the validation message, if any.
	 *
	 * @attr reportedby
	 * @default ReportedBy.SUBMIT
	 * @type {ReportedBy}
	 */
	reportedBy = ReportedBy.SUBMIT;

	/**
	 * The validites that the output element displays the validation message for.
	 * it’s a space-separated list of strings that match the Constraint Validation
	 * API’s `ValidityState` keys, but in all-lower case.
	 *
	 * @attr validity
	 * @type {Validity}
	 */
	validity = "";

	/**
	 * A `DOMTokenList` that represents a list of valid values in the `validity`
	 * attribute separated by whitespaces.
	 * @type {DOMTokenList}
	 * @readonly
	 */
	get validityList() {
		return this.#validityList;
	}

	disconnectedCallback() {
		this.#abort.abort();
	}

	attributeChangedCallback(name, prev, next) {
		if (prev === next) {
			return;
		}

		switch (name) {
			case "for":
				this.#controlRef = new WeakRef(
					this.getRootNode().getElementById(this.htmlFor),
				);
				this.#listenControlInvalid();
				break;
			case "validity":
				this.validity = next;
				this.#validityList.value = next;
				break;
			case "reportedby":
				this.reportedBy = Object.values(ReportedBy).includes(next)
					? next
					: ReportedBy.SUBMIT;
				break;
		}
	}

	#listenControlInvalid() {
		if (!this.control?.isConnected) {
			return;
		}

		this.control.addEventListener(
			"invalid",
			evt => {
				evt.preventDefault();
				if (!this.control?.isConnected) {
					return;
				}
				this.value = this.control.validationMessage;
			},
			{ signal: this.#abort.signal },
		);

		this.control.addEventListener(
			"input",
			() => {
				this.value = "";
			},
			{ signal: this.#abort.signal },
		);
	}
}
