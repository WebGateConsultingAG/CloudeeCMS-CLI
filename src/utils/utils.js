/**
 * Copyright WebGate Consulting AG, 2020
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at:
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or
 * implied. See the License for the specific language governing
 * permissions and limitations under the License.
 *
 */
import { Text } from './texts';
import { TemplateTypes, FieldVars } from './constants';
import { Message } from './message';

export class Utils {
  /**
   * Check if there is a TemplateType defined for a given Type
   * can return null
   *
   * @param {string} type
   * @returns {Object | null}
   */

  static findTemplateType(type) {
    switch (type) {
      case TemplateTypes.LAYOUT.type:
        return TemplateTypes.LAYOUT;
      case TemplateTypes.LAYOUTBLOCK.type:
        return TemplateTypes.LAYOUTBLOCK;
      case TemplateTypes.MICROTEMPLATE.type:
        return TemplateTypes.MICROTEMPLATE;
      default:
        Message.info(Text.parse(Text.utilNoTemplateTypeFound, type, type));
        return null;
    }
  }

  /**
   *
   * Check if a fieldName is in a Array of Fields
   *
   * @param {Array} fields
   * @param {string} fieldName
   * @returns {boolean}
   */
  static fieldExist(fields, fieldName) {
    return fields.some((field) => field.fldName === fieldName);
  }

  /**
   *
   * Get a sequence from the pug template and looking for the first end of the }
   *
   * @param {string} sequence
   */
  static getFieldName(sequence) {
    return sequence.indexOf(FieldVars.END) > 0 ? sequence.split(FieldVars.END)[0] : null;
  }
  /**
   * Remove useless tabs, spaces and linebreaks from script and then add the sign to be pug compatible
   * @param {string} js
   */
  static compressJS(js) {
    js = js.replace(/\n/g, '');
    js = js.replace(/\r/g, '');
    js = js.replace(/\t/g, '');
    while (js.indexOf('  ') > -1) {
      js = js.replace(/\s\s/g, '');
    }
    return '- ' + js;
  }
}
