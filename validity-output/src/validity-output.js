import {
	ReportedBy,
	VALIDITIES,
	ValidityToValidityState,
} from "./constants.js";
import { FakeDOMTokenList } from "./dom-token-list.js";

/**
 * @import { FormControl, Validity } from "./constants.js"
 */

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
				this.validityList.value = next;
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
				this.value = this.#getControlValidationMessage();
			},
			{ signal: this.#abort.signal },
		);

		this.control.addEventListener(
			"input",
			() => {
				if (this.reportedBy === ReportedBy.ANY) {
					this.value = "";
				}
			},
			{ signal: this.#abort.signal },
		);
	}

	#getControlValidationMessage() {
		let message = "";

		if (this.validityList.length) {
			for (const v of this.validityList.values()) {
				if (
					this.control.validity[ValidityToValidityState[v.toLowerCase()]]
				) {
					message = this.control.validationMessage;
					break;
				}
			}
		} else {
			message = this.control.validationMessage;
		}

		return message;
	}
}
