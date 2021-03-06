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

import device;
import ui.TextView as TextView;
import ui.ImageScaleView as ImageScaleView;

var EditText = device.get('EditText');

exports = Class(ImageScaleView, function(supr) {

    var defaults = {
        color: 'black',
        hintColor: '#979797',
        paddingLeft: 20,
        paddingRight: 20,
        paddingTop: 0,
        paddingBottom: 0
    };

    this.init = function (opts) {
        this._opts = merge(opts || {}, defaults);
        supr(this, 'init', [this._opts]);

        this._textBox = new TextView(merge({
            x: this._opts.paddingLeft,
            y: this._opts.paddingTop,
            width: opts.width - this._opts.paddingLeft - this._opts.paddingRight,
            height: opts.height
        }, opts));
        this.addSubview(this._textBox);
        this._focused = false;
        this._textFilter = null;
        this._backTextEditView = null;
        this._forwardTextEditView = null;
        this._hint = this._opts.hintJs || this._opts.hint;
        this._hintSet = false;
        this._normalColor = this._opts.color;
        this._hintColor = this._opts.hintColor;
        this._editText = new EditText(merge({}, // avoid side effects
            merge(opts, {
                textEditView: this,
                onChange: bind(this, this.onChange),
                onFocusChange: bind(this, this.onFocusChange)
            })
        ));

        this.setText(this._opts.text);
    };

    this.onInputSelect = function () {
        this.requestFocus();
    };

    this.requestFocus = function () {
        this._focused = true;
        this._editText.requestFocus();
        this.refresh();
    }

    this.removeFocus = function () {
        this._editText.closeEditField();
    }

    this.refresh = function () {
        this._editText.refresh(this.getText(),
           this._backTextEditView != null,
           this._forwardTextEditView != null);
    }

    this.onFocusChange = function (focused) {
        if (focused) {
            this.emit('focusAdd');
        } else {
            this.emit('focusRemove');
        }
    }

    this.onChange = function (value) {
        var isProcessed;
        if (value !== this._textBox.getText()) {
            isProcessed = typeof this._textFilter === 'function';
            
            if (isProcessed) {
                value = this._textFilter(value); 
            } 

            this.setText(value);

            if (isProcessed) {
                this.refresh(); // update native EditText with processed values 
            }

            this.emit('Change', value);
        }
    }

    this.setBackward = function (view) {
        this._backTextEditView = view;
    }

    this.setForward = function (view) {
        this._forwardTextEditView = view;
    }

    /**
     * Accepts a function that takes one string argument
     * and returns a string. This can be used to process text
     * entered into the EditText.
     */
    this.registerTextFilter = function (fn) {
        this._textFilter = fn; 
    }

    this.getText = function() {
        var result;

        if (this._hintSet) {
            result = ''; 
        } else {
            result = this._textBox.getText();
        }

        return result;
    }

    this.setText = function (text) {
        if ((text == null || (text != null && text.length == 0)) && this._hint != null) {
            this._hintSet = true;
            text = this._hint;
            this._textBox._opts.color = this._hintColor;
        } else {
            this._hintSet = false;
            this._textBox._opts.color = this._normalColor; 
        }

        this._textBox.setText(text);
    }
});
