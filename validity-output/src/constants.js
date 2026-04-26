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
export const VALIDITIES = [
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

export const ValidityToValidityState = {
	"badinput": "badInput",
	"customerror": "customError",
	"patternmismatch": "patternMismatch",
	"rangeoverflow": "rangeOverflow",
	"rangeunderflow": "rangeUnderflow",
	"stepmismatch": "stepMismatch",
	"toolong": "tooLong",
	"tooshort": "tooShort",
	"typemismatch": "typeMismatch",
	"valid": "valid",
	"valuemissing": "valueMissing",
};

/**
 * Options for the `reportedby` attribute or the `reportedBy` property.
 *
 * @readonly
 * @enum {string}
 */
export const ReportedBy = {
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

