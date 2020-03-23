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
* @fileoverview Colour matrix input field.
* @author hugh@m5stack.com (Hugh Young)
*/
'use strict';

goog.provide('Blockly.FieldColourMatrix');

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

Blockly.FieldColourMatrix = function (opt_value, opt_validator, opt_config) {
    Blockly.FieldColourMatrix.superClass_.constructor.call(this, opt_value, opt_validator);

    this.size_ = new Blockly.utils.Size(185, 180);

    this.matrix_ = Array.from({ length: 5 }, function(line){
        return Array.from({ length: 5 }, function(row) {
            return '#000000';
        });
    });

    this.value_ = this.matrix_.toString().replace(/#/g, '0x').replace(/0x000000/g, '0');
}
Blockly.utils.object.inherits(Blockly.FieldColourMatrix, Blockly.Field);

Blockly.FieldColourMatrix.prototype.SERIALIZABLE = true;

Blockly.FieldColourMatrix.prototype.CURSOR = 'pointer';

Blockly.FieldColourMatrix.prototype.MODE_ON = 'ON';

Blockly.FieldColourMatrix.prototype.MODE_OFF = 'OFF';

Blockly.FieldColourMatrix.prototype.DEFAULT_COLOR = '#000000';

Blockly.FieldColourMatrix.prototype.fillColor_ = '#FFFFFF';

Blockly.FieldColourMatrix.prototype.isMouseDown_ = false;

Blockly.FieldColourMatrix.prototype.mode_ = Blockly.FieldColourMatrix.prototype.MODE_ON;

Blockly.FieldColourMatrix.prototype.mouseDownWrapper_ = null;

Blockly.FieldColourMatrix.prototype.mouseMoveWrapper_ = null;

Blockly.FieldColourMatrix.prototype.mouseUpWrapper_ = null;

Blockly.FieldColourMatrix.fromJson = function (options) {
    var value = Blockly.utils.replaceMessageReferences(options['value']);
    return new Blockly.FieldColourMatrix(value);
}

Blockly.FieldColourMatrix.prototype.initView = function () {
    this.createView_();
}

Blockly.FieldColourMatrix.prototype.getValue = function() {
    return this.matrix_.toString().replace(/#/g, '0x').replace(/0x000000/g, '0') || '';
}

Blockly.FieldColourMatrix.prototype.updateValue = function(x, y, value) {
    this.matrix_[x][y] = value;
}

Blockly.FieldColourMatrix.prototype.dontHandleMouseEvent_ = function(event) {
    event.stopPropagation();
    event.preventDefault();
}

Blockly.FieldColourMatrix.prototype.clearHandleMouseEvent_ = function(ev) {
    this.isMouseDown_ = false;
    this.mode_ = this.MODE_ON;

    var svgRoot = this.sourceBlock_.getSvgRoot();

    svgRoot.removeEventListener('mousedown', this.dontHandleMouseEvent_);
    svgRoot.removeEventListener('mousemove', this.dontHandleMouseEvent_);

    if(this.mouseMoveWrapper_) {
        Blockly.unbindEvent_(this.mouseMoveWrapper_);
        this.mouseMoveWrapper_ = null;
    }

    if(this.mouseUpWrapper_) {
        Blockly.unbindEvent_(this.mouseUpWrapper_);
        this.mouseUpWrapper_ = null;
    }

    Blockly.Touch.clearTouchIdentifier();

    ev.stopPropagation();
    ev.preventDefault();
}

Blockly.FieldColourMatrix.prototype.onMouseDown = function(ev) {
    Blockly.hideChaff();
    this.sourceBlock_.select();

    if(Blockly.DropDownDiv.owner_) {
        Blockly.DropDownDiv.hideIfOwner(Blockly.DropDownDiv.owner_);
    }

    var svgRoot = this.sourceBlock_.getSvgRoot();

    svgRoot.addEventListener('mousedown', this.dontHandleMouseEvent_);
    svgRoot.addEventListener('mousemove', this.dontHandleMouseEvent_);

    this.isMouseDown_ = true;
    var currentColor = ev.target.getAttribute('fill');
    if(currentColor === this.fillColor_ && currentColor !== this.DEFAULT_COLOR) {
        this.setDefaultColor(ev.target);
        this.mode_ = this.MODE_OFF;
    } else {
        this.updateColor(ev.target);
    }
    this.updateValue(ev.target.getAttribute('data-x'), ev.target.getAttribute('data-y'), ev.target.getAttribute('fill'));

    this.mouseMoveWrapper_ = Blockly.bindEventWithChecks_(this.getClickTarget_(), 'mousemove', this, this.onMouseMove);
    this.mouseUpWrapper_ = Blockly.bindEventWithChecks_(document, 'mouseup', this, this.clearHandleMouseEvent_);

    ev.stopPropagation();
    ev.preventDefault();
}

Blockly.FieldColourMatrix.prototype.onMouseMove = function(ev) {
    if(!this.isMouseDown_) return;
    if (this.mode_ === this.MODE_OFF) {
        this.setDefaultColor(ev.target);
    } else {
        if (ev.target.getAttribute('fill') !== this.fillColor_) {
            this.updateColor(ev.target);
        }
    }
    this.updateValue(ev.target.getAttribute('data-x'), ev.target.getAttribute('data-y'), ev.target.getAttribute('fill'));
}

Blockly.FieldColourMatrix.prototype.onMouseUp = function(ev) {
    this.isMouseDown_ = false;
    this.mode_ = this.MODE_ON;

    if(this.mouseUpWrapper_) {
        Blockly.unbindEvent_(this.mouseUpWrapper_);
        this.mouseUpWrapper_ = null;
    }
}

Blockly.FieldColourMatrix.prototype.bindEvents_ = function () {
    if(this.sourceBlock_.isInFlyout) return;
    Blockly.FieldColourMatrix.superClass_.bindEvents_.call(this);

    var target_ = this.getClickTarget_();
    this.mouseDownWrapper_ = Blockly.bindEventWithChecks_(target_, 'mousedown', this, this.onMouseDown);
}

Blockly.FieldColourMatrix.prototype.createView_ = function () {
    this.movableGroup_ = Blockly.utils.dom.createSvgElement('g',
        {
            'transform': 'translate(0,5)'
        }, this.fieldGroup_);
    var scaleGroup = Blockly.utils.dom.createSvgElement('g',
        {
            'transform': 'scale(1.5)'
        }, this.movableGroup_);
    this.matrixGroup_ = Blockly.utils.dom.createSvgElement('g',
        {
            'class': 'colourMatrixBody'
        }, scaleGroup);
    for (var line = 0; line < 5; line++) {
        for (var row = 0; row < 5; row++) {
            Blockly.utils.dom.createSvgElement('rect',
                {
                    'class': 'colourMatrixBody',
                    'x': 8 + (22 * row),
                    'y': 22 * line,
                    'width': 20,
                    'height': 20,
                    'fill': this.matrix_[line][row],
                    'data-x': line,
                    'data-y': row
                }, this.matrixGroup_);
        }
    }
}

Blockly.FieldColourMatrix.prototype.updateColor = function(rect) {
    if(rect) {
        rect.setAttribute('fill', this.fillColor_);
    }
}

Blockly.FieldColourMatrix.prototype.setDefaultColor = function(rect) {
    if(rect) {
        rect.setAttribute('fill', this.DEFAULT_COLOR);
    }
}

Blockly.FieldColourMatrix.prototype.setFillColor = function(color) {
    if(!color) {
        this.fillColor_ = '#000000';
    } else {
        this.fillColor_ = color;
    }
}

Blockly.FieldColourMatrix.prototype.getFillColor = function() {
    return this.fillColor_;
}

Blockly.FieldColourMatrix.prototype.toXml = function(el) {
    el.setAttribute('matrix', this.matrix_.toString());
    return el;
}

Blockly.FieldColourMatrix.prototype.fromXml = function(el) {
    var matrixStr = el.getAttribute('matrix');
    if(matrixStr) {
        var matrixArr = matrixStr.split(',');
        for(var line = 0; line < 5; line++) {
            for(var row = 0; row < 5; row++) {
                this.matrix_[line][row] = matrixArr[line * 5 + row];
            }
        }
        this.setValue(matrixStr);
    }
}

Blockly.fieldRegistry.register('field_colour_matrix', Blockly.FieldColourMatrix);