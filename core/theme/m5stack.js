/**
 * @license
 * Copyright 2018 Google LLC
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
 * @fileoverview M5Stack theme.
 * Contains multi-coloured border to create shadow effect.
 */
'use strict';

goog.provide('Blockly.Themes.M5Stack');

goog.require('Blockly.Theme');


// Temporary holding object.
Blockly.Themes.M5Stack = {};

Blockly.Themes.M5Stack.defaultBlockStyles = {
  "colour_blocks": {
    "colourPrimary": "20"
  },
  "list_blocks": {
    "colourPrimary": "#2EC4B6"
  },
  "logic_blocks": {
    "colourPrimary": "#22559C"
  },
  "loop_blocks": {
    "colourPrimary": "#58C9B9"
  },
  "math_blocks": {
    "colourPrimary": "#30A9DE"
  },
  "procedure_blocks": {
    "colourPrimary": "290"
  },
  "text_blocks": {
    "colourPrimary": "#F17F42"
  },
  "variable_blocks": {
    "colourPrimary": "#791E94"
  },
  "variable_dynamic_blocks": {
    "colourPrimary": "#791E94"
  },
  "hat_blocks": {
    "colourPrimary": "330",
    "hat": "cap"
  }
};

Blockly.Themes.M5Stack.categoryStyles = {
  "colour_category": {
    "colour": "20"
  },
  "list_category": {
    "colour": "#2EC4B6"
  },
  "logic_category": {
    "colour": "#22559C"
  },
  "loop_category": {
    "colour": "#58C9B9"
  },
  "math_category": {
    "colour": "#30A9DE"
  },
  "procedure_category": {
    "colour": "290"
  },
  "text_category": {
    "colour": "#F17F42"
  },
  "variable_category": {
    "colour": "#791E94"
  },
  "variable_dynamic_category": {
    "colour": "#791E94"
  }
};

Blockly.Themes.M5Stack =
    new Blockly.Theme('m5stack', Blockly.Themes.M5Stack.defaultBlockStyles,
        Blockly.Themes.M5Stack.categoryStyles);
