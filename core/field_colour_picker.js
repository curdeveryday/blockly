/**
 * @license
 * Copyright 2012 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
* @fileoverview Colour picker field.
* @author hugh@m5stack.com (Hugh Young)
*/
'use strict';

goog.provide('Blockly.FieldColourPicker');

goog.require('Blockly.Css');
goog.require('Blockly.Events');
goog.require('Blockly.Field');
goog.require('Blockly.fieldRegistry');
goog.require('Blockly.DropDownDiv');
goog.require('Blockly.utils.aria');
goog.require('Blockly.utils.colour');
goog.require('Blockly.utils.dom');
goog.require('Blockly.utils.IdGenerator');
goog.require('Blockly.utils.KeyCodes');
goog.require('Blockly.utils.object');
goog.require('Blockly.utils.Size');

Blockly.FieldColourPicker = function (opt_value, opt_validator, opt_config) {
    Blockly.FieldColourPicker.superClass_.constructor.call(this, opt_value, opt_validator);

    this.value_ = '#FFFFFF';
}
Blockly.utils.object.inherits(Blockly.FieldColourPicker, Blockly.Field);

Blockly.FieldColourPicker.prototype.SERIALIZABLE = true;

Blockly.FieldColourPicker.prototype.mouseDownWrapper_ = null;

Blockly.FieldColourPicker.fromJson = function (options) {
    var value = Blockly.utils.replaceMessageReferences(options['value']);
    return new Blockly.FieldColourPicker(value);
};

Blockly.FieldColourPicker.prototype.initView = function () {
    this.createView_();
}

Blockly.FieldColourPicker.prototype.getValue = function () {
    return this.value_;
}

Blockly.FieldColourPicker.prototype.createView_ = function () {
    this.size_ = new Blockly.utils.Size(
        this.constants_.FIELD_COLOUR_DEFAULT_WIDTH,
        this.constants_.FIELD_COLOUR_DEFAULT_HEIGHT);
    if (!this.constants_.FIELD_COLOUR_FULL_BLOCK) {
        this.createBorderRect_();
        this.borderRect_.style['fillOpacity'] = '1';
    } else {
        this.clickTarget_ = this.sourceBlock_.getSvgRoot();
    }
}

Blockly.FieldColourPicker.prototype.onMouseDown = function (event) {
    var _this = this;
    var colorInput = document.createElement('input');
    colorInput.type = 'color';
    colorInput.onchange = function (_ev) {
        _this.setValue(_ev.target.value);
        console.log(_this);
        colorInput = null;
    }
    colorInput.click();

    event.stopPropagation();
    event.preventDefault();
}

Blockly.FieldColourPicker.prototype.bindEvents_ = function () {
    if (this.sourceBlock_.isInFlyout) return;
    Blockly.FieldColourPicker.superClass_.bindEvents_.call(this);

    var target_ = this.getClickTarget_();
    this.mouseDownWrapper_ = Blockly.bindEventWithChecks_(target_, 'mousedown', this, this.onMouseDown);
}

Blockly.FieldColourPicker.prototype.doClassValidation_ = function (opt_newValue) {
    if (typeof opt_newValue != 'string') {
        return null;
    }
    return Blockly.utils.colour.parse(opt_newValue);
};

Blockly.FieldColourPicker.prototype.doValueUpdate_ = function (newValue) {
    this.value_ = newValue;
    if (this.borderRect_) {
        this.borderRect_.style.fill = newValue;
    } else if (this.sourceBlock_) {
        this.sourceBlock_.pathObject.svgPath.setAttribute('fill', newValue);
        this.sourceBlock_.pathObject.svgPath.setAttribute('stroke', '#FFFFFF');
    }
}

Blockly.fieldRegistry.register('field_colour_picker', Blockly.FieldColourPicker);