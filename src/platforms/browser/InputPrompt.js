/**
 * @license
 * This file is part of the Game Closure SDK.
 *
 * The Game Closure SDK is free software: you can redistribute it and/or modify
 * it under the terms of the Mozilla Public License v. 2.0 as published by Mozilla.

 * The Game Closure SDK is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * Mozilla Public License v. 2.0 for more details.

 * You should have received a copy of the Mozilla Public License v. 2.0
 * along with the Game Closure SDK.  If not, see <http://mozilla.org/MPL/2.0/>.
 */

/**
 * package timestep.env.browser.InputPrompt;
 *
 * Prompt the user manually for input.
 *
 * ??? TODO Move this to debug, probably. A native modal prompt has no place
 *          in game code.
 */

exports = Class(function () {
	var defaults = {
		onChange: function () {},
		title: '',
		message: '',
		value: '',
		prompt: ''
	}

	this.init = function (opts) {
		opts = merge(opts, defaults);
		this.onChange = opts.onChange;
		this._value = opts.value;
		this._message = opts.title || opts.message || opts.prompt;
	};

	this.show = function () {
		var value = window.prompt(this._message, this._value);
		if (value !== null) { // returns null if user presses cancel
			this._value = value;
			this.onChange(value);
		} else {
			// TODO: do something else on cancel?
			this.onChange(value);
		}
	};

	this.getValue = function () {
		return this._value;
	};

	this.setValue = function (value) {
		this._value = value;
	};

	this.setMessage = function (message) {
		this._message = message;
	};

	this.requestFocus = function() { this.show(); }

	this.closeEditField = function() {}

	this.refresh = function() {}
});
